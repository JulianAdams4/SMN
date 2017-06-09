'use strict';

var validador = require('../validators/validador');
var mongoose = require('mongoose');
var PlanNutricional = mongoose.model('PlanNutricional');

var getErrorMessage = function(err) {
  var message = '';
  if (err.code) {
    switch (err.code) {
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
  return message;
};

exports.createPlanNutricional = function(req, res){
  var planNutricional = new PlanNutricional(req.body);
  var campos = ["documento"];
  if(!validador.camposSonValidos(campos,req)){
    return res.status(500).json({ message: 'Faltan campos'});
  }
  planNutricional.save(function(err){
    if (err) {
      return res.status(500).send({
        message: getErrorMessage(err),
        type: "danger"
      })
    } else {
      return res.status(201).json(planNutricional);
    }
  });
};

/*Permite obtener los planes nutricionales por id del paciente y se incluye la
información del paciente con populate*/
exports.planNutricionalByPaciente = function(req, res){
  var pacienteId = req.params.pacienteId;
  PlanNutricional.find({idPaciente:pacienteId,borrado:false}).populate('idPaciente')
    .exec(function (err, planesNutricionales) {
        if (err) {
          return res.status(400).send({
            message: getErrorMessage(err)
          });
        }
        return res.status(200).json(planesNutricionales);
    });
};

exports.editPlanNutricional = function(req, res){
  var planNutricionalId = req.params.planNutricionalId;

  PlanNutricional.findById( planNutricionalId, function (err, planNutricional) {
    // Error del servidor
    if (err) {
      res.status(500).send({
        message:  getErrorMessage(err),
        type: 'danger'
      });
    }
    // Plan nutricional no encontrado
    if (!planNutricional) {
      res.status(404).send({ message: 'Plan nutricional no encontrado', type: 'danger' });
    }
    // Si existe el campo en el body, se reemplaza
    // caso contrario se deja el valor que estaba
    planNutricional.documento = req.body.documento ? req.body.documento : planNutricional.documento;
    // Guardamos los cambios
    planNutricional.save( function(err) {
      // Error del servidor
      if (err) {
        res.status(500).send({ message: 'Ocurrió un error en el servidor' });
      }
      // Editado con exito
      res.status(200).json(planNutricional);
    });

  });
};
