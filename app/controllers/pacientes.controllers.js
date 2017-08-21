'use strict';

var validador = require('../validators/validador');
var mongoose = require('mongoose');
var Paciente = mongoose.model('Paciente');
var Antecedentes = mongoose.model('Antecedentes');
var HistoriaAlimentaria = mongoose.model('HistoriaAlimentaria');
var crypto = require('../services/crypto.js');
var nodemailer = require('nodemailer');
//var administrador = require('../controllers/administrador.controllers');
//var Administrador = mongoose.model('Centro');


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
        message = '<i class="ti-alert"></i>El paciente ya <b>existe</b>';
        break;
      // Si un error general ocurre configurar el mensaje de error
      default:
        message = '<i class="ti-alert"></i>Se ha producido un error';
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
  req.paciente.password = crypto.desencriptar(req.paciente.password)
  res.json(req.paciente);
};


//Sprint 1 : Crear el controlador para consultar un paciente
//Controlador para verificar que el id del paciente se encuentra en la base de datos
//Autor: Stalyn Gonzabay
exports.pacienteById = function(req, res, next, id){
  if(req.session.paciente){
    Paciente.findById(req.session.paciente._id, function(err, paciente){
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
  }else{
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
  }
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
  var paciente = new Paciente(req.body.paciente);
  var historia = new HistoriaAlimentaria(req.body.historia);
  var antecedente=new Antecedentes(req.body.antecedente);
  if(!validador.celularEsValida(paciente.celular)){
    return res.status(500).json({
      message: '<i class="ti-alert"></i>La longitud del celular debe ser <b>10</b>',
      type: "danger"
    });
  }
  if ( antecedente.alergia==true && antecedente.descripcionAlergias == undefined) {
    return res.status(500).json({
      message: '<i class="ti-alert"></i>Falta <b>especificar</b> las alergias',
      type: "danger"
    });
  }
  if ( antecedente.suplementoVitaminicos==true && antecedente.descripcionSuplementos==undefined ) {
    return res.status(500).json({
      message: '<i class="ti-alert"></i>Falta <b>especificar</b> los suplementos',
      type: "danger"
    });
  }
  if ( antecedente.medicamento==true && antecedente.descripcionMedicamentos==undefined ) {
    return res.status(500).json({
      message: '<i class="ti-alert"></i>Falta <b>especificar</b> los medicamentos',
      type: "danger"
    });
  }
  if ( historia.comeEntreComidas==true && historia.snacksEntreComidas==undefined ) {
    return res.status(500).json({
      message: '<i class="ti-alert"></i>Falta <b>especificar</b> los snacks',
      type: "danger"
    });
  }
  if ( historia.modificaFinesDeSemana==true && historia.comidaFinesdeSemana==undefined ) {
    return res.status(500).json({
      message: '<i class="ti-alert"></i>Falta <b>especificar</b> las comidas',
      type: "danger"
    });
  }
  var passwordNoEncriptada = "";
  passwordNoEncriptada = GenerarPassword();//Genera contraseña sin encriptar
  paciente.password = crypto.encriptar(passwordNoEncriptada);//Asigna un password encriptado a un paciente
  paciente.save(function(err){
    if (err) {
      return res.status(500).send({
        message: getErrorMessage(err),
        type: "danger"
      })
    } else {
      antecedente.idPaciente=paciente._id;
      antecedente.save(function(err){
        if (err) {
          return res.status(500).send({
            message: 'Ocurrió un error en el servidor'
          })
        } else {
          historia.idPaciente=paciente._id;
          historia.save(function(err){
            if (err) {
              return res.status(500).send({
                message: 'Ocurrió un error en el servidor'
              })
            } else {
              var transporter = nodemailer.createTransport({
                  service: 'Gmail',
                  auth: {
                      user: 'automatic.mensaje@gmail.com',
                      pass: '180895Dtb'
                  }
              });

              var mailOptions = {
                  from: 'Angie del Pezo <angie.dpezo@gmail.com>',
                  to: paciente.email,
                  subject: 'Notificación de registro como paciente en Sistema de Nutrición',
                  text: 'Contraseña: ' + passwordNoEncriptada,
                  html: '<h1>Bienvenido '+paciente.nombres+' al Sistema de Nutrición</h1><p>Ingrese al sitio web con los siguientes datos: </p><ul><li>Usuario: '+paciente.email+'</li><li>Contraseña: '+passwordNoEncriptada+'</li></ul><p>Para ingresar haga click <a href="http://goo.gl/jAuCvt">aquí</a></p>',
              };

              transporter.sendMail(mailOptions, function(error, info) {
                  if (error) {
                      console.log(error);
                      res.redirect('/');
                  } else {
                      console.log('Mensaje enviado: ' + info.response);
                      //res.redirect('/');
                  }
              })
              return res.status(201).json(paciente);
            }
          });
        }
      });
      //ENVIAR CONTRASEÑA A EMAIL DEL NUEVO PACIENTE
    }
  });
};


/*
*  Funcion para editar paciente y que recibe informacion de 3 tabs
*/
exports.editPaciente = function(req, res){
  // Validacion de checks marcados pero sin data
  if ( req.body.antecedente && req.body.antecedente.alergia==true && req.body.antecedente.descripcionAlergias=="" ) {
    return res.status(500).json({ message: 'Falta <b>especificar</b> las alergias'});
  }
  if ( req.body.antecedente && req.body.antecedente.suplementoVitaminicos==true && req.body.antecedente.descripcionSuplementos=="" ) {
    return res.status(500).json({ message: 'Falta <b>especificar</b> los suplementos'});
  }
  if ( req.body.antecedente && req.body.antecedente.medicamento==true && req.body.antecedente.descripcionMedicamentos=="" ) {
    return res.status(500).json({ message: 'Falta <b>especificar</b> los medicamentos'});
  }

  if ( req.body.historia && req.body.historia.comeEntreComidas==true && req.body.historia.snacksEntreComidas=="" ) {
    return res.status(500).json({ message: 'Falta <b>especificar</b> los snacks'});
  }
  if ( req.body.historia && req.body.historia.modificaFinesDeSemana==true && req.body.historia.comidaFinesdeSemana=="" ) {
    return res.status(500).json({ message: 'Falta <b>especificar</b> las comidas'});
  }

  // Extraemos la data de las tabs
  var pacienteId;
  if(req.session.paciente){
    pacienteId = req.session.paciente._id;
  }else{
    pacienteId = req.params.pacienteId;
  }
  var datosPaciente = req.body.paciente;
  var datosAntecedente = req.body.antecedente;
  var datosHistoria = req.body.historia;
  if(!validador.celularEsValida(datosPaciente.celular)){
    return res.status(500).json({
      message: '<i class="ti-alert"></i>La longitud del celular debe ser <b>10</b>',
      type: "danger"
    });
  }
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
    paciente.password             = crypto.encriptar(datosPaciente.password);
    paciente.motivoConsulta       = datosPaciente.motivoConsulta;
    paciente.ejercicios           = datosPaciente.ejercicios;
    paciente.frecuenciaEjecicios  = datosPaciente.frecuenciaEjecicios;

    // Guardamos los cambios del paciente
    paciente.save( function(err) {
      // Error del servidor
      if (err) {
        return res.status(500).send({
          message: getErrorMessage(err),
          type: "danger"
        })
      }
      if (!req.session.paciente){
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
            return res.status(500).send({ message: 'Ocurrió un error al guardar el antecedente',type: 'danger' });
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
                return res.status(500).send({ message: 'Ocurrió un error al guardar la historia' ,type: 'danger'});
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
      }else{
        return res.status(200).send({
                paciente: paciente,
              });
      }


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
            return res.status(500).send({ message: 'Ocurrió un error en el servidor' ,type: 'danger'});
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
            return res.status(500).send({ message: 'Ocurrió un error en el servidor',type: 'danger' });
        } else {
            return res.status(204).json(paciente);
        }
    });
};


exports.ingresar = function(req, res){
  if(!req.session.paciente){
    res.render('publico');
  } else {
    res.render('paciente');
  }
};


exports.signIn = function(req, res){
  var pacienteIn = Paciente(req.body);
  Paciente.findOne({'email': pacienteIn.email}, function(err, paciente){
    if(err){
      return res.status(500).send({
        message: getErrorMessage(err),
        type: 'danger'
      })
    }
    if(!paciente){
      return res.status(400).send({
        message: 'Email no se encuentra registrado'
      })
    }
    if(pacienteIn.password === crypto.desencriptar(paciente.password)){
      req.session.paciente = paciente;
      return res.status(200).send({
        message: 'Autenticación exitosa'
      })
    } else {
      return res.status(404).send({
        message: 'Contraseña incorrecta'
      })
    }
  });
};


exports.singOut =function(req, res){
  delete req.session.paciente;
  req.session.destroy(function(err) {
  // cannot access session here 
  })
  res.redirect('/');
};
