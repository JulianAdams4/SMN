//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
var server = require('../server');
var mongoose = require("mongoose");
var Paciente = mongoose.model('Paciente');
var PlanNutricional = mongoose.model('PlanNutricional');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

describe('planNutricional', () => {
    beforeEach((done) => {
        PlanNutricional.remove({}, (err) => {
          done();
          });
        Paciente.remove({}, (err) => {
          done();
         });
    });
    afterEach((done) => {
        PlanNutricional.remove({}, (err) => {
          done();
          });
        Paciente.remove({}, (err) => {
          done();
         });
    });
});

var patId = '';
var planId = '';
describe('/POST planNutricional', () => {
  //EXISTE PACIENTE
  it('Debe guardar los planes nutricionales de un paciente y actualiza a vigente', (done) => {
    var paciente = new Paciente({
          cedula:		'1234567850',
          nombres: 	'Juan Enrique',
          apellidos: 'Ramirez Gonzalez',
          email: 'juan@user.com',
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
            var datosPlan = {
                idPaciente: patId,
                documento: "http://talentoti.gov.co/635/articles-14312_empresas.pdf"
            }
            chai.request('http://localhost:3000')
                .post('/api/planesNutricionales')
                .send(datosPlan)
                .end((err, res) => {
                  res.should.have.status(201);
                  res.body.should.have.property('idPaciente').eql(patId);
                  done();
            });
        });
  });

  //NO EXISTE PACIENTE
  it('No existe un paciente con ese id para el plan nutricional', (done) => {
    var datosPlan = {
      idPaciente: '5928bafb9fa058092098ae88',
      fechaDato: '2017-04-13',
      documento: "http://talentoti.gov.co/635/articles-14312_empresas.pdf"
    }
    chai.request('http://localhost:3000')
        .post('/api/planesNutricionalesPaciente/5928bafb9fa058092098ae88')
        .send(datosPlan)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
  });

  //NO INGRESA FECHA DATO
  it('No ingresa fecha de registro del Plan Nutricional', (done) => {
    var datosPlan = {
        idPaciente: patId,
        documento: "http://talentoti.gov.co/635/articles-14312_empresas.pdf"
    }
    chai.request('http://localhost:3000')
        .post('/api/planesNutricionales')
        .send(datosPlan)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
  });

  //NO INGRESA DOCUMENTO
  it('No ingresa documento del Plan Nutricional', (done) => {
    var datosPlan = {
        idPaciente: patId,
        fechaDato: '2017-04-13'
    }
    chai.request('http://localhost:3000')
        .post('/api/planesNutricionales')
        .send(datosPlan)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
  });
});

describe('/GET planNutricional', () => {
      it('Debe obtener los planes nutricionales de un paciente', function(done){
        chai.request('http://localhost:3000')
            .get('/api/planesNutricionalesPaciente/'+patId)
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('array');
              done();
            });
      });

      it('No debe retornar ningún plan nutricional ya que no existe el paciente', function(done){
        chai.request('http://localhost:3000')
            .get('/api/planesNutricionalesPaciente/5928bafb9fa058092098ae88')
            .end(function(err, res){
                res.should.have.status(404);
              done();
            });
      });
  });

describe('/PUT planNutricional vigente', () => {
      it('Edita el documento de un plan nutricional con un determinado ID', function(done){
        var datosPlan = new PlanNutricional({
                idPaciente: patId,
                fechaDato: '2017-04-13',
                documento: "http://talentoti.gov.co/635/articles-14312_empresas.pdf"
            });
        datosPlan.save((err, plan) => {
            chai.request('http://localhost:3000')
                .put('/api/planesNutricionales/'+plan._id)
                .send({ fechaDato: '2017-06-13',documento: "http://www.juntadeandalucia.es/empleo/recursos/material_didactico/especialidades/materialdidactico_econtabilidad_financiera/anexos/DOCUMENTOS%20MERCANTILES.pdf" })
                .end(function(err, res){
                  res.should.have.status(204);
                  done();
          });
        });
      });

/*
      it('No se ingresa el documento del plan nutricional al editar', function(done){
        var datosPlan = new PlanNutricional({
                idPaciente: patId,
                fechaDato: '2017-04-13',
                documento: "http://talentoti.gov.co/635/articles-14312_empresas.pdf"
            });
        datosPlan.save((err, plan) => {
            chai.request('http://localhost:3000')
                .put('/api/planesNutricionales/' + plan._id)
                .send({ fechaDato: '2017-06-13' , documento:""})
                .end(function(err, res){
                  res.should.have.status(500);
                  done();
          });
        });
      });
*/

      it('No se ingresa fecha del plan nutricional al editar', function(done){
        var datosPlan = new PlanNutricional({
                idPaciente: patId,
                fechaDato: '2017-04-13',
                documento: "http://talentoti.gov.co/635/articles-14312_empresas.pdf"
            });
        datosPlan.save((err, plan) => {
            chai.request('http://localhost:3000')
                .put('/api/planesNutricionales/' + plan._id)
                .send({ documento: "http://www.juntadeandalucia.es/empleo/recursos/material_didactico/especialidades/materialdidactico_econtabilidad_financiera/anexos/DOCUMENTOS%20MERCANTILES.pdf"})
                .end(function(err, res){
                  res.should.have.status(204);
                  done();
          });
        });
      });

      it('No actualiza a vigente porque ya lo es', function(done){
        var datosPlan = new PlanNutricional({
                idPaciente: patId,
                documento: "http://talentoti.gov.co/635/articles-14312_empresas.pdf"
            });
        datosPlan.save((err, plan) => {
            planId=""+plan._id;
            chai.request('http://localhost:3000')
                .put('/api/planesNutricionales/vigente/'+planId)
                .send({})
                .end(function(err, res){
                  res.should.have.status(500);
                  done();
                });
        });
      });
      it('No actualiza a vigente porque no encuentra el plan', function(done){
            planId="1";
            chai.request('http://localhost:3000')
                .put('/api/planesNutricionales/vigente/'+planId)
                .send({})
                .end(function(err, res){
                  res.should.have.status(500);
                  done();
                });
      });
});
