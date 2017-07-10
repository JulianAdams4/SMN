'use strict';
var validador = require('../validators/validador');
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
  if(req.session.paciente){
    DatosControl.find({idPaciente:req.session.paciente._id,borrado:false}).populate('idPaciente')
      .exec(function (err, datosControl) {
          if (err) {
            return res.status(400).send({
              message: getErrorMessage(err)
            });
          }
          return res.status(200).json(datosControl);
      });
  } else {
    DatosControl.find({idPaciente:pacienteId,borrado:false}).populate('idPaciente')
      .exec(function (err, datosControl) {
          if (err) {
            return res.status(400).send({
              message: getErrorMessage(err)
            });
          }
          return res.status(200).json(datosControl);
      });
  }

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

//Función que permite almacenar en la base de datos un nuevo dato de control a un determinado paciente.
exports.createDatosControl = function(req, res){
  var datosControl = new DatosControl(req.body);
  var campos = ["idPaciente"];
  if(!validador.camposSonValidos(campos,req)){
    return res.status(500).json({ message: 'Faltan campos'});
  }else if(datosControl.datos.length==0){
    return res.status(500).json({ message: 'Falta ingresar parámetros de control.'});
  }
  datosControl.save( function(err){
    if (err) {
      return res.status(500).send({
        message: "Error del servidor"
      })
    }
    else {
      return res.status(201).json(datosControl);
    }
  });
};

exports.editDatosControl = function(req, res){
  var datosControlId = req.params.datosControlId;

  DatosControl.findById( {_id: datosControlId}, function (err, datosControl) {
    // Error del servidor
    if (err) {
      res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
    }

    // Paciente no encontrado
    if (!datosControl) {
      res.status(404).send({ message: 'Datos de Control no encontrados.' });
    }
    // Si existe el campo en el body, se reemplaza
    // caso contrario se deja el valor que estaba
    datosControl.fechaDato = req.body.fechaDato ? req.body.fechaDato : datosControl.fechaDato;
    datosControl.observaciones = req.body.observaciones ? req.body.observaciones : datosControl.observaciones;
    datosControl.datos = req.body.datos ? req.body.datos : datosControl.datos;

    if(datosControl.datos.length==0){
      return res.status(500).json({ message: 'Falta ingresar parámetros de control.'});
    }
    // Guardamos los cambios
    datosControl.save( function(err) {
      // Error del servidor
      if (err) {
        return res.status(500).send({ message: 'Ocurrió un error en el servidor' });
      }
      // Editado con exito
      return res.status(200).json(datosControl);
    });

  });
};

//Función que remueve de la base de datos a un dato de control mediante su id.
exports.borrarDatoControlById = function (req, res) {
  var id = req.params.datosControlId;
  DatosControl.update(
    { _id: id },
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
