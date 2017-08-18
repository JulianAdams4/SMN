'use stric';

var mongoose = require('mongoose');
var Cita = mongoose.model('Cita');

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
  Cita.find({},function(err, citas){
    if(err){
      return res.status(500).send({
        message: getErrorMessage(err)
      })
    } else {
      return res.status(200).json(citas);
    }
  })
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
      Cita.findById(cita._id, function(err, cita){
        return res.status(200).json(cita);
      });
    }
  });
};
