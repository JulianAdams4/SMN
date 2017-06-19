'use strict';

var validador = require('../validators/validador');
var mongoose = require('mongoose');
var Paciente = mongoose.model('Paciente');
var Antecedentes = mongoose.model('Antecedentes');
var HistoriaAlimentaria = mongoose.model('HistoriaAlimentaria');

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
  Paciente.find({}, function(err, pacientes){
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
  var campos = ["cedula", "nombres", "apellidos", "fechaNacimiento", "sexo","motivoConsulta"];
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

  // Extraemos la data de las tabs
  var datosPaciente = req.body.paciente;
  var datosAntecedente = req.body.antecedente;
  var datosHistoria = req.body.historia;

  // Editamos el paciente
  Paciente.findById( pacienteId, function (err, paciente) {
    // Error del servidor
    if (err) {
      res.status(500).send({ message:  getErrorMessage(err), type: 'danger' });
    }

    // Paciente no encontrado
    if (!paciente) {
      res.status(404).send({ message: 'Paciente no encontrado', type: 'danger' });
    }

    // paciente (de la Bdd), datosPaciente (desde el front)
    paciente.cedula               = datosPaciente.cedula;
    paciente.nombres              = datosPaciente.nombres;
    paciente.apellidos            = datosPaciente.apellidos;
    paciente.fechaNacimiento      = datosPaciente.fechaNacimiento;
    paciente.sexo                 = datosPaciente.sexo;
    paciente.direccion            = datosPaciente.direccion;
    paciente.celular              = datosPaciente.celular;
    paciente.ocupacion            = datosPaciente.ocupacion;
    paciente.motivoConsulta       = datosPaciente.motivoConsulta;
    paciente.ejercicios           = datosPaciente.ejercicios;
    paciente.frecuenciaEjecicios  = datosPaciente.frecuenciaEjecicios;
  

    // Guardamos los cambios del paciente
    paciente.save( function(err) {
      // Error del servidor
      if (err) {
        res.status(500).send({ message: 'Ocurrió un error en el servidor' });
      }
      
      // Paciente editado con exito

      // Editamos el antecedente
      Antecedentes.findById( datosAntecedente._id, function (err, antecedente) {
        // Error del servidor
        if (err) {
          res.status(500).send({ message:  getErrorMessage(err), type: 'danger' });
        }

        // Paciente no encontrado
        if (!antecedente) {
          res.status(404).send({ message: 'Antecedente no encontrado', type: 'danger' });
        }

console.log(datosAntecedente);
        // antecedente (de la Bdd), datosAntecedente (desde el front)
        antecedente.alteracionApetito       = datosAntecedente.alteracionApetito;
        antecedente.nausea                  = datosAntecedente.nausea;
        antecedente.vomito                  = datosAntecedente.vomito;
        antecedente.estrenimiento           = datosAntecedente.estrenimiento;
        antecedente.diarrea                 = datosAntecedente.diarrea;
        antecedente.flatulencia             = datosAntecedente.flatulencia;
        antecedente.acidez                  = datosAntecedente.acidez;
        antecedente.gastritis               = datosAntecedente.gastritis;
        antecedente.problemasMasticacion    = datosAntecedente.problemasMasticacion;
        antecedente.cambioSaborComidas      = datosAntecedente.cambioSaborComidas;
        antecedente.alergia                 = datosAntecedente.alergia;
        antecedente.descripcionAlergias     = datosAntecedente.descripcionAlergias;
        antecedente.suplementoVitaminicos   = datosAntecedente.suplementoVitaminicos;
        antecedente.descripcionSuplementos  = datosAntecedente.descripcionSuplementos;
        antecedente.medicamento             = datosAntecedente.medicamento;
        antecedente.descripcionMedicamentos = datosAntecedente.descripcionMedicamentos;
        antecedente.ojos                    = datosAntecedente.ojos;
        antecedente.cabello                 = datosAntecedente.cabello;
        antecedente.unias                   = datosAntecedente.unias;
        antecedente.piel                    = datosAntecedente.piel;
        antecedente.antecedentesPersonales  = datosAntecedente.antecedentesPersonales;
        antecedente.antecedentesFamiliares  = datosAntecedente.antecedentesFamiliares;

        // Guardamos los cambios del antecedente
        antecedente.save( function(err) {
          // Error del servidor
          if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor' });
          }

          // Antecedente editado con exito

          HistoriaAlimentaria.findById( datosHistoria._id, function (err, historia) {      
              // Error del servidor
              if (err) {
                res.status(500).send({
                  message:  getErrorMessage(err), type: 'danger'
                });
              }

              // Historia no encontrado
              if (!historia) {
                res.status(404).send({ message: 'Historia alimentaria no encontrada', type: 'danger' });
              }

console.log(datosHistoria);
              // historia (de la Bdd), datosHistoria (desde el front)
              historia.comidasAlDia           = datosHistoria.comidasAlDia;
              historia.preparadoPor           = datosHistoria.preparadoPor;
              historia.modificaFinesDeSemana  = datosHistoria.modificaFinesDeSemana;
              historia.comidaFinesdeSemana    = datosHistoria.comidaFinesdeSemana;
              historia.comeEntreComidas       = datosHistoria.comeEntreComidas;
              historia.snacksEntreComidas     = datosHistoria.snacksEntreComidas;
              historia.queCome                = datosHistoria.queCome;
              historia.aguaAlDia              = datosHistoria.aguaAlDia;
              historia.cafeAlDia              = datosHistoria.cafeAlDia;
              historia.cigarrosAlDia          = datosHistoria.cigarrosAlDia;
              historia.alcoholALaSemana       = datosHistoria.alcoholALaSemana;
              historia.grupoAlimentos         = datosHistoria.grupoAlimentos;

              historia.save( function(err) {
                  // Error del servidor
                  if (err) {
                    res.status(500).send({ message: 'Ocurrió un error en el servidor' });
                  }

                  res.status(200).send({ message: 'Paciente editado exitosamente papuh' });

              });

          });
          //

        });

      });


    });

  });
};

exports.desactivarPaciente = function(req, res){
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

exports.activarPaciente = function(req, res){
  var pacienteId = req.params.pacienteId;
  Paciente.findByIdAndUpdate(pacienteId, {
    $set: {
      borrado: false
    }
  }, function(err, paciente) {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor' });
        } else {
            res.status(204).json(paciente);
        }
    });
};
