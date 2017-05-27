//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
let server = require('../server');
let mongoose = require("mongoose");
let Paciente = mongoose.model('Paciente');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');

let should = chai.should();
chai.use(chaiHttp);
//Our parent block
describe('Paciente', () => {
	beforeEach((done) => { //Before each test we empty the database
		Paciente.remove({}, (err) => {
		   done();
		});
	});
 /*
  * Test the /POST route
  */
  describe('/POST paciente', () => {
	  it('Paciente guardado con éxito', (done) => {
	  	let paciente = {
	  		cedula: "0975489076",
	  		nombres: "Nombre Prueba",
	  		apellidos: "Apellido Prueba",
	  		fechaNacimiento: "2014-01-01",
        sexo: "Masculino",
        direccion: "Direccion prueba",
        celular: "0992426763",
        ocupacion: "Estudiante",
        motivoConsulta: "Motivo de prueba"
	  	}
			chai.request('http://localhost:3000')
		    .post('/api/pacientes')
		    .send(paciente)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('cedula');
			  	res.body.should.have.property('nombres');
			  	res.body.should.have.property('apellidos');
			  	res.body.should.have.property('fechaNacimiento');
          res.body.should.have.property('sexo');
          res.body.should.have.property('motivoConsulta');
		      done();
		    });
	  });
  });
});
