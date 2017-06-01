'use strict';

var validador = require('../validators/validador');
var mongoose = require('mongoose');
var Paciente = mongoose.model('Paciente');

//Sprint 1 : Crear el controlador para consultar un paciente
//Controlador de mensajes de errores
//Autor: Stalyn Gonzabay
// Crear un nuevo método controller manejador de errores
var getErrorMessage = function(err) {
  // Definir la variable de error message
  var message = '';

  // Si un error interno de MongoDB ocurre obtener el mensaje de error
  if (err.code) {
    switch (err.code) {
      // Si un eror de index único ocurre configurar el mensaje de error
      case 11000:
      case 11001:
        message = '<i class="fa ti-alert"></i>El paciente ya existe';
        break;
      // Si un error general ocurre configurar el mensaje de error
      default:
        message = '<i class="fa ti-alert"></i>Se ha producido un error';
    }
  } else {
    // Grabar el primer mensaje de error de una lista de posibles errores
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  // Devolver el mensaje de error
  return message;
};

//Sprint 1 : Crear el controlador para consultar un paciente
//Controlador para consultar el paciente
//<<el servidor antes de entrar a read() primero verifica en pacienteById() que el paciente existe y lo guarda en req.paciente>>
//Autor: Stalyn Gonzabay
exports.read = function(req, res){
  res.json(req.paciente);
};

//Sprint 1 : Crear el controlador para consultar un paciente
//Controlador para verificar que el id del paciente se encuentra en la base de datos
//Autor: Stalyn Gonzabay
exports.pacienteById = function(req, res, next, id){
  Paciente.findById(id, function(err, paciente){
    if(err){
      return res.status(500).send({
        message: getErrorMessage(err),
        type: 'danger'
      })
    }
    if(!paciente){
      return res.status(404).send({
        message: '<i class="fa ti-alert"></i>No existe el paciente',
        type: 'danger'
      })
    }
    req.paciente = paciente;
    next();
  });
};

exports.list = function(req, res){
  Paciente.find({borrado: false}, function(err, pacientes){
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err),
        type: 'danger'
      });
    } else {
      res.json(pacientes);
    }
  });
};

exports.createPaciente = function(req, res){
  var paciente = new Paciente(req.body);
  var campos = ["cedula", "nombres", "apellidos", "fechaNacimiento", "sexo", "direccion", "celular", "ocupacion","motivoConsulta"];
  if(!validador.camposSonValidos(campos,req)){
    return res.status(500).json({ message: 'Faltan campos'});
  }
  if (!validador.cedulaEsValida(paciente.cedula)){
    return res.status(500).json({ message: 'Cédula no válida'});
  }
  paciente.save(function(err){
    if (err) {
      return res.status(500).send({
        message: getErrorMessage(err),
        type: "danger"
      })
    } else {
      return res.status(201).json(paciente);
    }
  });
};

exports.editPaciente = function(req, res){
  var pacienteId = req.params.pacienteId;

  Paciente.findById( pacienteId, function (err, paciente) {
    // Error del servidor
    if (err) {
      res.status(500).send({
        message:  getErrorMessage(err),
        type: 'danger'
      });
    }

    // Paciente no encontrado
    if (!paciente) {
      res.status(404).send({ message: 'Paciente no encontrado', type: 'danger' });
    }

    // Si existe el campo en el body, se reemplaza
    // caso contrario se deja el valor que estaba
    paciente.cedula = req.body.cedula ? req.body.cedula : paciente.cedula;
    paciente.nombres = req.body.nombres ? req.body.nombres : paciente.nombres;
    paciente.apellidos = req.body.apellidos ? req.body.apellidos : paciente.apellidos;
    paciente.fechaNacimiento = req.body.fechaNacimiento ? req.body.fechaNacimiento : paciente.fechaNacimiento;
    paciente.sexo = req.body.sexo ? req.body.sexo : paciente.sexo;
    paciente.direccion = req.body.direccion ? req.body.direccion : paciente.direccion;
    paciente.celular = req.body.celular ? req.body.celular : paciente.celular;
    paciente.ocupacion = req.body.ocupacion ? req.body.ocupacion : paciente.ocupacion;
    paciente.motivoConsulta = req.body.motivoConsulta ? req.body.motivoConsulta : paciente.motivoConsulta;

    // Guardamos los cambios
    paciente.save( function(err) {
      // Error del servidor
      if (err) {
        res.status(500).send({ message: 'Ocurrió un error en el servidor' });
      }
      // Editado con exito
      res.status(200).json(paciente);
    });

  });
};

exports.deletePaciente = function(req, res){
  var pacienteId = req.params.pacienteId;
  Paciente.findByIdAndUpdate(pacienteId, {
    $set: {
      borrado: true
    }
  }, function(err, paciente) {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor' });
        } else {
            res.status(204).json(paciente);
        }
    });
};
