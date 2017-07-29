'use strict';
var validador = require('../validators/validador');
var mongoose = require('mongoose');
var DatosControl = mongoose.model('DatosControl');
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
  //var datosControl = new DatosControl(req.body);
  var campos = ["foto"];
  if(!validador.camposSonValidos(campos,req)){
    return res.status(500).json({ message: 'Faltan campos.',type: 'danger'});
  }else if(req.body.datos.length==0){
    return res.status(500).json({ message: 'Falta ingresar parámetros de control.',type: 'danger'});
  }
  cloudinary.uploader.upload(req.body.foto, function(result){
    if (result.url) {
      DatosControl.create({
        idPaciente:req.body.idPaciente,
        foto: result.url,
        fechaDato : req.body.fechaDato,
        observaciones: req.body.observaciones,
        datos: req.body.datos
      },function(err, datosControl) {
        /* Error al crear */
        if(err){
          return res.status(500).send({
            message: getErrorMessage(err),
            type: "danger"
          });
        }
        return res.status(201).json(datosControl);
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
  DatosControl.findByIdAndUpdate(id, {
    $set: {
      foto: foto,
      fechaDato : req.body.fechaDato,
      observaciones: req.body.observaciones,
      datos: req.body.datos
    }
  }, function(err, datosControl) {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor' });
        } else {
            res.status(204).json(datosControl);
        }
    });
}

exports.editDatosControl = function(req, res){
  var datosControlId = req.params.datosControlId;
  var campos = ["foto"];
  var cambioArchivo=false;
  if(req.body.datos.length==0){
    return res.status(500).json({ message: 'Falta ingresar parámetros de control.',type: 'danger'});
  }
  DatosControl.findById( {_id: datosControlId}, function (err, datosControl) {
    // Error del servidor
    if (err) {
      res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
    }
    // Paciente no encontrado
    if (!datosControl) {
      res.status(404).send({ message: 'Datos de Control no encontrados.' });
    }
    if(!validador.camposSonValidos(campos,req)){//si falta el campo foto
      cambioArchivo=false;//entonces no se cambia la foto al editar
    }
    else{//si está el campo foto
      cambioArchivo=true;//entonces se cambio el archivo al editar
    }
    if(!cambioArchivo){//si no se cambió la foto al editar
      update(datosControlId,req,res,datosControl.foto);
    }
    else{//si se cambió el archivo al editar
      updateFile(cloudinary,req,datosControlId,res)
    }
  });
};

//Función que remueve de la base de datos a un dato de control mediante su id.
exports.borrarDatoControlById = function (req, res) {
  var id = req.params.datosControlId;
  DatosControl.findByIdAndRemove(id,
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
