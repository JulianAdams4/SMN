var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pacienteSchema = new Schema({
  cedula: {
    type: String,
    unique: true,
    required: 'La cédula es obligatoria'
  },
  nombres:{
    type: String,
    required: 'Los nombres son obligatorios'
  },
  apellidos:{
    type: String,
    required: 'Los apellidos son obligatorios'
  },
  fechaNacimiento: {
    type: Date
  },
  sexo: {
    type: String,
    enum: ['Masculino','Femenino']
  },
  direccion: String,
  celular: String,
  ocupacion: String,
  motivoConsulta: String,
  fechaIngreso: {
    type: Date,
    default: Date.now
  },
});

mongoose.model('Paciente', pacienteSchema);
