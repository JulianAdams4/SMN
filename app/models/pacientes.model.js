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
    type: Date,
    required: 'La fecha de nacimiento son obligatorios'
  },
  sexo: {
    type: String,
    enum: ['Masculino','Femenino'],
    required: 'El sexo es obligatorio'
  },
  direccion: String,
  celular: String,
  ocupacion: String,
  motivoConsulta: {
    type: String,
    required: 'El motivo de consulta es obligatorio'
  },
  fechaIngreso: {
    type: Date,
    default: Date.now
  },
  borrado: {
    type: Boolean,
    default: false
  }
});

mongoose.model('Paciente', pacienteSchema);
