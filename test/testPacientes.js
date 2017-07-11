process.env.NODE_ENV = 'test';
var server = require('../server');
var mongoose = require('mongoose');
var Paciente = mongoose.model('Paciente');
var Antecedente = mongoose.model('Antecedentes');
var HistoriaA = mongoose.model('HistoriaAlimentaria');

var paciente = {};
var puerto = 'http://localhost:3000';


var chai = require('chai');
var chaiHttp = require('chai-http');

var should = chai.should();
chai.use(chaiHttp);

function pacienteNuevo(){
	var paciente = new Paciente({
				cedula:		'0953653416',
				nombres: 	'Juan Enrique',
				apellidos: 'Ramirez Gonzalez',
				email: 'enjuan@user.com',
				fechaNacimiento: '1978-09-15',
				sexo: 'Masculino',
				direccion: 'Guayaquil',
				celular: '0987456325',
				ocupacion: 'Profesor',
				motivoConsulta: 'Ganar masa muscular',
				ejercicios: 'Correr en las mañanas',
				frecuencia: '4 veces por semana'
			});
	return paciente;
}

describe('/POST Paciente', function(){

	beforeEach(function(done){
		paciente = {
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
		done();
	});

	afterEach(function(done){
		Paciente.remove({},function(err){
			done();
		});
	});

	it('Crea un paciente con todos sus campos válidos', function(done){
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(201);
				done();
			});
	});

	it('Crea el paciente si el campo sexo es Masculino', function(done){
		paciente.sexo = 'Masculino';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(201);
				done();
			});
	});

	it('Crea el paciente si el campo sexo es Femenino', function(done){
		paciente.sexo = 'Femenino';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(201);
				done();
			});
	});

	it('Crea el paciente si se ignoran campos no obligatorios', function(done){
		paciente.direccion = '';
		paciente.celular = '';
		paciente.ocupacion = '';
		paciente.ejercicios = '';
		paciente.frecuenciaEjecicios = '';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(201);
				done();
			});
	});

	it('No crea el paciente si no se ingresa la cédula', function(done){
		paciente.cedula = '';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
				done();
			});
	});

	it('No crea el paciente si no ingresa los nombres', function(done){
		paciente.nombres = '';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
				done();
			});
	});

	it('No crea el paciente si no ingresa los apellidos', function(done){
		paciente.apellidos = '';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
				done();
			});
	});

	it('No crea el paciente si no ingresa la fecha de nacimiento', function(done){
		paciente.fechaNacimiento = '';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
				done();
			});
	});

	it('No crea el paciente si no ingresa el sexo', function(done){
		paciente.sexo = '';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
				done();
			});
	});

	it('No crea el paciente si no ingresa el email', function(done){
		paciente.email = '';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
				done();
			});
	});

	it('No crea el paciente si no ingresa el motivo de la consulta', function(done){
		paciente.motivoConsulta = '';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
				done();
			});
	});

	it('No crea el paciente si ingresa un número de cédula no válido', function(done){

		paciente.cedula = 'hola mundo';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
			});

		paciente.cedula = '123456';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
			});
		paciente.cedula = '1234567890123456';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
			});
		done();
	})

	it('No crea el paciente si ingresa unos nombres no válidos', function(done){
		paciente.nombres = 'h';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
			});
		paciente.nombres = 'qwertyuioplkjhgfdsazxcvbnmqwertyuioplkjhgfdsazxhjhkhkhkhkjhkjhkjhkjhcvba';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
			});
			paciente.nombres = 'hola123';
			chai.request(puerto)
				.post('/api/pacientes')
				.send(paciente)
				.end(function(err, res){
					res.should.have.status(500);
				});
				paciente.nombres = '123456';
				chai.request(puerto)
					.post('/api/pacientes')
					.send(paciente)
					.end(function(err, res){
						res.should.have.status(500);
					});
			done();
	});

	it('No crea el paciente si ingresa unos apellidos no válidos', function(done){
		paciente.apellidos = 'h';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
			});
		paciente.apellidos = 'qwertyuioplkjhgfdsazxcvbnmqwertyuioplkjhgfdsazxcvba';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
			});
			paciente.apellidos = 'hola123';
			chai.request(puerto)
				.post('/api/pacientes')
				.send(paciente)
				.end(function(err, res){
					res.should.have.status(500);
				});
				paciente.apellidos = '123456';
				chai.request(puerto)
					.post('/api/pacientes')
					.send(paciente)
					.end(function(err, res){
						res.should.have.status(500);
					});
			done();
	});

	it('No crea el paciente si ingresa un sexo diferente a Masculino o Femenino', function(done){
		paciente.sexo = 'Cualquier cosa';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
				done();
			})
	})

	it('No crea el paciente si ingresa un email no válido', function(done){
		paciente.email = 'hola mundo';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
			});
		paciente.email = 'hola.com';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
			});
		paciente.email = 'hola@mundo';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
			});
		done();
	})

	it('No crea el paciente si ingresa un número de celular no válido', function(done){
		paciente.celular = 'hola mundo';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
			});
		paciente.celular = '123456789';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
			});
		paciente.celular = '123456';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
			});
		paciente.celular = '1234567890123';
		chai.request(puerto)
			.post('/api/pacientes')
			.send(paciente)
			.end(function(err, res){
				res.should.have.status(500);
			});
		done();
	})
	var patId="";
	it('Activa un paciente exitosamente', (done) => {
		var paciente=pacienteNuevo();
		paciente.save((err, patient) => {
			patId = ''+patient._id
			chai.request('http://localhost:3000')
			.put('/api/activarPaciente/'+patId)
			.send(paciente)
			.end((err, res) => {
				res.should.have.status(204);
				done();
			});
		});
	});

	it('Desactiva un paciente exitosamente', (done) => {
		var paciente=pacienteNuevo();
		paciente.save((err, patient) => {
			patId = ''+patient._id
			chai.request('http://localhost:3000')
			.put('/api/desactivarPaciente/'+patId)
			.send(paciente)
			.end((err, res) => {
				res.should.have.status(204);
				done();
			});
		});
	});

	it('No desactiva un paciente porque no encuentra el paciente', (done) => {
		patId = "1";
		chai.request('http://localhost:3000')
		.put('/api/desactivarPaciente/'+patId)
		.send(paciente)
		.end((err, res) => {
			res.should.have.status(500);
			done();
		});
	});

	it('No activa un paciente porque no encuentra el paciente', (done) => {
		patId = "1";
		chai.request('http://localhost:3000')
		.put('/api/activarPaciente/'+patId)
		.send(paciente)
		.end((err, res) => {
			res.should.have.status(500);
			done();
		});
	});

});


/*////////////////////////
	Editar paciente
////////////////////////*/
describe('/PUT Paciente', function(){
	// Create patient
	beforeEach( function(done) {
		// Creamos un nuevo paciente
		var datos = {
		  cedula: '5928077593', nombres: 'Julian', apellidos: 'Adams',
		  email: 'jadams@espol.edu.ec', fechaNacimiento: '2000-01-01', sexo: 'Masculino', 
		  direccion: 'Av Siempreviva', celular: '0912345678', ocupacion: 'Estudiante',
		  motivoConsulta: 'Bajar de peso', ejercicios: 'Correr en las mañanas',
		  frecuencia: '3 veces por semana'
		};
		paciente = new Paciente(datos);
		done();
	});

	// Clean collection
	afterEach(function(done){
		Paciente.remove({},function(err){
			done();
		});
	});

	it('Edita un paciente con todos sus campos válidos', function(done){
		paciente.save((err, pacienteSaved) => {
			var idPat = pacienteSaved._id;
			var pacienteEditado = {
			  _id: idPat, cedula: '5928077593', nombres: 'Adams', apellidos: 'Julian',
			  email: 'jadams@espol.edu.ec', fechaNacimiento: '2000-01-01', sexo: 'Masculino', 
			  direccion: 'Av Siempreviva', celular: '0912345678', ocupacion: 'Estudiante',
			  motivoConsulta: 'Bajar de peso', ejercicios: 'Correr en las mañanas',
			  frecuencia: '3 veces por semana'
			};
			var anteced = {
			  idPaciente: idPat, alteracionApetito: false, nausea: false, vomito: false, 
			  estrenimiento: false, diarrea: false, flatulencia: false, acidez: false, 
			  gastritis: false, problemasMasticacion: false, cambioSaborComidas: false,
			  alergia: false, descripcionAlergias: "", suplementoVitaminicos: false, 
			  descripcionSuplementos: "", medicamento: false, descripcionMedicamentos: "",
			  ojos: false, cabello: false, unias: false, piel: false, antecedentesPersonales: "", 
			  antecedentesFamiliares: "", observaciones: ""
			}
			// Guardamos el antecedente
			var antecedEditado = new Antecedente(anteced);
			antecedEditado.save((err, antecedenteSaved) => {
				var histo = {
				  idPaciente: idPat, comidasAlDia: 3, preparadoPor: "Casa", modificaFinesDeSemana: false, 
				  comidaFinesdeSemana: "", comeEntreComidas: true, snacksEntreComidas: "Frutas", 
				  queCome: "Pollo y pescado", aguaAlDia: 3, cafeAlDia: 5, cigarrosAlDia: 0, alcoholALaSemana: 0,
				  grupoAlimentos:[
				    {
				      descripcion: "Lácteos", frecuencia: 3, 
				      alimentosAgradan: "leche", alimentosDesagradan: "queso" 
				  	}
				  ]
				}
				// Guardamos la historia alimentaria
				var histEditado = new HistoriaA(histo);
				histEditado.save((err, historiaSaved) => {
					// Data a enviarse para editar
					var data = {
					  paciente: pacienteEditado, antecedente: antecedenteSaved, historia: historiaSaved
					}
					// Chai test
					chai.request(puerto)
					  .put('/api/pacientes/'+idPat)
					  .send(data)
					  .end((err, res) => {
						res.should.have.status(200);
						done();
					}); // End chai
				}); // historia save
			}); // antecedente save
		}); // save paciente
	}); // end it


	it('Edita un paciente que carece de campos No obligatorios', function(done){
		paciente.save((err, pacienteSaved) => {
			var idPat = pacienteSaved._id;
			var pacienteEditado = {
			  _id: idPat, cedula: '5928077593', nombres: 'Adams', apellidos: 'Julian',
			  email: 'jadams@espol.edu.ec', fechaNacimiento: '2000-01-01', sexo: 'Masculino', 
			  direccion: 'Av Siempreviva', celular: '0912345678', ocupacion: '',
			  motivoConsulta: 'Bajar de peso', ejercicios: 'Correr en las mañanas',
			  frecuencia: '3 veces por semana'
			};
			var anteced = {
			  idPaciente: idPat, alteracionApetito: false, nausea: false, vomito: false, 
			  estrenimiento: false, diarrea: false, flatulencia: false, acidez: false, 
			  gastritis: false, problemasMasticacion: false, cambioSaborComidas: false,
			  alergia: false, descripcionAlergias: "", suplementoVitaminicos: false, 
			  descripcionSuplementos: "", medicamento: false, descripcionMedicamentos: "",
			  ojos: false, cabello: false, unias: false, piel: false, antecedentesPersonales: "", 
			  antecedentesFamiliares: "", observaciones: ""
			}
			// Guardamos el antecedente
			var antecedEditado = new Antecedente(anteced);
			antecedEditado.save((err, antecedenteSaved) => {
				var histo = {
				  idPaciente: idPat, comidasAlDia: 3, preparadoPor: "Casa", modificaFinesDeSemana: false, 
				  comidaFinesdeSemana: "", comeEntreComidas: true, snacksEntreComidas: "Frutas", 
				  queCome: "Pollo y pescado", aguaAlDia: 3, cafeAlDia: 5, cigarrosAlDia: 0, alcoholALaSemana: 0,
				  grupoAlimentos:[
				    {
				      descripcion: "Lácteos", frecuencia: 3, 
				      alimentosAgradan: "leche", alimentosDesagradan: "queso" 
				  	}
				  ]
				}
				// Guardamos la historia alimentaria
				var histEditado = new HistoriaA(histo);
				histEditado.save((err, historiaSaved) => {
					// Data a enviarse para editar
					var data = {
					  paciente: pacienteEditado, antecedente: antecedenteSaved, historia: historiaSaved
					}
					// Chai test
					chai.request(puerto)
					  .put('/api/pacientes/'+idPat)
					  .send(data)
					  .end((err, res) => {
						res.should.have.status(200);
						done();
					}); // End chai
				}); // historia save
			}); // antecedente save
		}); // save paciente
	}); // end it


	it('No edita un paciente que no existe', function(done){
		paciente.save((err, pacienteSaved) => {
			var idPat = "1"; // ID falso
			var pacienteEditado = {
			  _id: idPat, cedula: '5928077593', nombres: 'Adams', apellidos: 'Julian',
			  email: 'jadams@espol.edu.ec', fechaNacimiento: '2000-01-01', sexo: 'Masculino', 
			  direccion: 'Av Siempreviva', celular: '0912345678', ocupacion: 'Estudiante',
			  motivoConsulta: 'Bajar de peso', ejercicios: 'Correr en las mañanas',
			  frecuencia: '3 veces por semana'
			};
			var anteced = {
			  idPaciente: idPat, alteracionApetito: false, nausea: false, vomito: false, 
			  estrenimiento: false, diarrea: false, flatulencia: false, acidez: false, 
			  gastritis: false, problemasMasticacion: false, cambioSaborComidas: false,
			  alergia: false, descripcionAlergias: "", suplementoVitaminicos: false, 
			  descripcionSuplementos: "", medicamento: false, descripcionMedicamentos: "",
			  ojos: false, cabello: false, unias: false, piel: false, antecedentesPersonales: "", 
			  antecedentesFamiliares: "", observaciones: ""
			}
			// Guardamos el antecedente
			var antecedEditado = new Antecedente(anteced);
			antecedEditado.save((err, antecedenteSaved) => {
				var histo = {
				  idPaciente: idPat, comidasAlDia: 3, preparadoPor: "Casa", modificaFinesDeSemana: false, 
				  comidaFinesdeSemana: "", comeEntreComidas: true, snacksEntreComidas: "Frutas", 
				  queCome: "Pollo y pescado", aguaAlDia: 3, cafeAlDia: 5, cigarrosAlDia: 0, alcoholALaSemana: 0,
				  grupoAlimentos:[
				    {
				      descripcion: "Lácteos", frecuencia: 3, 
				      alimentosAgradan: "leche", alimentosDesagradan: "queso" 
				  	}
				  ]
				}
				// Guardamos la historia alimentaria
				var histEditado = new HistoriaA(histo);
				histEditado.save((err, historiaSaved) => {
					// Data a enviarse para editar
					var data = {
					  paciente: pacienteEditado, antecedente: antecedenteSaved, historia: historiaSaved
					}
					// Chai test
					chai.request(puerto)
					  .put('/api/pacientes/'+idPat)
					  .send(data)
					  .end((err, res) => {
						res.should.have.status(500);
						done();
					}); // End chai
				}); // historia save
			}); // antecedente save
		}); // save paciente
	}); // end it
	
	
	it('No edita un paciente sin cedula', function(done){
		paciente.save((err, pacienteSaved) => {
			var idPat = pacienteSaved._id;
			var pacienteEditado = {
			  _id: idPat, cedula: '', nombres: 'Adams', apellidos: 'Julian',
			  email: 'jadams@espol.edu.ec', fechaNacimiento: '2000-01-01', sexo: 'Masculino', 
			  direccion: 'Av Siempreviva', celular: '0912345678', ocupacion: 'Estudiante',
			  motivoConsulta: 'Bajar de peso', ejercicios: 'Correr en las mañanas',
			  frecuencia: '3 veces por semana'
			};
			var anteced = {
			  idPaciente: idPat, alteracionApetito: false, nausea: false, vomito: false, 
			  estrenimiento: false, diarrea: false, flatulencia: false, acidez: false, 
			  gastritis: false, problemasMasticacion: false, cambioSaborComidas: false,
			  alergia: false, descripcionAlergias: "", suplementoVitaminicos: false, 
			  descripcionSuplementos: "", medicamento: false, descripcionMedicamentos: "",
			  ojos: false, cabello: false, unias: false, piel: false, antecedentesPersonales: "", 
			  antecedentesFamiliares: "", observaciones: ""
			}
			// Guardamos el antecedente
			var antecedEditado = new Antecedente(anteced);
			antecedEditado.save((err, antecedenteSaved) => {
				var histo = {
				  idPaciente: idPat, comidasAlDia: 3, preparadoPor: "Casa", modificaFinesDeSemana: false, 
				  comidaFinesdeSemana: "", comeEntreComidas: true, snacksEntreComidas: "Frutas", 
				  queCome: "Pollo y pescado", aguaAlDia: 3, cafeAlDia: 5, cigarrosAlDia: 0, alcoholALaSemana: 0,
				  grupoAlimentos:[
				    {
				      descripcion: "Lácteos", frecuencia: 3, 
				      alimentosAgradan: "leche", alimentosDesagradan: "queso" 
				  	}
				  ]
				}
				// Guardamos la historia alimentaria
				var histEditado = new HistoriaA(histo);
				histEditado.save((err, historiaSaved) => {
					// Data a enviarse para editar
					var data = {
					  paciente: pacienteEditado, antecedente: antecedenteSaved, historia: historiaSaved
					}
					// Chai test
					chai.request(puerto)
					  .put('/api/pacientes/'+idPat)
					  .send(data)
					  .end((err, res) => {
						res.should.have.status(500);
						done();
					}); // End chai
				}); // historia save
			}); // antecedente save
		}); // save paciente
	}); // end it

	
	it('No edita un paciente con cedula inválida', function(done){
		paciente.save((err, pacienteSaved) => {
			var idPat = pacienteSaved._id;
			var pacienteEditado = {
			  _id: idPat, cedula: '123', nombres: 'Adams', apellidos: 'Julian',
			  email: 'jadams@espol.edu.ec', fechaNacimiento: '2000-01-01', sexo: 'Masculino', 
			  direccion: 'Av Siempreviva', celular: '0912345678', ocupacion: 'Estudiante',
			  motivoConsulta: 'Bajar de peso', ejercicios: 'Correr en las mañanas',
			  frecuencia: '3 veces por semana'
			};
			var anteced = {
			  idPaciente: idPat, alteracionApetito: false, nausea: false, vomito: false, 
			  estrenimiento: false, diarrea: false, flatulencia: false, acidez: false, 
			  gastritis: false, problemasMasticacion: false, cambioSaborComidas: false,
			  alergia: false, descripcionAlergias: "", suplementoVitaminicos: false, 
			  descripcionSuplementos: "", medicamento: false, descripcionMedicamentos: "",
			  ojos: false, cabello: false, unias: false, piel: false, antecedentesPersonales: "", 
			  antecedentesFamiliares: "", observaciones: ""
			}
			// Guardamos el antecedente
			var antecedEditado = new Antecedente(anteced);
			antecedEditado.save((err, antecedenteSaved) => {
				var histo = {
				  idPaciente: idPat, comidasAlDia: 3, preparadoPor: "Casa", modificaFinesDeSemana: false, 
				  comidaFinesdeSemana: "", comeEntreComidas: true, snacksEntreComidas: "Frutas", 
				  queCome: "Pollo y pescado", aguaAlDia: 3, cafeAlDia: 5, cigarrosAlDia: 0, alcoholALaSemana: 0,
				  grupoAlimentos:[
				    {
				      descripcion: "Lácteos", frecuencia: 3, 
				      alimentosAgradan: "leche", alimentosDesagradan: "queso" 
				  	}
				  ]
				}
				// Guardamos la historia alimentaria
				var histEditado = new HistoriaA(histo);
				histEditado.save((err, historiaSaved) => {
					// Data a enviarse para editar
					var data = {
					  paciente: pacienteEditado, antecedente: antecedenteSaved, historia: historiaSaved
					}
					// Chai test
					chai.request(puerto)
					  .put('/api/pacientes/'+idPat)
					  .send(data)
					  .end((err, res) => {
						res.should.have.status(500);
						done();
					}); // End chai
				}); // historia save
			}); // antecedente save
		}); // save paciente
	}); // end it


	it('No edita un paciente sin nombre', function(done){
		paciente.save((err, pacienteSaved) => {
			var idPat = pacienteSaved._id;
			var pacienteEditado = {
			  _id: idPat, cedula: '5928077593', nombres: '', apellidos: 'Adams',
			  email: 'jadams@espol.edu.ec', fechaNacimiento: '2000-01-01', sexo: 'Masculino', 
			  direccion: 'Av Siempreviva', celular: '0912345678', ocupacion: 'Estudiante',
			  motivoConsulta: 'Bajar de peso', ejercicios: 'Correr en las mañanas',
			  frecuencia: '3 veces por semana'
			};
			var anteced = {
			  idPaciente: idPat, alteracionApetito: false, nausea: false, vomito: false, 
			  estrenimiento: false, diarrea: false, flatulencia: false, acidez: false, 
			  gastritis: false, problemasMasticacion: false, cambioSaborComidas: false,
			  alergia: false, descripcionAlergias: "", suplementoVitaminicos: false, 
			  descripcionSuplementos: "", medicamento: false, descripcionMedicamentos: "",
			  ojos: false, cabello: false, unias: false, piel: false, antecedentesPersonales: "", 
			  antecedentesFamiliares: "", observaciones: ""
			}
			// Guardamos el antecedente
			var antecedEditado = new Antecedente(anteced);
			antecedEditado.save((err, antecedenteSaved) => {
				var histo = {
				  idPaciente: idPat, comidasAlDia: 3, preparadoPor: "Casa", modificaFinesDeSemana: false, 
				  comidaFinesdeSemana: "", comeEntreComidas: true, snacksEntreComidas: "Frutas", 
				  queCome: "Pollo y pescado", aguaAlDia: 3, cafeAlDia: 5, cigarrosAlDia: 0, alcoholALaSemana: 0,
				  grupoAlimentos:[
				    {
				      descripcion: "Lácteos", frecuencia: 3, 
				      alimentosAgradan: "leche", alimentosDesagradan: "queso" 
				  	}
				  ]
				}
				// Guardamos la historia alimentaria
				var histEditado = new HistoriaA(histo);
				histEditado.save((err, historiaSaved) => {
					// Data a enviarse para editar
					var data = {
					  paciente: pacienteEditado, antecedente: antecedenteSaved, historia: historiaSaved
					}
					// Chai test
					chai.request(puerto)
					  .put('/api/pacientes/'+idPat)
					  .send(data)
					  .end((err, res) => {
						res.should.have.status(500);
						done();
					}); // End chai
				}); // historia save
			}); // antecedente save
		}); // save paciente
	}); // end it


	it('No edita un paciente con nombres no válidos', function(done){
		paciente.save((err, pacienteSaved) => {
			var idPat = pacienteSaved._id;
			var pacienteEditado = {
			  _id: idPat, cedula: '5928077593', nombres: 'Jul14n', apellidos: 'Adams',
			  email: 'jadams@espol.edu.ec', fechaNacimiento: '2000-01-01', sexo: 'Masculino', 
			  direccion: 'Av Siempreviva', celular: '0912345678', ocupacion: 'Estudiante',
			  motivoConsulta: 'Bajar de peso', ejercicios: 'Correr en las mañanas',
			  frecuencia: '3 veces por semana'
			};
			var anteced = {
			  idPaciente: idPat, alteracionApetito: false, nausea: false, vomito: false, 
			  estrenimiento: false, diarrea: false, flatulencia: false, acidez: false, 
			  gastritis: false, problemasMasticacion: false, cambioSaborComidas: false,
			  alergia: false, descripcionAlergias: "", suplementoVitaminicos: false, 
			  descripcionSuplementos: "", medicamento: false, descripcionMedicamentos: "",
			  ojos: false, cabello: false, unias: false, piel: false, antecedentesPersonales: "", 
			  antecedentesFamiliares: "", observaciones: ""
			}
			// Guardamos el antecedente
			var antecedEditado = new Antecedente(anteced);
			antecedEditado.save((err, antecedenteSaved) => {
				var histo = {
				  idPaciente: idPat, comidasAlDia: 3, preparadoPor: "Casa", modificaFinesDeSemana: false, 
				  comidaFinesdeSemana: "", comeEntreComidas: true, snacksEntreComidas: "Frutas", 
				  queCome: "Pollo y pescado", aguaAlDia: 3, cafeAlDia: 5, cigarrosAlDia: 0, alcoholALaSemana: 0,
				  grupoAlimentos:[
				    {
				      descripcion: "Lácteos", frecuencia: 3, 
				      alimentosAgradan: "leche", alimentosDesagradan: "queso" 
				  	}
				  ]
				}
				// Guardamos la historia alimentaria
				var histEditado = new HistoriaA(histo);
				histEditado.save((err, historiaSaved) => {
					// Data a enviarse para editar
					var data = {
					  paciente: pacienteEditado, antecedente: antecedenteSaved, historia: historiaSaved
					}
					// Chai test
					chai.request(puerto)
					  .put('/api/pacientes/'+idPat)
					  .send(data)
					  .end((err, res) => {
						res.should.have.status(500);
						done();
					}); // End chai
				}); // historia save
			}); // antecedente save
		}); // save paciente
	}); // end it


	it('No edita un paciente sin apellidos', function(done){
		paciente.save((err, pacienteSaved) => {
			var idPat = pacienteSaved._id;
			var pacienteEditado = {
			  _id: idPat, cedula: '5928077593', nombres: 'Julian', apellidos: '',
			  email: 'jadams@espol.edu.ec', fechaNacimiento: '2000-01-01', sexo: 'Masculino', 
			  direccion: 'Av Siempreviva', celular: '0912345678', ocupacion: 'Estudiante',
			  motivoConsulta: 'Bajar de peso', ejercicios: 'Correr en las mañanas',
			  frecuencia: '3 veces por semana'
			};
			var anteced = {
			  idPaciente: idPat, alteracionApetito: false, nausea: false, vomito: false, 
			  estrenimiento: false, diarrea: false, flatulencia: false, acidez: false, 
			  gastritis: false, problemasMasticacion: false, cambioSaborComidas: false,
			  alergia: false, descripcionAlergias: "", suplementoVitaminicos: false, 
			  descripcionSuplementos: "", medicamento: false, descripcionMedicamentos: "",
			  ojos: false, cabello: false, unias: false, piel: false, antecedentesPersonales: "", 
			  antecedentesFamiliares: "", observaciones: ""
			}
			// Guardamos el antecedente
			var antecedEditado = new Antecedente(anteced);
			antecedEditado.save((err, antecedenteSaved) => {
				var histo = {
				  idPaciente: idPat, comidasAlDia: 3, preparadoPor: "Casa", modificaFinesDeSemana: false, 
				  comidaFinesdeSemana: "", comeEntreComidas: true, snacksEntreComidas: "Frutas", 
				  queCome: "Pollo y pescado", aguaAlDia: 3, cafeAlDia: 5, cigarrosAlDia: 0, alcoholALaSemana: 0,
				  grupoAlimentos:[
				    {
				      descripcion: "Lácteos", frecuencia: 3, 
				      alimentosAgradan: "leche", alimentosDesagradan: "queso" 
				  	}
				  ]
				}
				// Guardamos la historia alimentaria
				var histEditado = new HistoriaA(histo);
				histEditado.save((err, historiaSaved) => {
					// Data a enviarse para editar
					var data = {
					  paciente: pacienteEditado, antecedente: antecedenteSaved, historia: historiaSaved
					}
					// Chai test
					chai.request(puerto)
					  .put('/api/pacientes/'+idPat)
					  .send(data)
					  .end((err, res) => {
						res.should.have.status(500);
						done();
					}); // End chai
				}); // historia save
			}); // antecedente save
		}); // save paciente
	}); // end it


	it('No edita un paciente con apellidos no válidos', function(done){
		paciente.save((err, pacienteSaved) => {
			var idPat = pacienteSaved._id;
			var pacienteEditado = {
			  _id: idPat, cedula: '5928077593', nombres: 'Julian', apellidos: '4d4m5',
			  email: 'jadams@espol.edu.ec', fechaNacimiento: '2000-01-01', sexo: 'Masculino', 
			  direccion: 'Av Siempreviva', celular: '0912345678', ocupacion: 'Estudiante',
			  motivoConsulta: 'Bajar de peso', ejercicios: 'Correr en las mañanas',
			  frecuencia: '3 veces por semana'
			};
			var anteced = {
			  idPaciente: idPat, alteracionApetito: false, nausea: false, vomito: false, 
			  estrenimiento: false, diarrea: false, flatulencia: false, acidez: false, 
			  gastritis: false, problemasMasticacion: false, cambioSaborComidas: false,
			  alergia: false, descripcionAlergias: "", suplementoVitaminicos: false, 
			  descripcionSuplementos: "", medicamento: false, descripcionMedicamentos: "",
			  ojos: false, cabello: false, unias: false, piel: false, antecedentesPersonales: "", 
			  antecedentesFamiliares: "", observaciones: ""
			}
			// Guardamos el antecedente
			var antecedEditado = new Antecedente(anteced);
			antecedEditado.save((err, antecedenteSaved) => {
				var histo = {
				  idPaciente: idPat, comidasAlDia: 3, preparadoPor: "Casa", modificaFinesDeSemana: false, 
				  comidaFinesdeSemana: "", comeEntreComidas: true, snacksEntreComidas: "Frutas", 
				  queCome: "Pollo y pescado", aguaAlDia: 3, cafeAlDia: 5, cigarrosAlDia: 0, alcoholALaSemana: 0,
				  grupoAlimentos:[
				    {
				      descripcion: "Lácteos", frecuencia: 3, 
				      alimentosAgradan: "leche", alimentosDesagradan: "queso" 
				  	}
				  ]
				}
				// Guardamos la historia alimentaria
				var histEditado = new HistoriaA(histo);
				histEditado.save((err, historiaSaved) => {
					// Data a enviarse para editar
					var data = {
					  paciente: pacienteEditado, antecedente: antecedenteSaved, historia: historiaSaved
					}
					// Chai test
					chai.request(puerto)
					  .put('/api/pacientes/'+idPat)
					  .send(data)
					  .end((err, res) => {
						res.should.have.status(500);
						done();
					}); // End chai
				}); // historia save
			}); // antecedente save
		}); // save paciente
	}); // end it


	it('No edita un paciente sin fecha de nacimiento', function(done){
		paciente.save((err, pacienteSaved) => {
			var idPat = pacienteSaved._id;
			var pacienteEditado = {
			  _id: idPat, cedula: '5928077593', nombres: 'Adams', apellidos: 'Julian',
			  email: 'jadams@espol.edu.ec', fechaNacimiento: '', sexo: 'Masculino', 
			  direccion: 'Av Siempreviva', celular: '0912345678', ocupacion: 'Estudiante',
			  motivoConsulta: 'Bajar de peso', ejercicios: 'Correr en las mañanas',
			  frecuencia: '3 veces por semana'
			};
			var anteced = {
			  idPaciente: idPat, alteracionApetito: false, nausea: false, vomito: false, 
			  estrenimiento: false, diarrea: false, flatulencia: false, acidez: false, 
			  gastritis: false, problemasMasticacion: false, cambioSaborComidas: false,
			  alergia: false, descripcionAlergias: "", suplementoVitaminicos: false, 
			  descripcionSuplementos: "", medicamento: false, descripcionMedicamentos: "",
			  ojos: false, cabello: false, unias: false, piel: false, antecedentesPersonales: "", 
			  antecedentesFamiliares: "", observaciones: ""
			}
			// Guardamos el antecedente
			var antecedEditado = new Antecedente(anteced);
			antecedEditado.save((err, antecedenteSaved) => {
				var histo = {
				  idPaciente: idPat, comidasAlDia: 3, preparadoPor: "Casa", modificaFinesDeSemana: false, 
				  comidaFinesdeSemana: "", comeEntreComidas: true, snacksEntreComidas: "Frutas", 
				  queCome: "Pollo y pescado", aguaAlDia: 3, cafeAlDia: 5, cigarrosAlDia: 0, alcoholALaSemana: 0,
				  grupoAlimentos:[
				    {
				      descripcion: "Lácteos", frecuencia: 3, 
				      alimentosAgradan: "leche", alimentosDesagradan: "queso" 
				  	}
				  ]
				}
				// Guardamos la historia alimentaria
				var histEditado = new HistoriaA(histo);
				histEditado.save((err, historiaSaved) => {
					// Data a enviarse para editar
					var data = {
					  paciente: pacienteEditado, antecedente: antecedenteSaved, historia: historiaSaved
					}
					// Chai test
					chai.request(puerto)
					  .put('/api/pacientes/'+idPat)
					  .send(data)
					  .end((err, res) => {
						res.should.have.status(500);
						done();
					}); // End chai
				}); // historia save
			}); // antecedente save
		}); // save paciente
	}); // end it


	it('No edita un paciente sin su sexo', function(done){
		paciente.save((err, pacienteSaved) => {
			var idPat = pacienteSaved._id;
			var pacienteEditado = {
			  _id: idPat, cedula: '5928077593', nombres: 'Adams', apellidos: 'Julian',
			  email: 'jadams@espol.edu.ec', fechaNacimiento: '2000-01-01', sexo: '', 
			  direccion: 'Av Siempreviva', celular: '0912345678', ocupacion: 'Estudiante',
			  motivoConsulta: 'Bajar de peso', ejercicios: 'Correr en las mañanas',
			  frecuencia: '3 veces por semana'
			};
			var anteced = {
			  idPaciente: idPat, alteracionApetito: false, nausea: false, vomito: false, 
			  estrenimiento: false, diarrea: false, flatulencia: false, acidez: false, 
			  gastritis: false, problemasMasticacion: false, cambioSaborComidas: false,
			  alergia: false, descripcionAlergias: "", suplementoVitaminicos: false, 
			  descripcionSuplementos: "", medicamento: false, descripcionMedicamentos: "",
			  ojos: false, cabello: false, unias: false, piel: false, antecedentesPersonales: "", 
			  antecedentesFamiliares: "", observaciones: ""
			}
			// Guardamos el antecedente
			var antecedEditado = new Antecedente(anteced);
			antecedEditado.save((err, antecedenteSaved) => {
				var histo = {
				  idPaciente: idPat, comidasAlDia: 3, preparadoPor: "Casa", modificaFinesDeSemana: false, 
				  comidaFinesdeSemana: "", comeEntreComidas: true, snacksEntreComidas: "Frutas", 
				  queCome: "Pollo y pescado", aguaAlDia: 3, cafeAlDia: 5, cigarrosAlDia: 0, alcoholALaSemana: 0,
				  grupoAlimentos:[
				    {
				      descripcion: "Lácteos", frecuencia: 3, 
				      alimentosAgradan: "leche", alimentosDesagradan: "queso" 
				  	}
				  ]
				}
				// Guardamos la historia alimentaria
				var histEditado = new HistoriaA(histo);
				histEditado.save((err, historiaSaved) => {
					// Data a enviarse para editar
					var data = {
					  paciente: pacienteEditado, antecedente: antecedenteSaved, historia: historiaSaved
					}
					// Chai test
					chai.request(puerto)
					  .put('/api/pacientes/'+idPat)
					  .send(data)
					  .end((err, res) => {
						res.should.have.status(500);
						done();
					}); // End chai
				}); // historia save
			}); // antecedente save
		}); // save paciente
	}); // end it


	it('Edita un paciente cuyo sexo es Masculino', function(done){
		paciente.save((err, pacienteSaved) => {
			var idPat = pacienteSaved._id;
			var pacienteEditado = {
			  _id: idPat, cedula: '5928077593', nombres: 'Adams', apellidos: 'Julian',
			  email: 'jadams@espol.edu.ec', fechaNacimiento: '2000-01-01', sexo: 'Masculino', 
			  direccion: 'Av Siempreviva', celular: '0912345678', ocupacion: 'Estudiante',
			  motivoConsulta: 'Bajar de peso', ejercicios: 'Correr en las mañanas',
			  frecuencia: '3 veces por semana'
			};
			var anteced = {
			  idPaciente: idPat, alteracionApetito: false, nausea: false, vomito: false, 
			  estrenimiento: false, diarrea: false, flatulencia: false, acidez: false, 
			  gastritis: false, problemasMasticacion: false, cambioSaborComidas: false,
			  alergia: false, descripcionAlergias: "", suplementoVitaminicos: false, 
			  descripcionSuplementos: "", medicamento: false, descripcionMedicamentos: "",
			  ojos: false, cabello: false, unias: false, piel: false, antecedentesPersonales: "", 
			  antecedentesFamiliares: "", observaciones: ""
			}
			// Guardamos el antecedente
			var antecedEditado = new Antecedente(anteced);
			antecedEditado.save((err, antecedenteSaved) => {
				var histo = {
				  idPaciente: idPat, comidasAlDia: 3, preparadoPor: "Casa", modificaFinesDeSemana: false, 
				  comidaFinesdeSemana: "", comeEntreComidas: true, snacksEntreComidas: "Frutas", 
				  queCome: "Pollo y pescado", aguaAlDia: 3, cafeAlDia: 5, cigarrosAlDia: 0, alcoholALaSemana: 0,
				  grupoAlimentos:[
				    {
				      descripcion: "Lácteos", frecuencia: 3, 
				      alimentosAgradan: "leche", alimentosDesagradan: "queso" 
				  	}
				  ]
				}
				// Guardamos la historia alimentaria
				var histEditado = new HistoriaA(histo);
				histEditado.save((err, historiaSaved) => {
					// Data a enviarse para editar
					var data = {
					  paciente: pacienteEditado, antecedente: antecedenteSaved, historia: historiaSaved
					}
					// Chai test
					chai.request(puerto)
					  .put('/api/pacientes/'+idPat)
					  .send(data)
					  .end((err, res) => {
						res.should.have.status(200);
						done();
					}); // End chai
				}); // historia save
			}); // antecedente save
		}); // save paciente
	}); // end it


	it('Edita un paciente cuyo sexo es Femenino', function(done){
		paciente.save((err, pacienteSaved) => {
			var idPat = pacienteSaved._id;
			var pacienteEditado = {
			  _id: idPat, cedula: '5928077593', nombres: 'Adams', apellidos: 'Julian',
			  email: 'jadams@espol.edu.ec', fechaNacimiento: '2000-01-01', sexo: 'Femenino', 
			  direccion: 'Av Siempreviva', celular: '0912345678', ocupacion: 'Estudiante',
			  motivoConsulta: 'Bajar de peso', ejercicios: 'Correr en las mañanas',
			  frecuencia: '3 veces por semana'
			};
			var anteced = {
			  idPaciente: idPat, alteracionApetito: false, nausea: false, vomito: false, 
			  estrenimiento: false, diarrea: false, flatulencia: false, acidez: false, 
			  gastritis: false, problemasMasticacion: false, cambioSaborComidas: false,
			  alergia: false, descripcionAlergias: "", suplementoVitaminicos: false, 
			  descripcionSuplementos: "", medicamento: false, descripcionMedicamentos: "",
			  ojos: false, cabello: false, unias: false, piel: false, antecedentesPersonales: "", 
			  antecedentesFamiliares: "", observaciones: ""
			}
			// Guardamos el antecedente
			var antecedEditado = new Antecedente(anteced);
			antecedEditado.save((err, antecedenteSaved) => {
				var histo = {
				  idPaciente: idPat, comidasAlDia: 3, preparadoPor: "Casa", modificaFinesDeSemana: false, 
				  comidaFinesdeSemana: "", comeEntreComidas: true, snacksEntreComidas: "Frutas", 
				  queCome: "Pollo y pescado", aguaAlDia: 3, cafeAlDia: 5, cigarrosAlDia: 0, alcoholALaSemana: 0,
				  grupoAlimentos:[
				    {
				      descripcion: "Lácteos", frecuencia: 3, 
				      alimentosAgradan: "leche", alimentosDesagradan: "queso" 
				  	}
				  ]
				}
				// Guardamos la historia alimentaria
				var histEditado = new HistoriaA(histo);
				histEditado.save((err, historiaSaved) => {
					// Data a enviarse para editar
					var data = {
					  paciente: pacienteEditado, antecedente: antecedenteSaved, historia: historiaSaved
					}
					// Chai test
					chai.request(puerto)
					  .put('/api/pacientes/'+idPat)
					  .send(data)
					  .end((err, res) => {
						res.should.have.status(200);
						done();
					}); // End chai
				}); // historia save
			}); // antecedente save
		}); // save paciente
	}); // end it



	it('No edita un paciente cuyo sexo no es Masculino o Femenino', function(done){
		paciente.save((err, pacienteSaved) => {
			var idPat = pacienteSaved._id;
			var pacienteEditado = {
			  _id: idPat, cedula: '5928077593', nombres: 'Adams', apellidos: 'Julian',
			  email: 'jadams@espol.edu.ec', fechaNacimiento: '2000-01-01', sexo: 'Sin definir', 
			  direccion: 'Av Siempreviva', celular: '0912345678', ocupacion: 'Estudiante',
			  motivoConsulta: 'Bajar de peso', ejercicios: 'Correr en las mañanas',
			  frecuencia: '3 veces por semana'
			};
			var anteced = {
			  idPaciente: idPat, alteracionApetito: false, nausea: false, vomito: false, 
			  estrenimiento: false, diarrea: false, flatulencia: false, acidez: false, 
			  gastritis: false, problemasMasticacion: false, cambioSaborComidas: false,
			  alergia: false, descripcionAlergias: "", suplementoVitaminicos: false, 
			  descripcionSuplementos: "", medicamento: false, descripcionMedicamentos: "",
			  ojos: false, cabello: false, unias: false, piel: false, antecedentesPersonales: "", 
			  antecedentesFamiliares: "", observaciones: ""
			}
			// Guardamos el antecedente
			var antecedEditado = new Antecedente(anteced);
			antecedEditado.save((err, antecedenteSaved) => {
				var histo = {
				  idPaciente: idPat, comidasAlDia: 3, preparadoPor: "Casa", modificaFinesDeSemana: false, 
				  comidaFinesdeSemana: "", comeEntreComidas: true, snacksEntreComidas: "Frutas", 
				  queCome: "Pollo y pescado", aguaAlDia: 3, cafeAlDia: 5, cigarrosAlDia: 0, alcoholALaSemana: 0,
				  grupoAlimentos:[
				    {
				      descripcion: "Lácteos", frecuencia: 3, 
				      alimentosAgradan: "leche", alimentosDesagradan: "queso" 
				  	}
				  ]
				}
				// Guardamos la historia alimentaria
				var histEditado = new HistoriaA(histo);
				histEditado.save((err, historiaSaved) => {
					// Data a enviarse para editar
					var data = {
					  paciente: pacienteEditado, antecedente: antecedenteSaved, historia: historiaSaved
					}
					// Chai test
					chai.request(puerto)
					  .put('/api/pacientes/'+idPat)
					  .send(data)
					  .end((err, res) => {
						res.should.have.status(500);
						done();
					}); // End chai
				}); // historia save
			}); // antecedente save
		}); // save paciente
	}); // end it


	it('No edita un paciente sin el motivo de la consulta', function(done){
		paciente.save((err, pacienteSaved) => {
			var idPat = pacienteSaved._id;
			var pacienteEditado = {
			  _id: idPat, cedula: '5928077593', nombres: 'Adams', apellidos: 'Julian',
			  email: 'jadams@espol.edu.ec', fechaNacimiento: '2000-01-01', sexo: 'Masculino', 
			  direccion: 'Av Siempreviva', celular: '0912345678', ocupacion: 'Estudiante',
			  motivoConsulta: '', ejercicios: 'Correr en las mañanas',
			  frecuencia: '3 veces por semana'
			};
			var anteced = {
			  idPaciente: idPat, alteracionApetito: false, nausea: false, vomito: false, 
			  estrenimiento: false, diarrea: false, flatulencia: false, acidez: false, 
			  gastritis: false, problemasMasticacion: false, cambioSaborComidas: false,
			  alergia: false, descripcionAlergias: "", suplementoVitaminicos: false, 
			  descripcionSuplementos: "", medicamento: false, descripcionMedicamentos: "",
			  ojos: false, cabello: false, unias: false, piel: false, antecedentesPersonales: "", 
			  antecedentesFamiliares: "", observaciones: ""
			}
			// Guardamos el antecedente
			var antecedEditado = new Antecedente(anteced);
			antecedEditado.save((err, antecedenteSaved) => {
				var histo = {
				  idPaciente: idPat, comidasAlDia: 3, preparadoPor: "Casa", modificaFinesDeSemana: false, 
				  comidaFinesdeSemana: "", comeEntreComidas: true, snacksEntreComidas: "Frutas", 
				  queCome: "Pollo y pescado", aguaAlDia: 3, cafeAlDia: 5, cigarrosAlDia: 0, alcoholALaSemana: 0,
				  grupoAlimentos:[
				    {
				      descripcion: "Lácteos", frecuencia: 3, 
				      alimentosAgradan: "leche", alimentosDesagradan: "queso" 
				  	}
				  ]
				}
				// Guardamos la historia alimentaria
				var histEditado = new HistoriaA(histo);
				histEditado.save((err, historiaSaved) => {
					// Data a enviarse para editar
					var data = {
					  paciente: pacienteEditado, antecedente: antecedenteSaved, historia: historiaSaved
					}
					// Chai test
					chai.request(puerto)
					  .put('/api/pacientes/'+idPat)
					  .send(data)
					  .end((err, res) => {
						res.should.have.status(500);
						done();
					}); // End chai
				}); // historia save
			}); // antecedente save
		}); // save paciente
	}); // end it


	it('No edita un paciente sin el email', function(done){
		paciente.save((err, pacienteSaved) => {
			var idPat = pacienteSaved._id;
			var pacienteEditado = {
			  _id: idPat, cedula: '5928077593', nombres: 'Adams', apellidos: 'Julian',
			  email: '', fechaNacimiento: '2000-01-01', sexo: 'Masculino', 
			  direccion: 'Av Siempreviva', celular: '0912345678', ocupacion: 'Estudiante',
			  motivoConsulta: 'Bajar de peso', ejercicios: 'Correr en las mañanas',
			  frecuencia: '3 veces por semana'
			};
			var anteced = {
			  idPaciente: idPat, alteracionApetito: false, nausea: false, vomito: false, 
			  estrenimiento: false, diarrea: false, flatulencia: false, acidez: false, 
			  gastritis: false, problemasMasticacion: false, cambioSaborComidas: false,
			  alergia: false, descripcionAlergias: "", suplementoVitaminicos: false, 
			  descripcionSuplementos: "", medicamento: false, descripcionMedicamentos: "",
			  ojos: false, cabello: false, unias: false, piel: false, antecedentesPersonales: "", 
			  antecedentesFamiliares: "", observaciones: ""
			}
			// Guardamos el antecedente
			var antecedEditado = new Antecedente(anteced);
			antecedEditado.save((err, antecedenteSaved) => {
				var histo = {
				  idPaciente: idPat, comidasAlDia: 3, preparadoPor: "Casa", modificaFinesDeSemana: false, 
				  comidaFinesdeSemana: "", comeEntreComidas: true, snacksEntreComidas: "Frutas", 
				  queCome: "Pollo y pescado", aguaAlDia: 3, cafeAlDia: 5, cigarrosAlDia: 0, alcoholALaSemana: 0,
				  grupoAlimentos:[
				    {
				      descripcion: "Lácteos", frecuencia: 3, 
				      alimentosAgradan: "leche", alimentosDesagradan: "queso" 
				  	}
				  ]
				}
				// Guardamos la historia alimentaria
				var histEditado = new HistoriaA(histo);
				histEditado.save((err, historiaSaved) => {
					// Data a enviarse para editar
					var data = {
					  paciente: pacienteEditado, antecedente: antecedenteSaved, historia: historiaSaved
					}
					// Chai test
					chai.request(puerto)
					  .put('/api/pacientes/'+idPat)
					  .send(data)
					  .end((err, res) => {
						res.should.have.status(500);
						done();
					}); // End chai
				}); // historia save
			}); // antecedente save
		}); // save paciente
	}); // end it


	it('No edita un paciente con email inválido', function(done){
		paciente.save((err, pacienteSaved) => {
			var idPat = pacienteSaved._id;
			var pacienteEditado = {
			  _id: idPat, cedula: '5928077593', nombres: 'Adams', apellidos: 'Julian',
			  email: 'www.espol.edu.ec', fechaNacimiento: '2000-01-01', sexo: 'Masculino', 
			  direccion: 'Av Siempreviva', celular: '0912345678', ocupacion: 'Estudiante',
			  motivoConsulta: 'Bajar de peso', ejercicios: 'Correr en las mañanas',
			  frecuencia: '3 veces por semana'
			};
			var anteced = {
			  idPaciente: idPat, alteracionApetito: false, nausea: false, vomito: false, 
			  estrenimiento: false, diarrea: false, flatulencia: false, acidez: false, 
			  gastritis: false, problemasMasticacion: false, cambioSaborComidas: false,
			  alergia: false, descripcionAlergias: "", suplementoVitaminicos: false, 
			  descripcionSuplementos: "", medicamento: false, descripcionMedicamentos: "",
			  ojos: false, cabello: false, unias: false, piel: false, antecedentesPersonales: "", 
			  antecedentesFamiliares: "", observaciones: ""
			}
			// Guardamos el antecedente
			var antecedEditado = new Antecedente(anteced);
			antecedEditado.save((err, antecedenteSaved) => {
				var histo = {
				  idPaciente: idPat, comidasAlDia: 3, preparadoPor: "Casa", modificaFinesDeSemana: false, 
				  comidaFinesdeSemana: "", comeEntreComidas: true, snacksEntreComidas: "Frutas", 
				  queCome: "Pollo y pescado", aguaAlDia: 3, cafeAlDia: 5, cigarrosAlDia: 0, alcoholALaSemana: 0,
				  grupoAlimentos:[
				    {
				      descripcion: "Lácteos", frecuencia: 3, 
				      alimentosAgradan: "leche", alimentosDesagradan: "queso" 
				  	}
				  ]
				}
				// Guardamos la historia alimentaria
				var histEditado = new HistoriaA(histo);
				histEditado.save((err, historiaSaved) => {
					// Data a enviarse para editar
					var data = {
					  paciente: pacienteEditado, antecedente: antecedenteSaved, historia: historiaSaved
					}
					// Chai test
					chai.request(puerto)
					  .put('/api/pacientes/'+idPat)
					  .send(data)
					  .end((err, res) => {
						res.should.have.status(500);
						done();
					}); // End chai
				}); // historia save
			}); // antecedente save
		}); // save paciente
	}); // end it


	it('No edita un paciente con celular inválido', function(done){
		paciente.save((err, pacienteSaved) => {
			var idPat = pacienteSaved._id;
			var pacienteEditado = {
			  _id: idPat, cedula: '5928077593', nombres: 'Adams', apellidos: 'Julian',
			  email: 'www.espol.edu.ec', fechaNacimiento: '2000-01-01', sexo: 'Masculino', 
			  direccion: 'Av Siempreviva', celular: '1100000011', ocupacion: 'Estudiante',
			  motivoConsulta: 'Bajar de peso', ejercicios: 'Correr en las mañanas',
			  frecuencia: '3 veces por semana'
			};
			var anteced = {
			  idPaciente: idPat, alteracionApetito: false, nausea: false, vomito: false, 
			  estrenimiento: false, diarrea: false, flatulencia: false, acidez: false, 
			  gastritis: false, problemasMasticacion: false, cambioSaborComidas: false,
			  alergia: false, descripcionAlergias: "", suplementoVitaminicos: false, 
			  descripcionSuplementos: "", medicamento: false, descripcionMedicamentos: "",
			  ojos: false, cabello: false, unias: false, piel: false, antecedentesPersonales: "", 
			  antecedentesFamiliares: "", observaciones: ""
			}
			// Guardamos el antecedente
			var antecedEditado = new Antecedente(anteced);
			antecedEditado.save((err, antecedenteSaved) => {
				var histo = {
				  idPaciente: idPat, comidasAlDia: 3, preparadoPor: "Casa", modificaFinesDeSemana: false, 
				  comidaFinesdeSemana: "", comeEntreComidas: true, snacksEntreComidas: "Frutas", 
				  queCome: "Pollo y pescado", aguaAlDia: 3, cafeAlDia: 5, cigarrosAlDia: 0, alcoholALaSemana: 0,
				  grupoAlimentos:[
				    {
				      descripcion: "Lácteos", frecuencia: 3, 
				      alimentosAgradan: "leche", alimentosDesagradan: "queso" 
				  	}
				  ]
				}
				// Guardamos la historia alimentaria
				var histEditado = new HistoriaA(histo);
				histEditado.save((err, historiaSaved) => {
					// Data a enviarse para editar
					var data = {
					  paciente: pacienteEditado, antecedente: antecedenteSaved, historia: historiaSaved
					}
					// Chai test
					chai.request(puerto)
					  .put('/api/pacientes/'+idPat)
					  .send(data)
					  .end((err, res) => {
						res.should.have.status(500);
						done();
					}); // End chai
				}); // historia save
			}); // antecedente save
		}); // save paciente
	}); // end it
	


});