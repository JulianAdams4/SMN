//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var DatosControl = require('../app/models/datosControl.model');
var Paciente = require('../app/models/pacientes.model');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

patId = '5928bafb9fa058092098ae85';

describe('datosControl', () => {
    beforeEach((done) => {
        DatosControl.remove({}, (err) => { 
           done();         
        });     
    });
});
describe('/GET datosControl', () => {
      it('Debe obtener los datos de control de un paciente', function(done){
        chai.request('http://localhost:3000')
            .get('/api/datosControlPaciente/'+patId)
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
        idPaciente: patId,
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
        .post('/api/datosControlPaciente/'+patId)
        .send(datosControl)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('idPaciente').eql(patId);
          done();
        });
  });
  it('No existe un paciente con ese id para los datos de control', (done) => {
    var datosControl = {
        idPaciente: '5928bafb9fa058092098ae88',
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
        .post('/api/datosControlPaciente/5928bafb9fa058092098ae88')
        .send(datosControl)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
  });
  it('No ingresa fecha de registro del dato de control', (done) => {
    var datosControl = {
        idPaciente: patId,
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
        .post('/api/datosControlPaciente/'+patId)
        .send(datosControl)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
  });
  it('No ingresa ningún dato de control', (done) => {
    var datosControl = {
        idPaciente: patId,
        fechaDato: '2017-04-13',
		observaciones:'prueba',
    }
    chai.request('http://localhost:3000')
        .post('/api/datosControlPaciente/'+patId)
        .send(datosControl)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
  });
});