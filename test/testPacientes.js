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
	  it('Crea un paciente con éxito', (done) => {
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
			  	res.should.have.status(201);
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
		it('No crea un paciente por falta de datos obligatorios', (done) => {
	  	let paciente = {
        direccion: "Direccion prueba",
        celular: "0992426763",
        ocupacion: "Estudiante"
	  	}
			chai.request('http://localhost:3000')
		    .post('/api/pacientes')
		    .send(paciente)
		    .end((err, res) => {
			  	res.should.have.status(500);
		      done();
		    });
	  });
		it('No crea un paciente por formato de fecha con formato errado', (done) => {
			let paciente = {
	  		cedula: "0975489076",
	  		nombres: "Nombre Prueba",
	  		apellidos: "Apellido Prueba",
	  		fechaNacimiento: "19/08/05",
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
			  	res.should.have.status(500);
		      done();
		    });
	  });
  });

	describe('/PUT /pacientes/:idPaciente', () => {
		it('Actualiza los datos de un paciente con un determinado ID', function(done){
		  	let paciente = new Paciente({
		  		cedula: "0900000000",
		  		nombres: "Julian",
		  		apellidos: "Adams",
		  		fechaNacimiento: "2000-01-01",
		        sexo: "Masculino",
		        direccion: "Direccion prueba",
		        celular: "0912345678",
		        ocupacion: "Estudiante",
		        motivoConsulta: "Motivo de prueba"
		  	});
		  	paciente.save((err, patient) => {

		        chai.request('http://localhost:3000')
		            .put('/api/pacientes/' + patient._id)
		            .send({ cedula: '0900000001' })
		            .end(function(err, res){
		     			res.should.have.status(200);
		                res.body.should.be.a('object');
		                res.body.should.have.property('_id').to.deep.equal( String(patient._id) );
		              	done();
		            });

		  	});
	    });
	});

});
