var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config');
var methodOverride = require('method-override');
var session = require('express-session');

module.exports = function() {

  var app = express();

  if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
  } else if(process.env.NODE_ENV === 'production'){
    app.use(morgan('dev'));
  }

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json({limit: '50mb'}));
  app.use(methodOverride());

  app.use(session({
    secret : 'MiCodigoNoSeLoDiganANadie',
    resave : true,
    saveUninitialized : false
  }));

  app.set('view engine', 'hbs');
  app.set('views', './app/views');

  require('../app/routes/pacientes.routes')(app);
  require('../app/routes/administrador.routes')(app);
  require('../app/routes/datosControl.routes')(app);
  require('../app/routes/antecedentes.routes')(app);
  require('../app/routes/historiaAlimentaria.routes')(app);
  require('../app/routes/planNutricional.routes')(app);
  require('../app/routes/centro.routes')(app);
  require('../app/routes/paquete.dieta.routes')(app);

  app.use(express.static('./public'));

  return app;

};
