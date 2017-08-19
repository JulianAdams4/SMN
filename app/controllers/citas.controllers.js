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
    Cita.find({$or:[{start:{$gte:today}},{end:{$lte:tomorrow.toDate()}}]}, function(err, citas){
      if(err){
        return res.status(500).send({
          message: getErrorMessage(err)
        })
      } else {
        Paciente.populate(citas, {path: 'paciente'}, function(err, citas){
          for(var i in citas){
            if(citas[i].paciente){
              console.log(citas[i].paciente._id + ' ' + req.session.paciente._id);
              if(citas[i].paciente._id == req.session.paciente._id){
                citas[i].title = citas[i].paciente.nombres + ' ' + citas[i].paciente.apellidos;
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
      return res.status(201).json(cita);
    }
  });
};

exports.reservarCita = function(req, res){
  var _cita = {
    paciente: req.session.paciente,
    estaOcupado: true,
    backgroundColor: '#666',
    title: 'Ocupado'
  };
  Cita.findByIdAndUpdate(req.params.citaId, _cita, function(err, cita){
    if(err){
      return res.status(500).send({
        message: getErrorMessage(err)
      })
    } else {
      Cita.findById(req.params.citaId, function(err, cita){
        return res.status(200).json(cita);
      });
    }
  });
};

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
