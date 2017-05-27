//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var Paciente = require('../app/models/pacientes.model');

// Dependencies for testing
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();
var patId = '59299b123b172a1654995878';

chai.use(chaiHttp);

describe('/PUT /paciente/:idPaciente', () => {
    it('Actualiza los datos de un paciente con un determinado ID', function(done){
        chai.request('http://localhost:3000')
            .put('/api/pacientes/'+patId)
            .send({ cedula: '0900000001' })
            .end(function(err, res){
     			res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_id').eql(patId);
              	done();
            });
    });
});