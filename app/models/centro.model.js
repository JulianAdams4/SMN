var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var centroSchema = new Schema({
  //aqui van los campos
  direccion: {
      type: String,
      required: '<i class="ti-alert"></i>La dirección es <b>obligatoria</b>.'
    },
  telefono: {
      type: String,
      required: '<i class="ti-alert"></i>El teléfono es <b>obligatorio</b>.',
      maxlength: [10, '<i class="ti-alert"></i>El teléfono debe tener como máximo 10 dígitos'],
      minlength: [7, '<i class="ti-alert"></i>El teléfono debe tener como mínimo 7 dígitos'],
    },
  horariosAtencion: {
      type: String,
      required: '<i class="ti-alert"></i>Los horarios son obligatorios.'
    },
  servicios: String,
  nutricionista: {
    cedula:{
      type: String,
      required: '<i class="ti-alert"></i>Ingrese un número de cédula <b>válido</b>',
      maxlength: [10, '<i class="ti-alert"></i>La cédula sólo debe tener 10 dígitos'],
      minlength: [10, '<i class="ti-alert"></i>La cédula sólo debe tener 10 dígitos'],
      match: [/\d{10}/, '<i class="ti-alert"></i>Ingrese un número de cédula válido']
    },
    nombres:{
      type: String,
      required: '<i class="ti-alert"></i>Los nombres son <b>obligatorios</b>.'
    },
    apellidos: {
      type: String,
      required: '<i class="ti-alert"></i>Los apellidos son <b>obligatorios</b>.'
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: '<i class="ti-alert"></i>Ingrese el <b>correo electrónico</b>',
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, '<i class="ti-alert"></i>Ingrese un correo electrónico válido</i>']
    },
    password: {
      type: String,
      required: '<i class="ti-alert"></i>La contraseña debe tener como mínimo <b>8 dígitos</b>.'
    },
    estudios: String,
    especializaciones: String,
    telefono: String,
  },
  redesSociales: [
      {
        nombre: {
          type: String,
          enum: ['Facebook','Twitter','Instagram']
        },
        link: String,
      }
  ],
  borrado: {
    type: Boolean,
    default: false
  },
});
mongoose.model('Centro', centroSchema);
