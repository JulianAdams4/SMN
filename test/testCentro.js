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
  beforeEach((done) => { //Before each test we empty the database
    Centro.remove({}, (err) => {
       done();
    });
  });
describe('/POST Centro', () => {
  //EXISTE PACIENTE
  it('Debe guardar los datos de centro', (done) => {
    var centro = {
            direccion: "Direccion prueba",
            telefono: "0912345578",
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
                  res.should.have.status(201);
                  done();
        });
  });
});

describe('/PUT /centro/:centroId', () => {
    it('Actualiza los datos de un centro', function(done){
        var centro = new Centro({
            direccion: "Direccion prueba2",
            telefono: "0912345578",
            nutricionista: {
          cedula:'1721989364',
          nombres:'Angie',
          apellidos: 'Del Pezo',
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
});
});
