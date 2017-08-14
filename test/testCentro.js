//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
var server = require('../server');
var mongoose = require("mongoose");
var Centro = mongoose.model('Centro');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);
centroId = ''

describe('Centro', () => {
describe('/POST Centro', () => {
  beforeEach((done) => { //Before each test we empty the database
    Centro.remove({}, (err) => {
       done();
    });
  });
  it('Debe guardar los datos de centro', (done) => {
    var centro = {
            direccion: "Direccion prueba",
            telefono: "0912345578",
            horariosAtencion:"08:00-15:00",
            nutricionista: {
    			    cedula:'1721989364',
    			    nombres:'Angie',
    			    apellidos: 'Del Pezo',
              email: 'evelynbenitez263@gmail.com'
    			  },
        };
        chai.request('http://localhost:3000')
                .post('/api/centro')
                .send(centro)
                .end((err, res) => {
                  res.should.have.status(201);
                  done();
        });
  });
  it('No ingresa la direccion datos de centro', (done) => {
    var centro = {
            telefono: "0912345578",
            nutricionista: {
              cedula:'1721989364',
              nombres:'Angie',
              apellidos: 'Del Pezo',
              email: 'evelynbenitez263@gmail.com'
            },
        };
        chai.request('http://localhost:3000')
                .post('/api/centro')
                .send(centro)
                .end((err, res) => {
                  res.should.have.status(500);
                  done();
        });
  });
  it('No ingresa el telefono datos de centro', (done) => {
    var centro = {
            direccion: "Direccion prueba",
            nutricionista: {
              cedula:'1721989364',
              nombres:'Angie',
              apellidos: 'Del Pezo',
            },
        };
        chai.request('http://localhost:3000')
                .post('/api/centro')
                .send(centro)
                .end((err, res) => {
                  res.should.have.status(500);
                  done();
        });
  });
  it('No ingresa los nombres de la nutricionista a cargo del centro', (done) => {
    var centro = {
            direccion: "Direccion prueba",
            telefono: "0912345578",
            nutricionista: {
              cedula:'1721989364',
              apellidos: 'Del Pezo',
            },
        };
        chai.request('http://localhost:3000')
                .post('/api/centro')
                .send(centro)
                .end((err, res) => {
                  res.should.have.status(500);
                  done();
        });
  });
  it('No ingresa la cedula de la nutricionista a cargo del centro', (done) => {
    var centro = {
            direccion: "Direccion prueba",
            telefono: "0912345578",
            nutricionista: {
              nombres:'Angie',
              apellidos: 'Del Pezo',
            },
        };
        chai.request('http://localhost:3000')
                .post('/api/centro')
                .send(centro)
                .end((err, res) => {
                  res.should.have.status(500);
                  done();
        });
  });
  it('No ingresa los apellidos de la nutricionista a cargo del centro', (done) => {
    var centro = {
            direccion: "Direccion prueba",
            telefono: "0912345578",
            nutricionista: {
              cedula:'1721989364',
              nombres:'Angie',
            },
        };
        chai.request('http://localhost:3000')
                .post('/api/centro')
                .send(centro)
                .end((err, res) => {
                  res.should.have.status(500);
                  done();
        });
  });
});

  describe('/PUT Centro', () => {
    beforeEach((done) => { //Before each test we empty the database
    Centro.remove({}, (err) => {
       done();
    });
  });
    it('Actualiza los datos de un centro', function(done){
        var centro = new Centro({
            direccion: "Direccion prueba2",
            telefono: "0912345578",
            horariosAtencion:"08:00-15:00",
            nutricionista: {
              cedula:'1721989364',
              nombres:'Angie',
              apellidos: 'Del Pezo',
              email: 'evelynbenitez263@gmail.com'
            },
        });
        centro.save((err, centro) => {
                chai.request('http://localhost:3000')
                .put('/api/centro/'+centro._id)
                .send({ telefono: '0900000001' })
                .end((err, res) => {
                  res.should.have.status(200);
                  done();

        });
      });
    });
    it('No ingresa la direccion de un centro', function(done){
        var centro = new Centro({
            direccion: "Direccion prueba2",
            telefono: "0912345578",
            horariosAtencion:"08:00-15:00",
            nutricionista: {
              cedula:'1721989364',
              nombres:'Angie',
              apellidos: 'Del Pezo',
              email: 'evelynbenitez263@gmail.com'
            },
        });
        centro.save((err, centro) => {
                chai.request('http://localhost:3000')
                .put('/api/centro/'+centro._id)
                .send({
                    direccion: "",
                    telefono: "0912345578",
                    nutricionista: {
                      cedula:'1721989364',
                      nombres:'Angie',
                      apellidos: 'Del Pezo',
                    },
                })
                .end((err, res) => {
                  res.should.have.status(500);
                  done();

        });
      });
    });
  });
describe('/GET Centro', () => {
    beforeEach((done) => { //Before each test we empty the database
    Centro.remove({}, (err) => {
       done();
    });
  });
  it('Actualiza los datos de un centro', function(done){
        var centro = new Centro({
            direccion: "Direccion prueba2",
            telefono: "0912345578",
            horariosAtencion:"08:00-15:00",
            nutricionista: {
              cedula:'1721989364',
              nombres:'Angie',
              apellidos: 'Del Pezo',
              email: 'evelynbenitez263@gmail.com'
            },
        });
        centro.save((err, centro) => {
                chai.request('http://localhost:3000')
                .get('/api/centro/'+centro._id)
                .end((err, res) => {
                  res.should.have.status(200);
                  done();

        });
      });
  });
  it('No encuentra un centro con un determinado ID', function(done){
        chai.request('http://localhost:3000')
                .get('/api/centro/'+'5928bafb9fa058092098ae88')
                .end((err, res) => {
                  res.should.have.status(404);
                  done();

        });
  });
});
});
