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
  DatosControl.find({idPaciente:pacienteId, borrado:false}).populate('idPaciente')
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
  datosControl.save( function(err){
    if (err) {
      return res.status(500).send({
        message: "Error del servidor"
      })
    }
    else {
      return res.json(datosControl);
    }
  });
};

exports.editDatosControl = function(req, res){
  var datosControlId = req.params.datosControlId;

  DatosControl.findById( {_id: datosControlId}, function (err, datosControl) {
    // Error del servidor
    if (err) {
      res.status(500).send({ message: 'Ocurrió un error en el servidor' });
    }

    // Paciente no encontrado
    if (!datosControl) {
      res.status(404).send({ message: 'Datos de Control no encontrados' });
    }

    // Si existe el campo en el body, se reemplaza
    // caso contrario se deja el valor que estaba
    datosControl.fechaDato = req.body.fechaDato ? req.body.fechaDato : datosControl.fechaDato;
    datosControl.observaciones = req.body.observaciones ? req.body.observaciones : datosControl.observaciones;
    datosControl.datos = req.body.datos ? req.body.datos : datosControl.datos;

    // Guardamos los cambios
    datosControl.save( function(err) {
      // Error del servidor
      if (err) {
        res.status(500).send({ message: 'Ocurrió un error en el servidor' });
      }
      // Editado con exito
      res.status(200).json(datosControl);
    });

  });
};

exports.borrarDatosControlByPaciente = function (req, res) {
  var _idPaciente = req.params.pacienteId;
  DatosControl.update(
    { idPaciente: _idPaciente }, 
    { $set:{ borrado: true } }, 
    function (err, datos) {
      if (err) {
        res.status(500).send({
          message: getErrorMessage(err)
        });
      }
      // No errors
      return res.status(204).json({
        message: "Datos eliminados exitosamente"
      });
  });
};
