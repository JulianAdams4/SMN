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
    Cita.find({$or:[{start:{$gte:today}},{end:{$lte:tomorrow.toDate()}}], $or:[{paciente: req.session.paciente._id}, {paciente: undefined}]}, function(err, citas){
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
  } else {
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
  }
}

exports.createCita = function(req, res){
  var cita = Cita(req.body);
  cita.save(function(err, cita){
    if(err){
      return res.status(500).send({
        message: getErrorMessage(err)
      })
    } else {
      return res.status(200).json(cita);
    }
  });
};

//separa la cita el paciente
exports.reservarCita = function(req, res){
  var _cita = {
    paciente: req.session.paciente,
    estaOcupado: true,
    backgroundColor: '#666',
    title: 'Mi Cita'
  };
  Cita.findByIdAndUpdate(req.params.citaId, _cita, function(err, cita){
    if(err){
      return res.status(500).send({
        message: getErrorMessage(err)
      })
    } else {
      Cita.findById(cita._id, function(err, cita){
        return res.status(200).json(cita);
      });
    }
  });
};

//Cancela la cita el paciente, se encuentra disponible una vez más.
exports.cancelarCita = function(req, res){
  var _cita = {
    paciente: undefined,
    estaOcupado: false,
    backgroundColor: '#449a2e',
    title: 'Disponible'
  };
  Cita.findByIdAndUpdate(req.params.citaId, _cita, function(err, cita){
    if(err){
      return res.status(500).send({
        message: getErrorMessage(err)
      })
    } else {
      Cita.findById(cita._id, function(err, cita){
        return res.status(200).json(cita);
      });
    }
  });
};

//cancela la cita la nutricionista
exports.eliminarCita = function(req, res){
  Cita.findByIdAndRemove(req.params.citaId, function(err, cita){
    if(err){
      return res.status(500).send({
        message: getErrorMessage(err)
      })
    } else {
      return res.status(200).json(cita);
    }
  })
}
