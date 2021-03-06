'use strict';

var validador = require('../validators/validador');
var mongoose = require('mongoose');
var PlanNutricional = mongoose.model('PlanNutricional');
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

exports.read = function(req, res){
  res.json(req.planNutricional);
};

//Función que permite almacenar en la base de datos un nuevo plan nutricional que contiene idPaciente, fecha de creación y documento en pdf a almacenar.
exports.createPlanNutricional = function(req, res){
  var campos = ["documento"];
  if(!validador.camposSonValidos(campos,req)){
    return res.status(500).json({
      message: 'Faltan campos',
      type: 'danger'
    });
  }
  cloudinary.uploader.upload(req.body.documento, function(result){
    if (result.url) {

      PlanNutricional.create({
        idPaciente:req.body.idPaciente,
        documento: result.url,
        fechaDato : req.body.fechaDato
      },function(err, planNutricional) {
        /* Error al crear */
        if(err){
          return res.status(500).send({
            message: getErrorMessage(err),
            type: "danger"
          });
        }
        /* Fijamos el plan creado como el plan vigente (por defecto)
           y cambiamos TODOS los demás planes como vigente:false */
        var idPlanCreado = planNutricional._id;
        fijarVigentePorId(idPlanCreado, req, res)

      }); /* End PlanNutricional.create */
    }
  })
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

/*Permite obtener el plan nutricional vigente por id del paciente extraído de la sesión y se incluye la
información del paciente con populate*/
exports.planNutricionalVigenteByPaciente = function(req, res){
  if(req.session.paciente){
    PlanNutricional.find({idPaciente:req.session.paciente._id, borrado:false, vigente: true}).populate('idPaciente')
    .exec(function (err, planNutricionalVigente) {
        if (err) {
          return res.status(400).send({
            message: getErrorMessage(err)
          });
        }
        return res.status(200).json(planNutricionalVigente);
    });
  }
};


/*Permite obtener la información de un plan nutricional por id */
exports.planNutricionalById = function(req, res, next, id){
  PlanNutricional.findById(id, function(err, planNutricional){
    if(err){
      return res.status(500).send({
        message: getErrorMessage(err),
        type: 'danger'
      })
    }
    if(!planNutricional){
      return res.status(404).send({
        message: '<i class="fa ti-alert"></i>No existe el plan nutricional',
        type: 'danger'
      })
    }
    req.planNutricional = planNutricional;
    next();
  });
};

//La función updateFile sube el archivo al servicio de archivos cloudinary y luego edita el link del documento en la bd
function updateFile(cloudinary,req,id,res){
  cloudinary.uploader.upload(req.body.documento, function(result){
    if (result.url) {
      update(id,req,res,result.url);
    }
  })
}
//La función update edita los todos los campos excepto el campo documento ya que este no fue cambiado por el usuario
function update(id,req,res,documento){
  PlanNutricional.findByIdAndUpdate(id, {
    $set: {
      fechaDato : req.body.fechaDato,
      documento: documento
    }
  }, function(err, planNutricional) {
        if (err) {
            return res.status(500).send({ message: 'Ocurrió un error en el servidor' });
        } else {
            return res.status(204).json(planNutricional);
        }
    });
}

exports.editPlanNutricional = function(req, res){
  var planNutricionalId = req.params.planNutricionalId;
  var campos = ["documento"];
  var cambioArchivo=false;
  if(!validador.camposSonValidos(campos,req)){//si falta el campo documento
    cambioArchivo=false;//entonces no se cambio el archivo al editar
  }
  else{//si está el campo documento
    cambioArchivo=true;//entonces se cambio el archivo al editar
  }
  if(!cambioArchivo){//si no se cambió el archivo al editar
    PlanNutricional.findById( planNutricionalId, function (err, planNutricional) {
      if (err) {
        return res.status(500).send({
          message:  getErrorMessage(err),
          type: 'danger'
        });
      }
      update(planNutricionalId,req,res,planNutricional.documento);
    });
  }
  else{//si se cambió el archivo al editar
    updateFile(cloudinary,req,planNutricionalId,res)
  }
};


// Fijar plan vigente
function fijarVigentePorId(idPlanCreado, req, res) {
  PlanNutricional.updateMany(
    { vigente: true },
    {$set:
      { vigente: false }
    },
    function(err, success){
      /* Error al actualizar los demás planes */
      if(err){
        return res.status(500).send({
          message: getErrorMessage(err),
          type: "danger"
        });
      }
      /* No error */
      PlanNutricional.findByIdAndUpdate( idPlanCreado ,
      {$set:
        { vigente: true }
      },
      function(err, plan) {
        if(err){
          return res.status(500).send({
            message: getErrorMessage(err),
            type: "danger"
          });
        }
        return res.status(201).json(plan);
      });
    }
  ); /* End updateMany */
}

/* Fija plan nutricional vigente y cambia los demás planes a vigente:false */
exports.fijarPlanVigente = function (req, res){
  var planNutricionalId = req.params.planNutricionalId;
  /* Promero verifico si el plan ya está vigente */
  PlanNutricional.findById( planNutricionalId,
    function(err, plan) {
      /* Error del servidor */
      if(err){
        return res.status(500).send({
          message: getErrorMessage(err),
          type: "danger"
        });
      }
      /* Ya es plan vigente */
      if (plan.vigente == true) {
        return res.status(500).send({
          message: '<h5> El plan nutricional <b>ya es el vigente</b> </h5>',
          type: "danger"
        });
      }
      /* No es el plan vigente */
      fijarVigentePorId(planNutricionalId, req, res);
  });
}


//Función que remueve de la base de datos a un plan nutricional mediante su id.
exports.deletePlanNutricional = function(req, res){
   var planNutricionalId = req.params.planNutricionalId;
   PlanNutricional.findByIdAndRemove(planNutricionalId,
     function(err, planNutricional) {
         if (err) {
             return res.status(500).send({ message: 'Ocurrió un error en el servidor' });
         } else {
             return res.status(204).json(planNutricional);
         }
     });
 };
