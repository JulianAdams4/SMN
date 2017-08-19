//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
var server = require('../server');
var mongoose = require("mongoose");
var Paciente = mongoose.model('Paciente');
var DatosControl = mongoose.model('DatosControl');
var paciente={}
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
    afterEach((done) => {
        DatosControl.remove({}, (err) => {
          Paciente.remove({}, (err) => {
            done();
          });
        });
    });

  });

var patId = '';
var datId = '';
describe('/POST datosControl', () => {
  //EXISTE PACIENTE
  it('Debe guardar los datos de control de un paciente', (done) => {
    var paciente = new Paciente({
          cedula:		'1234567890',
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
                    unidadDato: 'kg'
                  },
                  {
                    nombreDato:'Altura',
                    valorDato: 165.00,
                    unidadDato: 'cm'
                   }
                ],
                foto: "http://www.imagen.com.mx/assets/img/imagen_share.png"
            }
            chai.request('http://localhost:3000')
                .post('/api/datosControlPaciente/'+patId)
                .send(datosControl)
                .end((err, res) => {
                  res.should.have.status(201);
                  res.body.should.have.property('idPaciente').eql(patId);
                  done();
            });
        });
  });
  //NO EXISTE PACIENTE
  it('No existe un paciente con ese id para los datos de control', (done) => {
    var datosControl = {
        idPaciente: '5928bafb9fa058092098ae88',
    		fechaDato: '2017-04-13',
    		observaciones:'prueba',
    		datos:[
    		  {
    		    nombreDato:'Peso',
    		    valorDato: 150.00,
    		    unidadDato: 'kg'
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
  //NO INGRESA FECHA DATO
  it('No ingresa fecha de registro del dato de control', (done) => {
    var datosControl = {
        idPaciente: patId,
    		observaciones:'prueba',
    		datos:[
    		  {
    		    nombreDato:'Peso',
    		    valorDato: 150.00,
    		    unidadDato: 'kg'
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
          res.should.have.status(500);
          done();
        });
  });
  //NO INGRESA OBSERVACIONES
  it('No ingresa observaciones del dato de control', (done) => {
    var datosControl = {
        idPaciente: patId,
        datos:[
          {
            nombreDato:'Peso',
            valorDato: 150.00,
            unidadDato: 'kg'
          }
        ],
        foto: "http://www.imagen.com.mx/assets/img/imagen_share.png"
    }
    chai.request('http://localhost:3000')
        .post('/api/datosControlPaciente/'+patId)
        .send(datosControl)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
  });
  //NO INGRESA DATO
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
          res.should.have.status(500);
          done();
        });
  });
  //NO INGRESA NOMBRE DATO
  it('No ingresa el nombre de un dato de control', (done) => {
    var datosControl = {
        idPaciente: patId,
        fechaDato: '2017-04-13',
        observaciones:'prueba',
        datos:[
          {
            valorDato: ''+150.00,
            unidadDato: 'kg'
          }
        ]
    }
    chai.request('http://localhost:3000')
        .post('/api/datosControlPaciente/'+patId)
        .send(datosControl)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
  });
  //NO INGRESA VALOR DATO
  it('No ingresa el valor de un dato de control', (done) => {
    var datosControl = {
        idPaciente: patId,
        fechaDato: '2017-04-13',
        observaciones:'prueba',
        datos:[
          {
            nombre: 'Peso',
            unidadDato: 'kg'
          }
        ]
    }
    chai.request('http://localhost:3000')
        .post('/api/datosControlPaciente/'+patId)
        .send(datosControl)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
  });
  //NO INGRESA UNIDAD DATO
  it('No ingresa unidad de un dato de control', (done) => {
    var datosControl = {
        idPaciente: patId,
        datos:[
          {
            nombreDato:'Peso',
            valorDato: '150',
          }
        ]
    }
    chai.request('http://localhost:3000')
        .post('/api/datosControlPaciente/'+patId)
        .send(datosControl)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
  });
//NO INGRESA FOTO DE SEGUIMIENTO
  it('No ingresa foto de seguimiento del dato de control', (done) => {
    var datosControl = {
        idPaciente: patId,
        fechaDato: '2017-04-13',
	     	observaciones:'prueba',
        datos:[
          {
            nombreDato:'Peso',
            valorDato: 150.00,
            unidadDato: 'kg'
          }
        ],
    }
    chai.request('http://localhost:3000')
        .post('/api/datosControlPaciente/'+patId)
        .send(datosControl)
        .end((err, res) => {
          res.should.have.status(500);
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
//  });

      it('No debe retornar ningún dato de control ya que no existe el paciente', function(done){
        chai.request('http://localhost:3000')
            .get('/api/datosControlPaciente/5928bafb9fa058092098ae88')
            .end(function(err, res){
                res.should.have.status(404);
              done();
            });
      });
  });


  var idPat = "";
  var idDato = "";

describe('/PUT datosControl', () => {

    beforeEach( function(done) {

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

    // Clean collection
  	afterEach(function(done){
  		Paciente.remove({},function(err){
  			DatosControl.remove({}, function (err) {
  			  done();
  			});
  		});
  	});
    it('Actualiza los datos de control con un determinado ID', function(done){
        var datosControl = new DatosControl({
                idPaciente: idPat,
                fechaDato: '2017-04-13',
                observaciones:'pruebaEditar',
                datos:[
                  {
                    nombreDato:'Peso',
                    valorDato: 150.00,
                    unidadDato: 'kg'
                  },
                  {
                    nombreDato:'Altura',
                    valorDato: 165.00,
                    unidadDato: 'cm'
                   }
                ],
                foto: "http://www.imagen.com.mx/assets/img/imagen_share.png"
            });
        datosControl.save((err, dato) => {
            chai.request('http://localhost:3000')
                .put('/api/datosControl/' + dato._id)
                .send({  datos:[
                  {
                    nombreDato:'Peso',
                    valorDato: 165.00,
                    unidadDato: 'cm'
                  }
                ],observaciones:"actualizada"})
                .end(function(err, res){
                  res.should.have.status(204);
                    done();
          });
        });
      });
      it('Actualiza foto de seguimiento de un dato de control', function(done){
        var datosControl = new DatosControl({
                idPaciente: idPat,
                fechaDato: '2017-04-13',
                observaciones:'pruebaEditar',
                datos:[
                  {
                    nombreDato:'Peso',
                    valorDato: 150.00,
                    unidadDato: 'kg'
                  },
                  {
                    nombreDato:'Altura',
                    valorDato: 165.00,
                    unidadDato: 'cm'
                   }
                ],
                foto: "http://www.imagen.com.mx/assets/img/imagen_share.png"
            });
        datosControl.save((err, dato) => {
            chai.request('http://localhost:3000')
                .put('/api/datosControl/' + dato._id)
                .send({  datos:[
                  {
                    nombreDato:'Peso',
                    valorDato: 165.00,
                    unidadDato: 'kg'
                  }
                ],
                  foto: "http://cdn.imagentv.com/resources/defaults/v2/imagen_default300.png"})
                .end(function(err, res){
                  if(err){
                    console.log("akiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
                  }
                  res.should.have.status(204);
                    done();
          });
        });
      });
    it('No se ingresa fecha de dato de control al editar', function(done){
        var datosControl = new DatosControl({
                idPaciente: idPat,
                fechaDato: '2017-04-13',
                observaciones:'pruebaEditar',
                datos:[
                  {
                    nombreDato:'Peso',
                    valorDato: 150.00,
                    unidadDato: 'kg'
                  },
                  {
                    nombreDato:'Altura',
                    valorDato: 165.00,
                    unidadDato: 'cm'
                   }
                ],
                foto: "http://www.imagen.com.mx/assets/img/imagen_share.png"
            });
        datosControl.save((err, dato) => {
            chai.request('http://localhost:3000')
                .put('/api/datosControl/' + dato._id)
                .send({ fechaDato: '', observaciones: 'cambio' })
                .end(function(err, res){
                  res.should.have.status(500);
                    done();
          });
        });
      });
      it('No se ingresa observaciones de dato de control al editar', function(done){
        var datosControl = new DatosControl({
                idPaciente: idPat,
                fechaDato: '2017-04-13',
                observaciones:'pruebaEditar',
                datos:[
                  {
                    nombreDato:'Peso',
                    valorDato: 150.00,
                    unidadDato: 'kg'
                  },
                  {
                    nombreDato:'Altura',
                    valorDato: 165.00,
                    unidadDato: 'cm'
                   }
                ],
                foto: "http://www.imagen.com.mx/assets/img/imagen_share.png"
            });
        datosControl.save((err, dato) => {
            chai.request('http://localhost:3000')
                .put('/api/datosControl/' + dato._id)
                .send({ observaciones: '' })
                .end(function(err, res){
              res.should.have.status(500);
                    done();
          });
        });
      });
      it('No se ingresa ningún dato de control al editar', function(done){
        var datosControl = new DatosControl({
                idPaciente: idPat,
                fechaDato: '2017-04-13',
                observaciones:'pruebaEditar',
                datos:[
                  {
                    nombreDato:'Peso',
                    valorDato: 150.00,
                    unidadDato: 'kg'
                  },
                  {
                    nombreDato:'Altura',
                    valorDato: 165.00,
                    unidadDato: 'cm'
                   }
                ],
                foto: "http://www.imagen.com.mx/assets/img/imagen_share.png"
            });
        datosControl.save((err, dato) => {
            chai.request('http://localhost:3000')
                .put('/api/datosControl/' + dato._id)
                .send({ datos: [] })
                .end(function(err, res){
              res.should.have.status(500);
                    done();
          });
        });
      });
      it('No se ingresa un campo obligatorio de un parametro al editar un dato de control', function(done){
        var datosControl = new DatosControl({
                idPaciente: idPat,
                fechaDato: '2017-04-13',
                observaciones:'pruebaEditar',
                datos:[
                  {
                    nombreDato:'Peso',
                    valorDato: 150.00,
                    unidadDato: 'kg'
                  }
                ],
                foto: "http://www.imagen.com.mx/assets/img/imagen_share.png"
            });
        datosControl.save((err, dato) => {
            chai.request('http://localhost:3000')
                .put('/api/datosControl/' + dato._id)
                .send({  datos:[
                  {
                    nombreDato:'Peso'
                  }
                ]})
                .end(function(err, res){
              res.should.have.status(500);
                    done();
          });
        });
      });
      it('No se ingresa foto de seguimiento al editar', function(done){
        var datosControl = new DatosControl({
                idPaciente: idPat,
                fechaDato: '2017-04-13',
                observaciones:'pruebaEditar',
                datos:[
                  {
                    nombreDato:'Peso',
                    valorDato: 150.00,
                    unidadDato: 'kg'
                  },
                  {
                    nombreDato:'Altura',
                    valorDato: 165.00,
                    unidadDato: 'cm'
                   }
                ],
                foto: "http://www.imagen.com.mx/assets/img/imagen_share.png"
            });
        datosControl.save((err, dato) => {
            chai.request('http://localhost:3000')
                .put('/api/datosControl/' + dato._id)
                .send({ foto: '' })
                .end(function(err, res){
              res.should.have.status(500);
                    done();
          });
        });
      });
  });

describe('/DELETE datosControl', () => {
      it('Se elimina un dato con exito', function(done){
        var datosControl = new DatosControl({
                idPaciente: patId,
                fechaDato: '2017-04-13',
                observaciones:'pruebaEditar',
                datos:[
                  {
                    nombreDato:'Peso',
                    valorDato: 150.00,
                    unidadDato: 'kg'
                  }
                ],
                foto: "http://www.imagen.com.mx/assets/img/imagen_share.png"
            });
        datosControl.save((err, dato) => {
            chai.request('http://localhost:3000')
                .delete('/api/datosControl/' + dato._id)
                .end(function(err, res){
                  res.should.have.status(204);
                    done();
          });
        });
    });
  });
