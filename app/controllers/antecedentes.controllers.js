'use strict';
var validador = require('../validators/validador');
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
  Antecedentes.find({idPaciente:pacienteId, borrado: false}).populate('idPaciente')
    .exec(function (err, antecedentes) {
        if (err) {
          return res.status(404).send({
            message: 'No se ha encontrado'
          });
        }
        return res.status(200).json(antecedentes);
    });
};

exports.list = function(req, res){
  Antecedentes.find({borrado:false}, function(err, antecedentes){
    if(err){
      return res.status(500).send({
        message: 'Ocurrió un error en el servidor'
      });
    } else {
      return res.status(200).json(antecedentes);
    }
  });
};

exports.createAntecedente = function(req, res){
  var antecedentes = new Antecedentes(req.body);
  var campos = ["idPaciente", "alteracionApetito", "nausea","vomito","estrenimiento",
  "diarrea","flatulencia","acidez","gastritis","problemasMasticacion","cambioSaborComidas"
  ,"alergia","suplementoVitaminicos","medicamento","ojos","cabello","uñas","piel"];
  if(!validador.camposSonValidos(campos,req)){
    return res.status(500).json({ message: 'Faltan campos'});
  }
  antecedentes.save(function(err){
    if (err) {
      return res.status(500).send({
        message: 'Ocurrió un error en el servidor'
      })
    } else {
      return res.status(201).json(antecedentes);
    }
  });
};

exports.deleteAntecedente = function(req, res){
  var antecedenteId = req.params.antecedenteId;
  Antecedentes.findByIdAndUpdate(antecedenteId, {
    $set: {
      borrado: true
    }
  }, function(err, antecedente) {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor' });
        } else {
            res.status(204).json(antecedente);
        }
    });
};
