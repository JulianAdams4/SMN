process.env.NODE_ENV = 'development';
var seeder = require('mongoose-seed');
var config = require('../../config/config.js');

var centros = [];
var nuevoCentro = {
  direccion: "Guayaquil",
  telefono: "0912345578",
  horariosAtencion:"08:00 - 15:00",
  nutricionista: {
    cedula:'1721989364',
    nombres:'Angie',
    apellidos: 'Del Pezo',
    email: 'jadams@espol.edu.ec'
  }
};
centros.push(nuevoCentro);

var data = [{
  'model': 'Centro',
  'documents': centros
}];

// Connect to MongoDB via Mongoose
seeder.connect(config.db, function() {
  // Load Mongoose models
  seeder.loadModels([
    './../models/centro.model.js'
  ]);
  // Clear specified collections
  seeder.clearModels(['Centro'], function() {
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function(error, result) {
      console.log(error, result);
      process.exit(0);
    });
  });
});
