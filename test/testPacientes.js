//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
var server = require('../server');
var mongoose = require("mongoose");
var Paciente = mongoose.model('Paciente');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');

var should = chai.should();
chai.use(chaiHttp);
//Our parent block
describe('Paciente', () => {
	beforeEach((done) => { // Before each test we delete test data
		Paciente.remove({$or:[
		   	  	{nombres: "Nombre Prueba"}
		   	]}, 
		   	(err) => {
		   		done();
		});
	});

  	/*
    	Test the /POST route
  	*/
	describe('/POST paciente', () => {
	  	it('Crea un paciente con éxito', (done) => {
	  		var paciente = {
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
	  //--------------------------------------------------
	    it('No crea un paciente por falta de la cédula', (done) => {
			var paciente = {
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
			  		res.should.have.status(500);
		      		done();
		    	});
	    });
	  //--------------------------------------------------
		it('No crea un paciente por falta de los nombres', (done) => {
			var paciente = {
	  			cedula: "0975489076",
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
			  		res.should.have.status(500);
		      		done();
		    	});
	  	});
	  //--------------------------------------------------
		it('No crea un paciente por falta de los apellidos', (done) => {
			var paciente = {
	  			cedula: "0975489076",
				nombres: "Nombre Prueba",
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
			  		res.should.have.status(500);
		      		done();
		    	});
	  	});
	  //--------------------------------------------------
		it('No crea un paciente por falta del sexo del paciente', (done) => {
			var paciente = {
	  			cedula: "0975489076",
				nombres: "Nombre Prueba",
				apellidos: "Apellido Prueba",
	  			fechaNacimiento: "2014-01-01",
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
	  //--------------------------------------------------
		it('No crea un paciente por falta del motivo del registro', (done) => {
			var paciente = {
	  			cedula: "0975489076",
				nombres: "Nombre Prueba",
				apellidos: "Apellido Prueba",
	  			fechaNacimiento: "2014-01-01",
				sexo: "Masculino",
        		direccion: "Direccion prueba",
        		celular: "0992426763",
        		ocupacion: "Estudiante",
	  		}
			chai.request('http://localhost:3000')
		    	.post('/api/pacientes')
		    	.send(paciente)
		    	.end((err, res) => {
			  		res.should.have.status(500);
		      		done();
		    	});
	  	});
	  //--------------------------------------------------
		it('No crea un paciente por formato de fecha con formato errado', (done) => {
			var paciente = {
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


  	/*
    	Test the /PUT route
  	*/
	describe('/PUT /pacientes/:idPaciente', () => {
		it('Actualiza los datos de un paciente con un determinado ID', function(done){
		  	var paciente = new Paciente({
		  		cedula: "0910000001",
		  		nombres: "Nombre Prueba",
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
		            .send({
		            	paciente: {
		            		cedula:'0920000002'
		            	}
		            })
		            .end(function(err, res){
		     			res.should.have.status(500);
		                //res.body.should.be.a('object');
		                //res.body.should.have.property('id')//.to.deep.equal( String(patient._id) );
		              	done();
		            });

		  	});
	    });
	  //--------------------------------------------------
		it('Actualiza los datos de un paciente que no existe', function(done){
			  	var paciente = new Paciente({
			  		cedula: "0900000000",
			  		nombres: "Nombre Prueba", 
			  		apellidos: "Adams",
			  		fechaNacimiento: "2000-01-01",
			        sexo: "Masculino",
			        direccion: "Direccion prueba",
			        celular: "0912345678",
			        ocupacion: "Estudiante",
			        motivoConsulta: "Motivo de prueba"
			  	});
			  	paciente.save((err, patient) => {
					var idPrueba = 0000000000;
			        chai.request('http://localhost:3000')
			            .put('/api/pacientes/' + idPrueba)
			            .send({ cedula: '0900000001' })
			            .end(function(err, res){
							res.should.have.status(500);
			              	done();
			            });

			  	});
		});

	}); // describe

});
