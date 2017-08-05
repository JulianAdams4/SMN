'use strict';
var validador = require('../validators/validador');
var mongoose = require('mongoose');
var PaqueteDieta = mongoose.model('PaqueteDieta');
var cloudinary = require('cloudinary');

var cloudinaryCredentials = {
  cloud_name: 'dsqpicprf',
  api_key:    '259691129854149',
  api_secret: 'jNwDkTwnkXaCzkbdwy6WrqOS8ik'
};

cloudinary.config({
  cloud_name: cloudinaryCredentials.cloud_name,
  api_key:    cloudinaryCredentials.api_key,
  api_secret: cloudinaryCredentials.api_secret
});

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
  res.json(req.paqueteDieta);
};
/*Permite obtener los paquetes de dieta por id*/
exports.paqueteDietaById = function(req, res, next, id){
  PaqueteDieta.findById(id, function(err, paquete){
        if (err) {
          return res.status(400).send({
            message: getErrorMessage(err)
          });
        }
        if (!paquete) {
            return res.status(404).json({ message: 'No se ha encontrado' });
        }
        req.paqueteDieta = paquete;
        next();
    });
};

/*Permite obtener todos los paquetes de dieta de la bd*/
exports.list = function(req, res){
  PaqueteDieta.find({borrado:false}, function(err, paquete){
        if (err) {
          return res.status(400).send({
            message: getErrorMessage(err)
          });
        }
        return res.status(200).json(paquete);
    });
};

//Función que permite almacenar en la base de datos un paquete de dieta.
exports.createPaqueteDieta = function(req, res){
  var campos = ["foto"];
  if(!validador.camposSonValidos(campos,req)){
    return res.status(500).json({ message: 'La foto del paquete es obligatoria.',type: 'danger'});
  }
  cloudinary.uploader.upload(req.body.foto, function(result){
    if (result.url) {
      PaqueteDieta.create({
        nombre:req.body.nombre,
        foto: result.url,
        descripcion : req.body.descripcion,
        precio: req.body.precio,
      },function(err, paquete) {
        /* Error al crear */
        if(err){
          return res.status(500).send({
            message: getErrorMessage(err),
            type: "danger"
          });
        }
        return res.status(201).json(paquete);
      });
    }
  })
};

function updateFile(cloudinary,req,id,res){
  cloudinary.uploader.upload(req.body.foto, function(result){
    if (result.url) {
      update(id,req,res,result.url);
    }
  })
}
//La función update edita los todos los campos excepto el campo foto ya que este no fue cambiado por el admin
function update(id,req,res,foto){
  PaqueteDieta.findByIdAndUpdate(id, {
    $set: {
      foto: foto,
      nombre : req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio
    }
  }, function(err, paquete) {
        if (err) {
            res.status(500).send({ message: getErrorMessage(err), type:'danger'});
        } else {
            res.status(204).json(paquete);
        }
    });
}

exports.editPaqueteDieta = function(req, res){
  var paqueteDietaId = req.params.paqueteDietaId;
  var campos = ["precio","nombre"];
  var cambioArchivo=false;
  PaqueteDieta.findById( {_id: paqueteDietaId}, function (err, paquete) {
    // Error del servidor
    if (err) {
      return res.status(500).send({ message: getErrorMessage(err), type:'danger'});
    }
    // paquete no encontrado
    if (!paquete) {
      return res.status(404).send({ message: 'Paquete de dieta no encontrado.', type:'danger' });
    }
    if(!validador.camposSonValidos(["foto"],req)){//si falta el campo
      update(paqueteDietaId,req,res,paquete.foto);
    }
    else{
      res.status(200)
      updateFile(cloudinary,req,paqueteDietaId,res)
    }
  });
};

//Función que remueve de la base de datos a un paquete de dieta mediante su id.
exports.borrarPaqueteDietaById = function (req, res) {
  var id = req.params.paqueteDietaId;
  PaqueteDieta.findByIdAndRemove(id,
    function (err, paquete) {
      if (err) {
        res.status(500).send({
          message: getErrorMessage(err),
          type:'danger'
        });
      }
      // No errors
      return res.status(204).json({
        message: "Paquete de dieta eliminado exitosamente"
      });
  });
};
