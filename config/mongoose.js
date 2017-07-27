var config = require('./config');
var mongoose = require('mongoose');

module.exports = function(){
  mongoose.Promise = global.Promise;
  var db = mongoose.connect(config.db, function(err){
    if(err){
      console.log('Error: ' + err);
    } else {
      console.log('Conectado con la base');
    }
  });
  require('../app/models/pacientes.model');
  require('../app/models/citas.model');
  require('../app/models/datosControl.model');
  require('../app/models/antecedentes.model');
  require('../app/models/historiaAlimentaria.model');
  require('../app/models/planNutricional.model');
  require('../app/models/centro.model');
  return db;
}
