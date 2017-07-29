'use strict';

var paqueteDieta = require('../controllers/paquete.dieta.controllers');

module.exports = function(app) {

  app.param('paqueteDietaId', paqueteDieta.paqueteDietaById);
  
  app.route('/api/paquetesDieta/:paqueteDietaId')
    .get(paqueteDieta.read)
    .put(paqueteDieta.editPaqueteDieta)
    .delete(paqueteDieta.borrarPaqueteDietaById);

  app.route('/api/paquetesDieta')
    .get(paqueteDieta.list)
    .post(paqueteDieta.createPaqueteDieta);
}
