'use strict';

var mongoose = require('mongoose');
var DatosControl = mongoose.model('DatosControl');
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

exports.read = function(req, res){
  res.json(req.datosControl);
};

exports.datosControlById = function(req, res, next, id){
  DatosControl.findById(id, function(err, datosControl){
    if(err) return next(err);
    if(!datosControl){
      return res.status(404).send({
        message: 'No existe el datos de control del paciente'
      })
    }
    req.datosControl = datosControl;
    next();
  });
};

exports.createDatosControl = function(req, res){
  var datos = new DatosControl(req.body);
  datos.save(function(err){
    if (err) {
      return res.status(404).send({
        message: getErrorMessage(err)
      })
    } else {
      res.json(datos);
    }
  });
};
