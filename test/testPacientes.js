//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
var server = require('../server');
var mongoose = require("mongoose");
var Paciente = mongoose.model('Paciente');
var Antecedente = mongoose.model('Antecedentes');
var Historia = mongoose.model('HistoriaAlimentaria');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');

var should = chai.should();
chai.use(chaiHttp);
//Our parent block
describe('Paciente', () => {
	
	beforeEach((done) => { // Before each test we delete test data
		Paciente.remove({}, (err) => {
			Antecedente.remove({}, (err) => {
				Historia.remove({}, (err) => {
					done();
				});
			});
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
		  		cedula: "0911111111",
		  		nombres: "Nombre Prueba",
		  		apellidos: "Adams",
		  		fechaNacimiento: "2000-01-01",
		        sexo: "Masculino",
		        direccion: "Direccion prueba",
		        celular: "0912345678",
		        ocupacion: "Estudiante",
		        motivoConsulta: "Motivo de prueba"
		  	});
		  	paciente.save((err) => {
		  		// Obtenemos el id
		  		Paciente.findOne({cedula:"0911111111"}, (err, patient) => {
		  			// Creamos antecedente
			  		var antecedent = new Antecedente({
			  			idPaciente: patient._id
			  		});
			  		antecedent.save((err) => {
			  			Antecedente.findOne({idPaciente: patient._id}, (err, ante) => {
			  				// Creamos historia
			  				var historiaAlim = new Historia({
			  				  idPaciente: patient._id,
							  comidasAlDia: 1,
							  preparadoPor: "Cocinera",
							  modificaFinesDeSemana: false,
							  comidaFinesdeSemana: "",
							  comeEntreComidas: false,
							  snacksEntreComidas: "",
							  queCome: "",
							  aguaAlDia: 1,
							  cafeAlDia: 1,
							  cigarrosAlDia: 0,
							  alcoholALaSemana: 0,
							  grupoAlimentos:[
							    {
							      descripcion: "Lacteos",
							      frecuencia: 1,
							      alimentosAgradan: "Leche",
							      alimentosDesagradan: "Queso"
							    }
							  ]
			  				});
			  				historiaAlim.save((err)=>{
			  					Historia.findOne({idPaciente: patient._id}, (err, hist) => {

			  						// Chai test
							        chai.request('http://localhost:3000')
							            .put('/api/pacientes/' + patient._id)
							            .send({
							            	paciente: {
							            		cedula: "0920000002", 
							  					nombres: "Nombre Prueba", 
							  					apellidos: "Apellido editado",
							  					fechaNacimiento: "2000-01-01",
							        			sexo: "Masculino",
							        			direccion: "Direccion prueba",
							        			celular: "0912345678",
							        			motivoConsulta: "Motivo de prueba"
							            	}, 
							            	antecedente: ante,
							            	historia: hist
							            })
							            .end(function(err, res){
							     			res.should.have.status(200);
							                res.body.should.be.a('object');
							                res.body.should.have.property('paciente');
							                res.body.paciente.should.have.property('_id').to.deep.equal( String(patient._id) );
							              	done();
							            }); // end

			  					});
			  				})
			  			})
			  		});
		  		}); // findOne
		  	});
	    });
	  //--------------------------------------------------
		it('No actualiza los datos de un paciente que no existe', function(done){
		  	var paciente = new Paciente({
		  		cedula: "0911111111",
		  		nombres: "Nombre Prueba",
		  		apellidos: "Adams",
		  		fechaNacimiento: "2000-01-01",
		        sexo: "Masculino",
		        direccion: "Direccion prueba",
		        celular: "0912345678",
		        ocupacion: "Estudiante",
		        motivoConsulta: "Motivo de prueba"
		  	});
		  	paciente.save((err) => {
		  		// Obtenemos el id
		  		Paciente.findOne({cedula:"0911111111"}, (err, patient) => {
		  			// Creamos antecedente
			  		var antecedent = new Antecedente({
			  			idPaciente: patient._id
			  		});
			  		antecedent.save((err) => {
			  			Antecedente.findOne({idPaciente: patient._id}, (err, ante) => {
			  				// Creamos historia
			  				var historiaAlim = new Historia({
			  				  idPaciente: patient._id,
							  comidasAlDia: 1,
							  preparadoPor: "Cocinera",
							  modificaFinesDeSemana: false,
							  comidaFinesdeSemana: "",
							  comeEntreComidas: false,
							  snacksEntreComidas: "",
							  queCome: "",
							  aguaAlDia: 1,
							  cafeAlDia: 1,
							  cigarrosAlDia: 0,
							  alcoholALaSemana: 0,
							  grupoAlimentos:[
							    {
							      descripcion: "Lacteos",
							      frecuencia: 1,
							      alimentosAgradan: "Leche",
							      alimentosDesagradan: "Queso"
							    }
							  ]
			  				});
			  				historiaAlim.save((err)=>{
			  					Historia.findOne({idPaciente: patient._id}, (err, hist) => {
			  						// IMPORTANTE
			  						var idFalso = '000000000000';
			  						// Chai test
							        chai.request('http://localhost:3000')
							            .put('/api/pacientes/' + idFalso)
							            .send({
							            	paciente: {
							            		cedula: "0920000002", 
							  					nombres: "Nombre Prueba", 
							  					apellidos: "Apellido editado",
							  					fechaNacimiento: "2000-01-01",
							        			sexo: "Masculino",
							        			direccion: "Direccion prueba",
							        			celular: "0912345678",
							        			motivoConsulta: "Motivo de prueba"
							            	}, 
							            	antecedente: ante,
							            	historia: hist
							            })
							            .end(function(err, res){
							            	// paciente no encontrado
							     			res.should.have.status(404);
							              	done();
							            }); // end

			  					});
			  				})
			  			})
			  		});
		  		}); // findOne
		  	});
		});
		//--------------------------------------------------
		it('No actualiza los datos de un paciente si falta su cedula', function(done){
		  	var paciente = new Paciente({
		  		cedula: "0911111111",
		  		nombres: "Nombre Prueba",
		  		apellidos: "Adams",
		  		fechaNacimiento: "2000-01-01",
		        sexo: "Masculino",
		        direccion: "Direccion prueba",
		        celular: "0912345678",
		        ocupacion: "Estudiante",
		        motivoConsulta: "Motivo de prueba"
		  	});
		  	paciente.save((err) => {
		  		// Obtenemos el id
		  		Paciente.findOne({cedula:"0911111111"}, (err, patient) => {
		  			// Creamos antecedente
			  		var antecedent = new Antecedente({
			  			idPaciente: patient._id
			  		});
			  		antecedent.save((err) => {
			  			Antecedente.findOne({idPaciente: patient._id}, (err, ante) => {
			  				// Creamos historia
			  				var historiaAlim = new Historia({
			  				  idPaciente: patient._id,
							  comidasAlDia: 1,
							  preparadoPor: "Cocinera",
							  modificaFinesDeSemana: false,
							  comidaFinesdeSemana: "",
							  comeEntreComidas: false,
							  snacksEntreComidas: "",
							  queCome: "",
							  aguaAlDia: 1,
							  cafeAlDia: 1,
							  cigarrosAlDia: 0,
							  alcoholALaSemana: 0,
							  grupoAlimentos:[
							    {
							      descripcion: "Lacteos",
							      frecuencia: 1,
							      alimentosAgradan: "Leche",
							      alimentosDesagradan: "Queso"
							    }
							  ]
			  				});
			  				historiaAlim.save((err)=>{
			  					Historia.findOne({idPaciente: patient._id}, (err, hist) => {
			  						// IMPORTANTE
			  						var cedulaFalsa = '';
			  						// Chai test
							        chai.request('http://localhost:3000')
							            .put('/api/pacientes/' + patient._id)
							            .send({
							            	paciente: {
							            		cedula: cedulaFalsa,
							  					nombres: "Nombre Prueba", 
							  					apellidos: "Apellido editado",
							  					fechaNacimiento: "2000-01-01",
							        			sexo: "Masculino",
							        			direccion: "Direccion prueba",
							        			celular: "0912345678",
							        			motivoConsulta: "Motivo de prueba"
							            	}, 
							            	antecedente: ante,
							            	historia: hist
							            })
							            .end(function(err, res){
							     			res.should.have.status(500);
							              	done();
							            }); // end

			  					});
			  				})
			  			})
			  		});
		  		}); // findOne
		  	});
		});
		//--------------------------------------------------
		it('No actualiza los datos de un paciente si falta el nombre', function(done){
		  	var paciente = new Paciente({
		  		cedula: "0911111111",
		  		nombres: "Nombre Prueba",
		  		apellidos: "Adams",
		  		fechaNacimiento: "2000-01-01",
		        sexo: "Masculino",
		        direccion: "Direccion prueba",
		        celular: "0912345678",
		        ocupacion: "Estudiante",
		        motivoConsulta: "Motivo de prueba"
		  	});
		  	paciente.save((err) => {
		  		// Obtenemos el id
		  		Paciente.findOne({cedula:"0911111111"}, (err, patient) => {
		  			// Creamos antecedente
			  		var antecedent = new Antecedente({
			  			idPaciente: patient._id
			  		});
			  		antecedent.save((err) => {
			  			Antecedente.findOne({idPaciente: patient._id}, (err, ante) => {
			  				// Creamos historia
			  				var historiaAlim = new Historia({
			  				  idPaciente: patient._id,
							  comidasAlDia: 1,
							  preparadoPor: "Cocinera",
							  modificaFinesDeSemana: false,
							  comidaFinesdeSemana: "",
							  comeEntreComidas: false,
							  snacksEntreComidas: "",
							  queCome: "",
							  aguaAlDia: 1,
							  cafeAlDia: 1,
							  cigarrosAlDia: 0,
							  alcoholALaSemana: 0,
							  grupoAlimentos:[
							    {
							      descripcion: "Lacteos",
							      frecuencia: 1,
							      alimentosAgradan: "Leche",
							      alimentosDesagradan: "Queso"
							    }
							  ]
			  				});
			  				historiaAlim.save((err)=>{
			  					Historia.findOne({idPaciente: patient._id}, (err, hist) => {
			  						// IMPORTANTE
			  						var datoFalso = '';
			  						// Chai test
							        chai.request('http://localhost:3000')
							            .put('/api/pacientes/' + patient._id)
							            .send({
							            	paciente: {
							            		cedula: "0911111111",
							  					nombres: datoFalso, 
							  					apellidos: "Apellido editado",
							  					fechaNacimiento: "2000-01-01",
							        			sexo: "Masculino",
							        			direccion: "Direccion prueba",
							        			celular: "0912345678",
							        			motivoConsulta: "Motivo de prueba"
							            	}, 
							            	antecedente: ante,
							            	historia: hist
							            })
							            .end(function(err, res){
							     			res.should.have.status(500);
							              	done();
							            }); // end

			  					});
			  				})
			  			})
			  		});
		  		}); // findOne
		  	});
		});
		//--------------------------------------------------
		it('No actualiza los datos de un paciente si falta el apellido', function(done){
		  	var paciente = new Paciente({
		  		cedula: "0911111111",
		  		nombres: "Nombre Prueba",
		  		apellidos: "Adams",
		  		fechaNacimiento: "2000-01-01",
		        sexo: "Masculino",
		        direccion: "Direccion prueba",
		        celular: "0912345678",
		        ocupacion: "Estudiante",
		        motivoConsulta: "Motivo de prueba"
		  	});
		  	paciente.save((err) => {
		  		// Obtenemos el id
		  		Paciente.findOne({cedula:"0911111111"}, (err, patient) => {
		  			// Creamos antecedente
			  		var antecedent = new Antecedente({
			  			idPaciente: patient._id
			  		});
			  		antecedent.save((err) => {
			  			Antecedente.findOne({idPaciente: patient._id}, (err, ante) => {
			  				// Creamos historia
			  				var historiaAlim = new Historia({
			  				  idPaciente: patient._id,
							  comidasAlDia: 1,
							  preparadoPor: "Cocinera",
							  modificaFinesDeSemana: false,
							  comidaFinesdeSemana: "",
							  comeEntreComidas: false,
							  snacksEntreComidas: "",
							  queCome: "",
							  aguaAlDia: 1,
							  cafeAlDia: 1,
							  cigarrosAlDia: 0,
							  alcoholALaSemana: 0,
							  grupoAlimentos:[
							    {
							      descripcion: "Lacteos",
							      frecuencia: 1,
							      alimentosAgradan: "Leche",
							      alimentosDesagradan: "Queso"
							    }
							  ]
			  				});
			  				historiaAlim.save((err)=>{
			  					Historia.findOne({idPaciente: patient._id}, (err, hist) => {
			  						// IMPORTANTE
			  						var datoFalso = '';
			  						// Chai test
							        chai.request('http://localhost:3000')
							            .put('/api/pacientes/' + patient._id)
							            .send({
							            	paciente: {
							            		cedula: "0911111111",
							  					nombres: "Nombre Prueba", 
							  					apellidos: datoFalso,
							  					fechaNacimiento: "2000-01-01",
							        			sexo: "Masculino",
							        			direccion: "Direccion prueba",
							        			celular: "0912345678",
							        			motivoConsulta: "Motivo de prueba"
							            	}, 
							            	antecedente: ante,
							            	historia: hist
							            })
							            .end(function(err, res){
							     			res.should.have.status(500);
							              	done();
							            }); // end

			  					});
			  				})
			  			})
			  		});
		  		}); // findOne
		  	});
		});
		//--------------------------------------------------
		it('No actualiza los datos de un paciente si falta la fecha de nacimiento', function(done){
		  	var paciente = new Paciente({
		  		cedula: "0911111111",
		  		nombres: "Nombre Prueba",
		  		apellidos: "Adams",
		  		fechaNacimiento: "2000-01-01",
		        sexo: "Masculino",
		        direccion: "Direccion prueba",
		        celular: "0912345678",
		        ocupacion: "Estudiante",
		        motivoConsulta: "Motivo de prueba"
		  	});
		  	paciente.save((err) => {
		  		// Obtenemos el id
		  		Paciente.findOne({cedula:"0911111111"}, (err, patient) => {
		  			// Creamos antecedente
			  		var antecedent = new Antecedente({
			  			idPaciente: patient._id
			  		});
			  		antecedent.save((err) => {
			  			Antecedente.findOne({idPaciente: patient._id}, (err, ante) => {
			  				// Creamos historia
			  				var historiaAlim = new Historia({
			  				  idPaciente: patient._id,
							  comidasAlDia: 1,
							  preparadoPor: "Cocinera",
							  modificaFinesDeSemana: false,
							  comidaFinesdeSemana: "",
							  comeEntreComidas: false,
							  snacksEntreComidas: "",
							  queCome: "",
							  aguaAlDia: 1,
							  cafeAlDia: 1,
							  cigarrosAlDia: 0,
							  alcoholALaSemana: 0,
							  grupoAlimentos:[
							    {
							      descripcion: "Lacteos",
							      frecuencia: 1,
							      alimentosAgradan: "Leche",
							      alimentosDesagradan: "Queso"
							    }
							  ]
			  				});
			  				historiaAlim.save((err)=>{
			  					Historia.findOne({idPaciente: patient._id}, (err, hist) => {
			  						// IMPORTANTE
			  						var datoFalso = '';
			  						// Chai test
							        chai.request('http://localhost:3000')
							            .put('/api/pacientes/' + patient._id)
							            .send({
							            	paciente: {
							            		cedula: "0911111111",
							  					nombres: "Nombre Prueba", 
							  					apellidos: "Apellido editado",
							  					fechaNacimiento: datoFalso,
							        			sexo: "Masculino",
							        			direccion: "Direccion prueba",
							        			celular: "0912345678",
							        			motivoConsulta: "Motivo de prueba"
							            	}, 
							            	antecedente: ante,
							            	historia: hist
							            })
							            .end(function(err, res){
							     			res.should.have.status(500);
							              	done();
							            }); // end

			  					});
			  				})
			  			})
			  		});
		  		}); // findOne
		  	});
		});
		//--------------------------------------------------
		it('No actualiza los datos de un paciente si falta el sexo', function(done){
		  	var paciente = new Paciente({
		  		cedula: "0911111111",
		  		nombres: "Nombre Prueba",
		  		apellidos: "Adams",
		  		fechaNacimiento: "2000-01-01",
		        sexo: "Masculino",
		        direccion: "Direccion prueba",
		        celular: "0912345678",
		        ocupacion: "Estudiante",
		        motivoConsulta: "Motivo de prueba"
		  	});
		  	paciente.save((err) => {
		  		// Obtenemos el id
		  		Paciente.findOne({cedula:"0911111111"}, (err, patient) => {
		  			// Creamos antecedente
			  		var antecedent = new Antecedente({
			  			idPaciente: patient._id
			  		});
			  		antecedent.save((err) => {
			  			Antecedente.findOne({idPaciente: patient._id}, (err, ante) => {
			  				// Creamos historia
			  				var historiaAlim = new Historia({
			  				  idPaciente: patient._id,
							  comidasAlDia: 1,
							  preparadoPor: "Cocinera",
							  modificaFinesDeSemana: false,
							  comidaFinesdeSemana: "",
							  comeEntreComidas: false,
							  snacksEntreComidas: "",
							  queCome: "",
							  aguaAlDia: 1,
							  cafeAlDia: 1,
							  cigarrosAlDia: 0,
							  alcoholALaSemana: 0,
							  grupoAlimentos:[
							    {
							      descripcion: "Lacteos",
							      frecuencia: 1,
							      alimentosAgradan: "Leche",
							      alimentosDesagradan: "Queso"
							    }
							  ]
			  				});
			  				historiaAlim.save((err)=>{
			  					Historia.findOne({idPaciente: patient._id}, (err, hist) => {
			  						// IMPORTANTE
			  						var datoFalso = '';
			  						// Chai test
							        chai.request('http://localhost:3000')
							            .put('/api/pacientes/' + patient._id)
							            .send({
							            	paciente: {
							            		cedula: "0911111111",
							  					nombres: "Nombre Prueba", 
							  					apellidos: "Apellido editado",
							  					fechaNacimiento: "2000-01-01",
							        			sexo: datoFalso,
							        			direccion: "Direccion prueba",
							        			celular: "0912345678",
							        			motivoConsulta: "Motivo de prueba"
							            	}, 
							            	antecedente: ante,
							            	historia: hist
							            })
							            .end(function(err, res){
							     			res.should.have.status(500);
							              	done();
							            }); // end

			  					});
			  				})
			  			})
			  		});
		  		}); // findOne
		  	});
		});
		//--------------------------------------------------
		it('No actualiza los datos de un paciente si falta el motivo', function(done){
		  	var paciente = new Paciente({
		  		cedula: "0911111111",
		  		nombres: "Nombre Prueba",
		  		apellidos: "Adams",
		  		fechaNacimiento: "2000-01-01",
		        sexo: "Masculino",
		        direccion: "Direccion prueba",
		        celular: "0912345678",
		        ocupacion: "Estudiante",
		        motivoConsulta: "Motivo de prueba"
		  	});
		  	paciente.save((err) => {
		  		// Obtenemos el id
		  		Paciente.findOne({cedula:"0911111111"}, (err, patient) => {
		  			// Creamos antecedente
			  		var antecedent = new Antecedente({
			  			idPaciente: patient._id
			  		});
			  		antecedent.save((err) => {
			  			Antecedente.findOne({idPaciente: patient._id}, (err, ante) => {
			  				// Creamos historia
			  				var historiaAlim = new Historia({
			  				  idPaciente: patient._id,
							  comidasAlDia: 1,
							  preparadoPor: "Cocinera",
							  modificaFinesDeSemana: false,
							  comidaFinesdeSemana: "",
							  comeEntreComidas: false,
							  snacksEntreComidas: "",
							  queCome: "",
							  aguaAlDia: 1,
							  cafeAlDia: 1,
							  cigarrosAlDia: 0,
							  alcoholALaSemana: 0,
							  grupoAlimentos:[
							    {
							      descripcion: "Lacteos",
							      frecuencia: 1,
							      alimentosAgradan: "Leche",
							      alimentosDesagradan: "Queso"
							    }
							  ]
			  				});
			  				historiaAlim.save((err)=>{
			  					Historia.findOne({idPaciente: patient._id}, (err, hist) => {
			  						// IMPORTANTE
			  						var datoFalso = '';
			  						// Chai test
							        chai.request('http://localhost:3000')
							            .put('/api/pacientes/' + patient._id)
							            .send({
							            	paciente: {
							            		cedula: "0911111111",
							  					nombres: "Nombre Prueba", 
							  					apellidos: "Apellido editado",
							  					fechaNacimiento: "2000-01-01",
							        			sexo: "Masculino",
							        			direccion: "Direccion prueba",
							        			celular: "0912345678",
							        			motivoConsulta: datoFalso
							            	}, 
							            	antecedente: ante,
							            	historia: hist
							            })
							            .end(function(err, res){
							     			res.should.have.status(500);
							              	done();
							            }); // end

			  					});
			  				})
			  			})
			  		});
		  		}); // findOne
		  	});
		});


	}); // describe

});
