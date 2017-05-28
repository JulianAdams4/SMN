'use strict';

var mongoose = require('mongoose');
var HistoriaAlimentaria = mongoose.model('HistoriaAlimentaria');

var getErrorMessage = function(err){
  if(err.errors){
    for(var errName in err.error){
      if(err.errors[errName].message){
        return err.errors[errName].message;
      }
    }
  } else {
    return 'Error de servidor desconocido';
  }
};

/*Permite obtener los datos de control por id del paciente y se incluye la
información del paciente con populate*/
exports.historiaAlimentariaByPaciente = function(req, res){
  var pacienteId = req.params.pacienteId;
  HistoriaAlimentaria.find({idPaciente: pacienteId, borrado: false}).populate('idPaciente')
    .exec(function (err, historiaAlimentaria) {
        if (err) {
          return res.status(400).send({
            message: getErrorMessage(err)
          });
        }
        return res.status(200).json(historiaAlimentaria);
    });
};

exports.list = function(req, res){
  HistoriaAlimentaria.find({borrado: false}, function(err, historiaAlimentaria){
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(historiaAlimentaria);
    }
  });
};

exports.createHistoriaAlimentaria = function(req, res){
  var historiaAlimentaria = new HistoriaAlimentaria(req.body);
  historiaAlimentaria.save(function(err){
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      })
    } else {
      res.json(historiaAlimentaria);
    }
  });
};

exports.deleteHistoria = function(req, res){
  var historiaAlimentariaId = req.params.historiaAlimentariaId;
  console.log(historiaAlimentariaId);
  HistoriaAlimentaria.findByIdAndUpdate(historiaAlimentariaId, {
    $set: {
      borrado: true
    }
  }, function(err, historiaAlimentaria) {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor' });
        } else {
            res.status(200).json(historiaAlimentaria);
        }
    });
};
