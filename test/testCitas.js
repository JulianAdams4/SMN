process.env.NODE_ENV = 'test';
var server = require('../server');
var mongoose = require('mongoose');
var Cita = mongoose.model('Cita');
var Paciente = mongoose.model('Paciente');
var crypto = require('../app/services/crypto.js');
var paciente = {};
var puerto = 'http://localhost:3000';
var cita={};
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);

describe('/Loggeo-Reservar cita', function(){

	beforeEach(function(done){
		objetoPaciente = {
			paciente : {
				cedula:		'5928077593',
				nombres: 	'Stalyn Alfredo',
				apellidos: 'Gonzabay Yagual',
				email: 'alfred.leo@hotmail.com',
				fechaNacimiento: '1990-07-27',
				sexo: 'Masculino',
				direccion: 'Santa Elena',
				celular: '0985493306',
				ocupacion: 'Estudiante',
				motivoConsulta: 'Ganar masa muscular',
				ejercicios: 'Correr en las mañanas',
				frecuencia: '4 veces por semana'
			}
		}
    cita=new Cita({
      start: '2019-08-19T14:05:00.000Z',
      duracion: 15,
      estaOcupado: false,
      stick: true
    })
    cita.save((err, cita) => {
			idCita=cita._id;
		});
		done();
	});

	afterEach(function(done){
		Paciente.remove({},function(err){
      Cita.remove({},function(err){
			     done();
      });
		});
	});

	it('Debe loggear un paciente exitosamente', function(done){
		chai.request(puerto)
			.post('/api/pacientes')
			.send(objetoPaciente)
			.end(function(err, res){
        credenciales={
          cedula:res.body.cedula,
          password:crypto.desencriptar(res.body.password)
        };
        chai.request(puerto)
        .post('/api/pacienteLogin')
  			.send(credenciales)
  			.end(function(err, res){
          res.should.have.status(200);
          done();
        })
			});
	});

  it(' No debe loggear por que no coincide el password', function(done){
		chai.request(puerto)
			.post('/api/pacientes')
			.send(objetoPaciente)
			.end(function(err, res){
        credenciales={
          cedula:res.body.cedula,
          password:"1234",
        };
        chai.request(puerto)
        .post('/api/pacienteLogin')
  			.send(credenciales)
  			.end(function(err, res){
          res.should.have.status(404);
          done();
        })
			});
	});

  it(' No debe loggear por que no se encuentra el user registrado', function(done){
		chai.request(puerto)
			.post('/api/pacientes')
			.send(objetoPaciente)
			.end(function(err, res){
        credenciales={
          cedula:"4658575985",
          password:"1234",
        };
        chai.request(puerto)
        .post('/api/pacienteLogin')
  			.send(credenciales)
  			.end(function(err, res){
          res.should.have.status(400);
          done();
        })
			});
	});

  it('Reserva una cita el paciente de un horario existente', function(done){
    chai.request(puerto)
      .put('/api/reservarCita/'+idCita)
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
})
