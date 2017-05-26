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
