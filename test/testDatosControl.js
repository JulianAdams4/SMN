//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var DatosControl = require('../app/models/datosControl.model');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();


chai.use(chaiHttp);
describe('/GET datosControl', () => {
      it('Debe obtener los datos de control de un paciente', function(done){
        chai.request('http://localhost:3000')
            .get('/api/datosControlPaciente/5928bafb9fa058092098ae85')
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('array');
              done();
            });
      });
  });
describe('/POST datosControl', () => {
  it('Debe guardar los datos de control de un paciente', (done) => {
    var datosControl = {
        idPaciente: '5928bafb9fa058092098ae85',
		fechaDato: '2017-04-13',
		observaciones:'prueba',
		datos:[
		  {
		    nombreDato:'Peso',
		    valorDato: 150.00,
		    unidadDato: 'lbs'
		  },
		  {
		    nombreDato:'Altura',
		    valorDato: 165.00,
		    unidadDato: 'cm'
		   }
		]
    }
    chai.request('http://localhost:3000')
        .post('/api/datosControlPaciente/5928bafb9fa058092098ae85')
        .send(datosControl)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
  });
});
