//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
var server = require('../server');
var mongoose = require("mongoose");
var PaqueteDieta = mongoose.model('PaqueteDieta');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);
centroId = ''

describe('/POST PaqueteDieta', () => {
    beforeEach((done) => { //Before each test we empty the database
      PaqueteDieta.remove({}, (err) => {
         done();
      });
    });
    afterEach((done) => {
        PaqueteDieta.remove({}, (err) => {
          done();
        });
    });
    it('Debe guardar los datos del paquete de dieta', (done) => {
    var paquete = {
            nombre: "Almuerzo light",
            descripcion: "Muy nutritivo",
            precio: '5,50',
            foto: 'http://res.cloudinary.com/dsqpicprf/image/upload/v1501298098/ztepspx7rqjkzvnj63gn.jpg'
        };
        chai.request('http://localhost:3000')
                .post('/api/paquetesDieta')
                .send(paquete)
                .end((err, res) => {
                  res.should.have.status(201);
                  done();
        });
    });
    it('No ingresa el nombre del paquete de dieta', (done) => {
    var paquete = {
            descripcion: "Muy nutritivo",
            precio: '5,50',
            foto: 'http://res.cloudinary.com/dsqpicprf/image/upload/v1501298098/ztepspx7rqjkzvnj63gn.jpg'
        };
        chai.request('http://localhost:3000')
                .post('/api/paquetesDieta')
                .send(paquete)
                .end((err, res) => {
                  res.should.have.status(500);
                  done();
        });
    });
    it('No ingresa la descripcion del paquete de dieta', (done) => {
    var paquete = {
            nombre: "Almuerzo light",
            precio: '5,50',
            foto: 'http://res.cloudinary.com/dsqpicprf/image/upload/v1501298098/ztepspx7rqjkzvnj63gn.jpg'
        };
        chai.request('http://localhost:3000')
                .post('/api/paquetesDieta')
                .send(paquete)
                .end((err, res) => {
                  res.should.have.status(201);
                  done();
        });
    });
    it('No ingresa el precio del paquete de dieta', (done) => {
    var paquete = {
            nombre: "Almuerzo light",
            descripcion: "Muy nutritivo",
            foto: 'http://res.cloudinary.com/dsqpicprf/image/upload/v1501298098/ztepspx7rqjkzvnj63gn.jpg'
        };
        chai.request('http://localhost:3000')
                .post('/api/paquetesDieta')
                .send(paquete)
                .end((err, res) => {
                  res.should.have.status(500);
                  done();
        });
    });
    it('No ingresa la foto del paquete de dieta', (done) => {
    var paquete = {
            nombre: "Almuerzo light",
            descripcion: "Muy nutritivo",
            precio: '5,50',
        };
        chai.request('http://localhost:3000')
                .post('/api/paquetesDieta')
                .send(paquete)
                .end((err, res) => {
                  res.should.have.status(500);
                  done();
        });
    });
  });

  describe('/PUT PaqueteDieta', () => {
    beforeEach((done) => { //Before each test we empty the database
      PaqueteDieta.remove({}, (err) => {
         done();
      });
    });
  afterEach((done) => {
        PaqueteDieta.remove({}, (err) => {
          done();
        });
    });
    it('Actualiza los datos de un paquete de dieta exitosamente', function(done){
        var paquete = new PaqueteDieta({
            nombre: "Almuerzo light",
            descripcion: "Muy nutritivo",
            precio: '5,50',
            foto: 'http://res.cloudinary.com/dsqpicprf/image/upload/v1501298098/ztepspx7rqjkzvnj63gn.jpg'
        });
        paquete.save((err, paquete) => {
                chai.request('http://localhost:3000')
                .put('/api/paquetesDieta/'+paquete._id)
                .send({
                    nombre: "Almuerzo light editado",
                    descripcion: "Muy nutritivo y saludable",
                    precio: '5,00',
                    foto: 'http://res.cloudinary.com/dsqpicprf/image/upload/v1501298098/ztepspx7rqjkzvnj63gn.jpg'
                })
                .end((err, res) => {
                  res.should.have.status(204);
                  done();

        });
      });
    });
    it('No el ingresa el nombre de un paquete de dieta', function(done){
        var paquete = new PaqueteDieta({
            nombre: "Almuerzo light",
            descripcion: "Muy nutritivo",
            precio: '5,50',
            foto: 'http://res.cloudinary.com/dsqpicprf/image/upload/v1501298098/ztepspx7rqjkzvnj63gn.jpg'
        });
        paquete.save((err, paquete) => {
                chai.request('http://localhost:3000')
                .put('/api/paquetesDieta/'+paquete._id)
                .send({
                    nombre: "",
                    descripcion: "Muy nutritivo y saludable",
                    precio: '5,00',
                    foto: 'http://res.cloudinary.com/dsqpicprf/image/upload/v1501298098/ztepspx7rqjkzvnj63gn.jpg'
                })
                .end((err, res) => {
                  res.should.have.status(500);
                  done();

        });
      });
    });
    it('No el ingresa la descripcion de un paquete de dieta', function(done){
        var paquete = new PaqueteDieta({
            nombre: "Almuerzo light",
            descripcion: "Muy nutritivo",
            precio: '5,50',
            foto: 'http://res.cloudinary.com/dsqpicprf/image/upload/v1501298098/ztepspx7rqjkzvnj63gn.jpg'
        });
        paquete.save((err, paquete) => {
                chai.request('http://localhost:3000')
                .put('/api/paquetesDieta/'+paquete._id)
                .send({
                    nombre: "Almuerzo light editado",
                    descripcion: "",
                    precio: '5,00',
                    foto: 'http://res.cloudinary.com/dsqpicprf/image/upload/v1501298098/ztepspx7rqjkzvnj63gn.jpg'
                })
                .end((err, res) => {
                  res.should.have.status(204);
                  done();

        });
      });
    });
    it('No el ingresa el precio de un paquete de dieta', function(done){
        var paquete = new PaqueteDieta({
            nombre: "Almuerzo light",
            descripcion: "Muy nutritivo",
            precio: '5,50',
            foto: 'http://res.cloudinary.com/dsqpicprf/image/upload/v1501298098/ztepspx7rqjkzvnj63gn.jpg'
        });
        paquete.save((err, paquete) => {
                chai.request('http://localhost:3000')
                .put('/api/paquetesDieta/'+paquete._id)
                .send({
                    nombre: "Almuerzo light editado",
                    descripcion: "Muy nutritivo y saludable",
                    precio: '',
                    foto: 'http://res.cloudinary.com/dsqpicprf/image/upload/v1501298098/ztepspx7rqjkzvnj63gn.jpg'
                })
                .end((err, res) => {
                  res.should.have.status(500);
                  done();

        });
      });
    });
  });
  describe('/DELETE PaqueteDieta', () => {
    beforeEach((done) => { //Before each test we empty the database
      PaqueteDieta.remove({}, (err) => {
         done();
      });
    });
  afterEach((done) => {
        PaqueteDieta.remove({}, (err) => {
          done();
        });
    });
    it('Debe eliminar el paquete de dieta', (done) => {
    var paquete = new PaqueteDieta({
            nombre: "Almuerzo light",
            descripcion: "Muy nutritivo",
            precio: '5,50',
            foto: 'http://res.cloudinary.com/dsqpicprf/image/upload/v1501298098/ztepspx7rqjkzvnj63gn.jpg'
        });
        paquete.save((err, paquete) => {
                chai.request('http://localhost:3000')
                .delete('/api/paquetesDieta/'+paquete._id)
                .end((err, res) => {
                  res.should.have.status(204);
                  done();

        });
      });
    });
   });
  describe('/GET PaqueteDieta', () => {
    beforeEach((done) => { //Before each test we empty the database
      PaqueteDieta.remove({}, (err) => {
         done();
      });
    });
  afterEach((done) => {
        PaqueteDieta.remove({}, (err) => {
          done();
        });
    });
    it('Debe obtener el paquete de dieta', (done) => {
    var paquete = new PaqueteDieta({
            nombre: "Almuerzo light",
            descripcion: "Muy nutritivo",
            precio: '5,50',
            foto: 'http://res.cloudinary.com/dsqpicprf/image/upload/v1501298098/ztepspx7rqjkzvnj63gn.jpg'
        });
        paquete.save((err, paquete) => {
                chai.request('http://localhost:3000')
                .get('/api/paquetesDieta/'+paquete._id)
                .end((err, res) => {
                  res.should.have.status(200);
                  done();

        });
      });
    });
    it('No encuentra un paquete de dieta con un determinado ID', (done) => {
        chai.request('http://localhost:3000')
                .get('/api/paquetesDieta/'+'5928bafb9fa058092098ae88')
                .end((err, res) => {
                  res.should.have.status(404);
                  done();
      });
    });
   });