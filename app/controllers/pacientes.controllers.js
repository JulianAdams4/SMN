'use strict';

var validador = require('../validators/validador');
var mongoose = require('mongoose');
var Paciente = mongoose.model('Paciente');
var Antecedentes = mongoose.model('Antecedentes');
var HistoriaAlimentaria = mongoose.model('HistoriaAlimentaria');
var crypto = require('../services/crypto.js');

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

//FUNCIÓN GENERADORA DE PASSWORD
function GenerarPassword() {
  var iteration = 0;
  var password = "";
  var randomNumber;
  while(iteration < 8){
    randomNumber = (Math.floor((Math.random() * 100)) % 94) + 33;
    if ((randomNumber >=33) && (randomNumber <=47)) { continue; }
    if ((randomNumber >=58) && (randomNumber <=64)) { continue; }
    if ((randomNumber >=91) && (randomNumber <=96)) { continue; }
    if ((randomNumber >=123) && (randomNumber <=126)) { continue; }
    iteration++;
    password += String.fromCharCode(randomNumber);
  }
  return password;
}

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


/*
* Función que retorna un json con la información de todos los pacientes almacenados en el sistema.
*/
exports.list = function(req, res){
  Paciente.find({}, function(err, pacientes){
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err),
        type: 'danger'
      });
    } else {
      //código temporal, sirve para mostrar las contraseñas de los pacientes
      for(var i in pacientes){
        pacientes[i].password = crypto.desencriptar(pacientes[i].password);
      }
      res.json(pacientes);
    }
  });
};


/*
* Función que almacena en la base de datos un nuevo paciente con su respectiva cédula, nombres, apellidos, fecha de Nacimiento
* sexo, celular, dirección, motivo de consulta
*/
exports.createPaciente = function(req, res){
  var paciente = new Paciente(req.body);
  var campos = ["cedula", "nombres", "apellidos", "fechaNacimiento", "sexo","motivoConsulta"];
  if(!validador.camposSonValidos(campos,req)){
    return res.status(500).json({ message: 'Faltan campos'});
  }
  if (!validador.cedulaEsValida(paciente.cedula)){
    return res.status(500).json({ message: 'Cédula no válida'});
  }
  paciente.password = crypto.encriptar(GenerarPassword());//Asigna un password a un paciente

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


/*
*  Funcion para editar paciente y que recibe informacion de 3 tabs
*/
exports.editPaciente = function(req, res){
  // Validaciones
  // Es diferente a la del archivo validador
  var obligatoriosPaciente = ["cedula", "nombres", "apellidos", 
                              "fechaNacimiento", "sexo", "motivoConsulta", 
                              "email"];
  for (var i=0; i<obligatoriosPaciente.length ; i++){
    var field = obligatoriosPaciente[i];
    //console.log('{"' + field + '": "' + req.body.paciente[field] +'"}');
    if ( req.body.paciente[field] == null || req.body.paciente[field] == undefined || req.body.paciente[field] == "") {
      return res.status(500).json({ message: 'Faltan campos del paciente'});
    }
  }
  // Validacion de checks marcados pero sin data
  if ( req.body.antecedente && req.body.antecedente.alergia==true && req.body.antecedente.descripcionAlergias=="" ) {
    return res.status(500).json({ message: 'Falta especificar las alergias'});
  }
  if ( req.body.antecedente && req.body.antecedente.suplementoVitaminicos==true && req.body.antecedente.descripcionSuplementos=="" ) {
    return res.status(500).json({ message: 'Falta especificar los suplementos'});
  }
  if ( req.body.antecedente && req.body.antecedente.medicamento==true && req.body.antecedente.descripcionMedicamentos=="" ) {
    return res.status(500).json({ message: 'Falta especificar los medicamentos'});
  }

  if ( req.body.historia && req.body.historia.comeEntreComidas==true && req.body.historia.snacksEntreComidas=="" ) {
    return res.status(500).json({ message: 'Falta especificar los snacks'});
  }
  if ( req.body.historia && req.body.historia.modificaFinesDeSemana==true && req.body.historia.comidaFinesdeSemana=="" ) {
    return res.status(500).json({ message: 'Falta especificar las comidas'});
  }

  // Extraemos la data de las tabs
  var pacienteId = req.params.pacienteId;
  var datosPaciente = req.body.paciente;
  var datosAntecedente = req.body.antecedente;
  var datosHistoria = req.body.historia;

  // Editamos el paciente
  Paciente.findById( pacienteId, function (err, paciente) {
    // Error del servidor
    if (err) {
      return res.status(500).send({ message:  getErrorMessage(err), type: 'danger' });
    }

    // Paciente no encontrado
    if (!paciente) {
      return res.status(404).send({ message: 'Paciente no encontrado', type: 'danger' });
    }

    // paciente (de la Bdd), datosPaciente (desde el front)
    paciente.cedula               = datosPaciente.cedula;
    paciente.nombres              = datosPaciente.nombres;
    paciente.apellidos            = datosPaciente.apellidos;
    paciente.email                = datosPaciente.email;
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
        return res.status(500).send({ message: 'Ocurrió un error al guardar el paciente' });
      }

      // Editamos el antecedente
      Antecedentes.findById( datosAntecedente._id, function (err, antecedente) {
        // Error del servidor
        if (err) {
          return res.status(500).send({ message:  getErrorMessage(err), type: 'danger' });
        }

        // Antecedente no encontrado
        if (!antecedente) {
          return res.status(404).send({ message: 'Antecedente no encontrado', type: 'danger' });
        }

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
        antecedente.observaciones           = datosAntecedente.observaciones;
        // Guardamos los cambios del antecedente
        antecedente.save( function(err) {
          // Error del servidor
          if (err) {
            return res.status(500).send({ message: 'Ocurrió un error al guardar el antecedente' });
          }

          HistoriaAlimentaria.findById( datosHistoria._id, function (err, historia) {
            // Error del servidor
            if (err) {
              return res.status(500).send({ message:  getErrorMessage(err), type: 'danger'});
            }

            // Historia no encontrado
            if (!historia) {
              return res.status(404).send({ message: 'Historia alimentaria no encontrada', type: 'danger' });
            }

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
                return res.status(500).send({ message: 'Ocurrió un error al guardar la historia' });
              }
              /* Paciente, Antecedente e Historia editados con exito */
              return res.status(200).send({
                paciente: paciente,
                antecedente: antecedente,
                historia: historia
              });

            }); // save historia
          }); // HistoriaAlimentaria.findById

        }); // save antecedente
      }); // Antecedentes.findById

    }); // save paciente
  }); // Paciente.findById
};


//Función que desactiva a determinado paciente del sistema, mediante la modificación del campo borrado a true.
exports.desactivarPaciente = function(req, res){
  var pacienteId = req.params.pacienteId;
  Paciente.findByIdAndUpdate(pacienteId, {
    $set: {
      borrado: true
    }
  }, function(err, paciente) {
        if (err) {
            return res.status(500).send({ message: 'Ocurrió un error en el servidor' });
        } else {
            return res.status(204).json(paciente);
        }
    });
};


//Función que activa a determinado paciente del sistema, mediante la modificación del campo borrado a false.
exports.activarPaciente = function(req, res){
  var pacienteId = req.params.pacienteId;
  Paciente.findByIdAndUpdate(pacienteId, {
    $set: {
      borrado: false
    }
  }, function(err, paciente) {
        if (err) {
            return res.status(500).send({ message: 'Ocurrió un error en el servidor' });
        } else {
            return res.status(204).json(paciente);
        }
    });
};


exports.ingresar = function(req, res){
  if(!req.session.paciente){
    res.render('login');
  } else {
    res.render('publico');
  }
}


exports.signIn = function(req, res){
  var pacienteIn = Paciente(req.body);
  Paciente.findOne({'email': pacienteIn.email}, function(err, paciente){
    if(err){
      return res.status(500).send({
        message: getErrorMessage(err)
      })
    }
    if(!paciente){
      return res.status(400).send({
        message: 'email no se encuentra registrado'
      })
    }
    if(pacienteIn.password === crypto.desencriptar(paciente.password)){
      req.session.paciente = paciente;
      return res.status(200).send({
        message: 'Autenticación exitosa'
      })
    } else {
      return res.status(404).send({
        message: 'contraseña incorrecta'
      })
    }
  });
};


exports.singOut =function(req, res){
  delete req.session.paciente;
  res.redirect('/');
};
