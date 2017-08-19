var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pacienteSchema = new Schema({
  cedula: {
    type: String,
    unique: true,
    required: '<i class="ti-alert"></i>La cédula es <b>obligatoria</b>',
    maxlength: [10, '<i class="ti-alert"></i>Ingrese un número de cédula válido'],
    minlength: [10, '<i class="ti-alert"></i>Ingrese un número de cédula válido'],
    match: [/\d{10}/, '<i class="ti-alert"></i>Ingrese un número de cédula válido']//Sólo 10 DIGITOS
  },
  nombres:{
    type: String,
    required: '<i class="ti-alert"></i>Los nombres son <b>obligatorios</b>',
    validate: [{//SOLO NOMBRES DE 2 A 50 CARACTERES
      validator: function(value){
        return value.length >= 2 && value.length <= 50;
      },
      message: '<i class="fa ti-alert"></i>Ingrese unos nombres válidos1'
    }],
    match: [/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]*$/, '<i class="fa ti-alert"></i>Ingrese nombres válidos']//SOLO LETRAS
  },
  apellidos:{
    type: String,
    required: '<i class="ti-alert"></i>Los apellidos son <b>obligatorios</b>',
    validate: [{//SOLO APELLIDOS DE 2 A 50 CARACTERES
      validator: function(value){
        return value.length >= 2 && value.length <= 50;
      },
      message: '<i class="fa ti-alert"></i>Ingrese apellidos válidos'
    }],
    match: [/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]*$/, '<i class="fa ti-alert"></i>Ingrese apellidos válidos']//SOLO LETRAS
  },
  fechaNacimiento: {
    type: Date,
    required: '<i class="ti-alert"></i>La fecha de nacimiento es <b>obligatoria</b>'
  },
  sexo: {
    type: String,
    enum: ['Masculino','Femenino'],
    required: '<i class="ti-alert"></i>El sexo es <b>obligatorio</b>'
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: '<i class="ti-alert"></i>El correo electrónico es <b>obligatorio</b>',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, '<i class="fa ti-alert"></i>Ingrese un correo electrónico <b>válido</b>']
  },
  direccion: String,
  celular: {
    type: String,
    match: [/09+\d{8}/, '<i class="ti-alert"></i>Ingrese un número de celular válido']
  },
  ocupacion: String,
  motivoConsulta: {
    type: String,
    required: '<i class="ti-alert"></i>El motivo de consulta es <b>obligatorio</b>'
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
  },
  password: String
});

mongoose.model('Paciente', pacienteSchema);
