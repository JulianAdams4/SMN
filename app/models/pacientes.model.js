var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pacienteSchema = new Schema({
  cedula: {
    type: String,
    unique: true,
    required: '<i class="fa ti-alert"></i>La cédula es <b>obligatoria</b>'
  },
  nombres:{
    type: String,
    required: '<i class="fa ti-alert"></i>Los nombres son <b>obligatorios</b>'
  },
  apellidos:{
    type: String,
    required: '<i class="fa ti-alert"></i>Los apellidos son <b>obligatorios</b>'
  },
  fechaNacimiento: {
    type: Date,
    required: '<i class="fa ti-alert"></i>La fecha de nacimiento es <b>obligatoria</b>'
  },
  sexo: {
    type: String,
    enum: ['Masculino','Femenino'],
    required: '<i class="fa ti-alert"></i>El campo sexo es <b>obligatorio</b>'
  },
  direccion: String,
  celular: String,
  ocupacion: String,
  motivoConsulta: {
    type: String,
    required: '<i class="fa ti-alert"></i>El motivo de consulta es <b>obligatorio</b>'
  },
  fechaIngreso: {
    type: Date,
    default: Date.now
  },
  ejercicios:String,
  frecuenciaEjecicios:String,
  borrado: {
    type: Boolean,
    default: false
  }
});

mongoose.model('Paciente', pacienteSchema);
