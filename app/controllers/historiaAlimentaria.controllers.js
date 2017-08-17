'use strict';
var validador = require('../validators/validador');
var mongoose = require('mongoose');
var HistoriaAlimentaria = mongoose.model('HistoriaAlimentaria');

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

/*Permite obtener los datos de control por id del paciente y se incluye la
información del paciente con populate*/
exports.historiaAlimentariaByPaciente = function(req, res){
  var pacienteId = req.params.pacienteId;
  HistoriaAlimentaria.findOne({idPaciente: pacienteId}).populate('idPaciente')
    .exec(function (err, historiaAlimentaria) {
        if (err) {
          return res.status(404).send({
            message: 'No se ha encontrado'
          });
        }
        return res.status(200).json(historiaAlimentaria);
    });
};

//Función que retorna un json con la información de todas las historias alimentarias almacenadas en la base de datos.
exports.list = function(req, res){
  HistoriaAlimentaria.find({}, function(err, historiaAlimentaria){
    if(err){
      return res.status(500).send({
        message: 'Ocurrió un error en el servidor'
      });
    } else {
      return res.status(200).json(historiaAlimentaria);
    }
  });
};

//Función que almacena en la base de datos una nueva historia alimentaria.
exports.createHistoriaAlimentaria = function(req, res){
  var historiaAlimentaria = new HistoriaAlimentaria(req.body);
  if ( req.body.comeEntreComidas==true && req.body.snacksEntreComidas==undefined ) {
    return res.status(500).json({ message: 'Falta <b>especificar</b> los snacks'});
  }
  if ( req.body.modificaFinesDeSemana==true && req.body.comidaFinesdeSemana==undefined ) {
    return res.status(500).json({ message: 'Falta <b>especificar</b> las comidas'});
  }
  historiaAlimentaria.save(function(err){
    if (err) {
      return res.status(500).send({
        message: 'Ocurrió un error en el servidor'
      })
    } else {
      return res.status(201).json(historiaAlimentaria);
    }
  });
};

//Función que remueve de la base de datos una determinada historia alimentaria mediante su id.
exports.deleteHistoria = function(req, res){
  var historiaAlimentariaId = req.params.historiaAlimentariaId;
  console.log(historiaAlimentariaId);
  HistoriaAlimentaria.findByIdAndUpdate(historiaAlimentariaId, {
    $set: {
      borrado: true
    }
  }, function(err, historiaAlimentaria) {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor' });
        } else {
            res.status(204).json(historiaAlimentaria);
        }
    });
};
