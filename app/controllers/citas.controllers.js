'use stric';

var mongoose = require('mongoose');
var moment = require('moment');
var Cita = mongoose.model('Cita');
var Paciente = mongoose.model('Paciente');

var getErrorMessage = function(err){
  if (err.errors){
    for(var errName in err.errors){
      if(err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return 'Error de servidor desconocido';
  }
};

exports.listCitas = function(req, res){
  if(req.session.paciente){
    var today = new Date();
    var tomorrow = moment(today).add(1, 'days');
    Cita.find({start:{$gte:today}, $or:[{paciente: req.session.paciente._id}, {paciente: undefined}]}, function(err, citas){
      if(err){
        return res.status(500).send({
          message: getErrorMessage(err)
        })
      } else {
        Paciente.populate(citas, {path: 'paciente'}, function(err, citas){
          for(var i in citas){
            if(citas[i].paciente){
              //console.log(citas[i].paciente._id + ' ' + req.session.paciente._id);
              if(citas[i].paciente._id == req.session.paciente._id){
                citas[i].title = "Mi Cita";
              }
            }
          }
          return res.status(200).json(citas);
        });
      }
    });
  }else if(req.session.administrador){
    Cita.find({},function(err, citas){
      if(err){
        return res.status(500).send({
          message: getErrorMessage(err)
        })
      } else {
        Paciente.populate(citas, {path: 'paciente'}, function(err, citas){
          for(var i in citas){
            if(citas[i].paciente){
              citas[i].title = citas[i].paciente.nombres + ' ' + citas[i].paciente.apellidos;
            }
          }
          return res.status(200).json(citas);
        });
      }
    })
  }else{
    return res.status(500).json({ message: 'Debe iniciar sesión para ver esta información.',type: 'danger'});
  }
}
// crea horario
exports.createCita = function(req, res){
  var cita = Cita(req.body);
  var fechaFinal = moment(cita.start).add(cita.duracion,'m');
  Cita.find({
    $or: [
      {
        start: {
          $gte: cita.start,
          $lt: fechaFinal
        }
      },
      {
        end: {
          $gt: cita.start,
          $lte: fechaFinal
        }
      },
      {
        $and: [
          {
            start: {
              $gte: cita.start
            }
          },
          {
            end: {
              $lte: fechaFinal
            }
          }
        ]
      },
      {
        $and: [
          {
            start: {
              $lte: cita.start
            }
          },
          {
            end: {
              $gte: fechaFinal
            }
          }
        ]
      }
    ]
  }, function(err, citas){
    if(err){
      return res.status(500).send({
        message: getErrorMessage(err)
      });
    } else {
      if(citas.length == 0){
        cita.save(function(err, cita){
          if(err){
            return res.status(500).send({
              message: getErrorMessage(err)
            });
          } else {
            return res.status(201).json(cita);
          }
        });
      } else {
        return res.status(400).send({ message: 'Este horario ya se encuentra reservado.'});
      }
    }
  });
};

//separa la cita el paciente
exports.reservarCita = function(req, res){
  if(req.session.paciente){
    Cita.findById(req.params.citaId, function(err, cita){
      if(err){
        return res.status(500).send({
          message: getErrorMessage(err)
        })
      } 
      if(!cita){
        return res.status(404).send({
            message: 'No existe disponibilidad en el horario seleccionado. Si esto no se ve reflejado en el calendario, por favor actualice la página.',
            type: 'danger'});
      }else {
        var tiempoCita = moment(cita.start);
        var tiempoActual = moment(new Date());
        var duracion = moment.duration(tiempoCita.diff(tiempoActual));
        var horas = parseInt(duracion.asHours());
        if(cita.estaOcupado){
          return res.status(400).json({ message: 'No existe disponibilidad en el horario seleccionado. Si esto no se ve reflejado en el calendario, por favor actualice la página.',type: 'danger'});
        }else if (horas < 24){
          return res.status(500).json({ message: 'Solo puede separar citas hasta con 24 horas de anticipación.',type: 'danger'});
        }
        cita.paciente = req.session.paciente;
        cita.estaOcupado = true;
        cita.backgroundColor = '#666';
        cita.title = 'Mi Cita';
         cita.save(function(err){
            if(err){
              return res.status(500).send({
                message: getErrorMessage(err)
              })
            } else {
              return res.status(200).json(cita);
            }
          });
      }
    });
  }else{
    return res.status(500).json({ message: 'Debe iniciar sesión para separar una cita.',type: 'danger'});
  }
};

//Cancela la cita el paciente, se encuentra disponible una vez más.
exports.cancelarCita = function(req, res){
  Cita.findById(req.params.citaId, function(err, cita){
    if(err){
      return res.status(500).send({
        message: getErrorMessage(err)
      })
    }if(!cita){
      return res.status(404).send({
          message: 'No posee una cita en el horario seleccionado. Si esto no se ve reflejado en el calendario, por favor actualice la página.',
          type: 'danger'});
    } else {
      var tiempoCita = moment(cita.start);
      var tiempoActual = moment(new Date());
      var duracion = moment.duration(tiempoCita.diff(tiempoActual));
      var horas = parseInt(duracion.asHours());
      if (horas < 48){
        return res.status(500).json({ message: 'Solo puede cancelar citas hasta con 48 horas de anticipación.',type: 'danger'});
      }
      cita.paciente = undefined;
      cita.estaOcupado = false;
      cita.backgroundColor = '#449a2e';
      cita.title = 'Disponible';
       cita.save(function(err){
          if(err){
            return res.status(500).send({
              message: getErrorMessage(err)
            })
          } else {
            return res.status(200).json(cita);
          }
        });
    }
  });
};

//cancela la cita la nutricionista
exports.eliminarCita = function(req, res){
  Cita.findById(req.params.citaId, function(err, cita){
    if(err){
      return res.status(500).send({
        message: getErrorMessage(err)
      })
    }if(!cita){
      return res.status(404).send({
          message: 'No posee una cita en el horario seleccionado. Si esto no se ve reflejado en el calendario, por favor actualice la página.',
          type: 'danger'});
    } else {
      if(cita.estaOcupado){
        var tiempoCita = moment(cita.start);
        var tiempoActual = moment(new Date());
        var duracion = moment.duration(tiempoCita.diff(tiempoActual));
        var horas = parseInt(duracion.asHours());
        if (horas < 48){
           return res.status(500).send({ message: 'Solo puede cancelar citas hasta con 48 horas de anticipación.'});
        }
      }
      cita.remove(cita._id, function(err, cita){
        if(err){
          return res.status(500).send({
            message: getErrorMessage(err)
          })
        } else {
          return res.status(200).json(cita);
        }
      });
    }
  });
}
