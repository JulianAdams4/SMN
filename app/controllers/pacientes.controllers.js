'use strict';

var validador = require('../validators/validador');
var mongoose = require('mongoose');
var Paciente = mongoose.model('Paciente');

//Sprint 1 : Crear el controlador para consultar un paciente
//Controlador de mensajes de errores
//Autor: Stalyn Gonzabay
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
    if(err) return next(err);
    if(!paciente){
      return res.status(404).send({
        message: 'No existe el paciente'
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
        message: getErrorMessage(err)
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
      if (err.code == 11000){
        return res.status(500).send({ message: 'Ya existe un paciente con esa cédula' });
      }
      return res.status(500).send({
        message: "Ocurrio un problema en el servidor"
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
      res.status(500).send({ message: 'Ocurrió un error en el servidor' });
    }

    // Paciente no encontrado
    if (!paciente) {
      res.status(404).send({ message: 'Paciente no encontrado' });
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
