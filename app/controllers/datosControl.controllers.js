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
      .sort({'fechaDato': -1})
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
      .sort({'fechaDato': -1})
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
    .sort({'fechaDato': 1})
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
    return res.status(500).json({ message: 'La foto es obligatoria.',type: 'danger'});
  }else if(req.body.datos.length==0){
    return res.status(500).json({ message: 'Los parámetros de control son obligatorios.',type: 'danger'});
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
function update(id,req,res,foto,datosControl){
  DatosControl.findByIdAndUpdate(id, {
    $set: {
      foto: foto,
      fechaDato : req.body.fechaDato,
      observaciones: req.body.observaciones,
      datos: req.body.datos
    }
  }, function(err, datosControl) {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor',type: 'danger' });
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
    return res.status(500).json({ message: 'Los parámetros de control son obligatorios.',type: 'danger'});
  }
  DatosControl.findById( {_id: datosControlId}, function (err, datosControl) {
    // Error del servidor
    if (err) {
      res.status(500).send({ message: 'Ocurrió un error en el servidor.',type: 'danger' });
    }
    // Paciente no encontrado
    if (!datosControl) {
      res.status(404).send({ message: 'Datos de Control no encontrados.',type: 'danger' });
    }
    if(!validador.parametrosSonValidos(req.body.datos)){
      return res.status(500).json({ message: 'Falta ingresar parámetros obligatorios.',type: 'danger'});
    }
    if(!validador.camposSonValidos(campos,req)){//si falta el campo foto
      cambioArchivo=false;//entonces no se cambia la foto al editar
    }
    else{//si está el campo foto
      cambioArchivo=true;//entonces se cambio el archivo al editar
    }
    if(!cambioArchivo){//si no se cambió la foto al editar
      update(datosControlId,req,res,datosControl.foto,datosControl);
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

// Función que devuelve la cantidad de registros, entre un rango de fechas
exports.datoControlEnRango = function (req, res) {
  var pacienteId = req.session.paciente;
  if (!pacienteId) {
    return res.status(503).json({ message: 'No autorizado'});
  }

  var campos = ["inicio", "fin", "parametro"];
  for (var i=0; i<campos.length ; i++){
      var field = campos[i];
      if ( !req.body[field] || req.body[field] == null || req.body[field] == undefined || req.body[field]== '' ) {
        return res.status(500).json({ message: 'Faltan campos'});
      }
  }

  var fechaInicio = new Date(req.body.inicio);
  var fechaFin    = new Date(req.body.fin);
  var datoABuscar = req.body.parametro;

  // Sumamos 1 dia al final para que incluya la ultima fecha
  var fechaFin2 = new Date(
      fechaFin.getFullYear(),
      fechaFin.getMonth(),
      fechaFin.getDate()+1
  );
  //  (fecha>=min) && (fecha<max)
  DatosControl.find(
    {$and:
      [
        { 'datos.nombreDato': datoABuscar },
        { 'fechaDato': {$gte: fechaInicio} },
        { 'fechaDato': {$lt: fechaFin2} }
      ]
    }
  )
  .sort({'fechaDato': 1})
  .exec(function(err, datos){
    if (err) {
      return res.status(500).json({ message: "Ocurrió un error al obtener los datos" });
    }
    // Arreglo de zeros con la long de los dias
    var anioInicio  = fechaInicio.getFullYear();
    var anioFin     = fechaFin.getFullYear();
    var diferencia = anioFin - anioInicio + 1;
    var arregloAnios = []; // --> [ [10,8,..], [30,12,10,..], ... ]
    var labels = []; // --> ["2000","2001",...]
    for ( var i=0 ; i<diferencia ; i++ ) {
      labels.push( String(anioInicio+i) );
      var arrAnio = Array.apply(null, new Array(12)).map(Number.prototype.valueOf,0);
      arregloAnios.push(arrAnio);
    }
console.log(datos[0].datos);
    for ( var j=0 ; j<datos.length ; j++ ) {
      var fich_j = datos[j];
      var aniofich_j = new Date(fich_j.fechaDato).getFullYear();
      var mesfich_j  = new Date(fich_j.fechaDato).getMonth();
      var pos = labels.indexOf(String(aniofich_j));
      // Aumentamos esa posicion en +1 (inicialmente era 0)
      for (var k = 0; k < fich_j.datos.length; k++) {
        var cd = fich_j.datos[k];
        if ( cd.nombreDato.toUpperCase() == datoABuscar.toUpperCase() ) {
          arregloAnios[pos][mesfich_j] = arregloAnios[pos][mesfich_j] + parseInt(cd.valorDato);
        }
      }
    }
    return res.status(200).json({ series: labels, data: arregloAnios });
  });
};
