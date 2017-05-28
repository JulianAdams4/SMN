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
/*Permite obtener los datos de control por id y se incluye la
información del paciente con populate*/
exports.datosControlById = function(req, res, next, id){
  DatosControl.findOne({_id: id}).populate('idPaciente')
    .exec(function (err, datosControl) {
        if (err) {
          return res.status(400).send({
            message: getErrorMessage(err)
          });
        }
        if (!datosControl) {
            return res.status(404).json({ message: 'No se ha encontrado' });
        }
        req.datosControl = datosControl;
        next();
    });
};
/*Permite obtener los datos de control por id del paciente y se incluye la
información del paciente con populate*/
exports.datosControlByPaciente = function(req, res){
  var pacienteId = req.params.pacienteId;
  DatosControl.find({idPaciente:pacienteId}).populate('idPaciente')
    .exec(function (err, datosControl) {
        if (err) {
          return res.status(400).send({
            message: getErrorMessage(err)
          });
        }
        return res.status(200).json(datosControl);
    });
};
/*Permite obtener todos los datos de control de la bd y se incluye la
información del paciente con populate*/
exports.list = function(req, res){
  DatosControl.find({}).populate('idPaciente')
    .exec(function (err, datosControl) {
        if (err) {
          return res.status(400).send({
            message: getErrorMessage(err)
          });
        }
        return res.status(200).json(datosControl);
    });
};

exports.createDatosControl = function(req, res){
  var datosControl = new DatosControl(req.body);
  datosControl.save(function(err){
    if (err) {
      return res.status(404).send({
        message: "Error del servidor"
      })
    }else if(datosControl.datos.length<=0){
      return res.status(404).send({
        message: "No se ingresaron datos de control."
      })
    }
    else {
      return res.json(datosControl);
    }
  });
};
