'use strict';

var mongoose = require('mongoose');
var Antecedentes = mongoose.model('Antecedentes');

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

exports.antecedentesByPaciente = function(req, res){
  var pacienteId = req.params.pacienteId;
  Antecedentes.find({idPaciente:pacienteId}).populate('idPaciente')
    .exec(function (err, antecedentes) {
        if (err) {
          return res.status(400).send({
            message: getErrorMessage(err)
          });
        }
        return res.status(200).json(antecedentes);
    });
};

exports.list = function(req, res){
  Antecedentes.find({}, function(err, antecedentes){
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(antecedentes);
    }
  });
};

exports.createAntecedente = function(req, res){
  var antecedentes = new Antecedentes(req.body);
  antecedentes.save(function(err){
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      })
    } else {
      res.json(antecedentes);
    }
  });
};
