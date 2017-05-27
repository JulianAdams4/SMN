//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
var server = require('../server');
var mongoose = require("mongoose");
var Paciente = mongoose.model('Paciente');
var DatosControl = mongoose.model('DatosControl');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

describe('datosControl', () => {
    beforeEach((done) => {
        DatosControl.remove({}, (err) => { 
        Paciente.remove({}, (err) => {
          done();
         });       
      });     
    });
});

var patId = '';
describe('/POST datosControl', () => {
  it('Debe guardar los datos de control de un paciente', (done) => {
    var paciente = new Paciente({
          cedula: "0900045780",
          nombres: "Juana",
          apellidos: "Meza",
          fechaNacimiento: "2000-01-01",
            sexo: "Femenino",
            direccion: "Direccion prueba",
            celular: "0912345578",
            ocupacion: "Estudiante",
            motivoConsulta: "Motivo de prueba"
        });
        paciente.save((err, patient) => {
            patId = ''+patient._id
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
          res.should.have.status(404);
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