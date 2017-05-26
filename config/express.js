var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config');
var methodOverride = require('method-override');

module.exports = function() {
  var app = express();

  if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
  } else if(process.env.NODE_ENV === 'production'){
    app.use(compress());
  }

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.use(methodOverride());

  app.set('view engine', 'hbs');
  app.set('views', './app/views');

  require('../app/routes/pacientes.routes')(app);
  require('../app/routes/administrador.routes')(app);
  require('../app/routes/datosControl.routes')(app);
  require('../app/routes/antecedentes.routes')(app);
  
  app.use(express.static('./public'));

  return app;

};
