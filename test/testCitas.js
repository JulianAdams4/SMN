process.env.NODE_ENV = 'test';
var server = require('../server');
var mongoose = require('mongoose');
var Cita = mongoose.model('Cita');
var Paciente = mongoose.model('Paciente');

var paciente = {};
var puerto = 'http://localhost:3000';


var chai = require('chai');
var chaiHttp = require('chai-http');

var should = chai.should();
chai.use(chaiHttp);

var patId = '';
describe('citas', () => {

    beforeEach((done) => {
        Cita.remove({}, (err) => {
          Paciente.remove({}, (err) => {
            done();
          });
        });
    });
    afterEach((done) => {
        Cita.remove({}, (err) => {
          Paciente.remove({}, (err) => {
            done();
          });
        });
    });

  });
describe('/POST cita', () => {
  beforeEach((done) => {
    var paciente = new Paciente({
      cedula: '0912345678', nombres: 'Julian', apellidos: 'Adams',
      email: 'jebenitez@espol.edu.ec', fechaNacimiento: '2000-01-01', sexo: 'Masculino',
      direccion: 'Av Siempreviva', celular: '0912345678', ocupacion: 'Estudiante',
      motivoConsulta: 'Bajar de peso', ejercicios: 'Correr en las mañanas',
      frecuencia: '3 veces por semana'
    });
        paciente.save((err, patient) => {
            idPat = '' + patient._id;
            done();
        });
  });
  it('Debe guardar citas definidas por el administrador', (done) => {
            var datosCita = {
              start: '2017-08-19T14:05:00.000Z',
              duracion: 15,
              estaOcupado: false
            }
            chai.request('http://localhost:3000')
                .post('/api/cita')
                .send(datosCita)
                .end((err, res) => {
                  res.should.have.status(201);
                  done();
            });
  });
  afterEach((done) => {
      Cita.remove({}, (err) => {
        Paciente.remove({}, (err) => {
          done();
         });
        });
  });
});
