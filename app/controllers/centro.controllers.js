'use strict';

var validador = require('../validators/validador');
var mongoose = require('mongoose');
var Centro = mongoose.model('Centro');

var getErrorMessage = function(err) {
  // Definir la variable de error message
  var message = '';

  // Si un error interno de MongoDB ocurre obtener el mensaje de error
    // Grabar el primer mensaje de error de una lista de posibles errores
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
    // Devolver el mensaje de error
  return message;
};

exports.read = function(req, res){
  res.json(req.centro);
};

/*Permite obtener todos los centros de la bd*/
exports.list = function(req, res){
  Centro.find({}, function(err, centros){
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err),
        type: 'danger'
      });
    } else {
      res.json(centros);
    }
  });
};

/*Permite obtener un centro por su respectivo id y se muestra su información*/
exports.centroById = function(req, res, next, id){
  Centro.findById(id, function(err, centro){
    if(err){
      return res.status(500).send({
        message: getErrorMessage(err),
        type: 'danger'
      })
    }
    if(!centro){
      return res.status(404).send({
        message: '<i class="fa ti-alert"></i>No existe el centro',
        type: 'danger'
      })
    }
    req.centro = centro;
    next();
  });
};

//Función que permite almacenar en la base de datos un nuevo centro con su respectivo nutricionista a cargo.
exports.createCentro = function(req, res){
  var centro = new Centro(req.body);
  centro.save( function(err){
    if (err) {
      return res.status(500).send({
        message: getErrorMessage(err),
        type:'danger'
      })
    }
    else {
      return res.status(201).json(centro);
    }
  });
};

//Función que permite editar los campos en la base de datos un determinado centro.
exports.editCentro = function(req, res){
  Centro.findOne( {}, function (err, centro) {
    // Error del servidor
    if (err) {
      res.status(500).send({
        message:  getErrorMessage(err),
        type: 'danger'
      });
    }

    // centro no encontrado
    if (!centro) {
      return res.status(404).send({ message: 'No se encontró información del centro.', type: 'danger' });
    }

    // Si existe el campo en el body, se reemplaza
    // caso contrario se deja el valor que estaba
    centro.direccion = req.body.direccion ? req.body.direccion : centro.direccion;
    centro.telefono = req.body.telefono ? req.body.telefono : centro.telefono;
    centro.servicios = req.body.servicios ? req.body.servicios : centro.servicios;
    centro.horariosAtencion = req.body.horariosAtencion ? req.body.horariosAtencion : centro.horariosAtencion;
    centro.redesSociales = req.body.redesSociales ? req.body.redesSociales : centro.redesSociales;
    centro.nutricionista = req.body.nutricionista ? req.body.nutricionista : centro.nutricionista;

    // Guardamos los cambios
    centro.save( function(err) {
      // Error del servidor
      if (err) {
        return res.status(500).send({ message: getErrorMessage(err),type: 'danger' });
      }
      // Editado con exito
      return res.status(200).json(centro);
    });

  });
};

//Función que modifica en la bd el parámetro borrado a true de un determinado centro mediante su id.
exports.borrarCentroById = function (req, res) {
  var id = req.params.centroId;
  Centro.update(
    { _id: id },
    { $set:{ borrado: true } },
    function (err, centro) {
      if (err) {
        res.status(500).send({
          message: getErrorMessage(err),
          type:'danger'
        });
      }
      // No errors
      return res.status(204).json({
        message: "Centro eliminados exitosamente"
      });
  });
};
