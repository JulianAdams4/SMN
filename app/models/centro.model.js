var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var centroSchema = new Schema({
  //aqui van los campos
  direccion: {
      type: String,
      required: 'La dirección es obligatoria.'
    },
  telefono: {
      type: String,
      required: 'EL teléfono es obligatorio.'
    },
  horariosAtencion: {
      type: String,
      required: 'Los horarios son obligatorios.'
    },
  servicios: String,
  nutricionista: {
    cedula:{
      type: String,
      required: 'La cédula es obligatoria.'
    },
    nombres:{
      type: String,
      required: 'Los nombres son obligatorios.'
    },
    apellidos: {
      type: String,
      required: 'Los apellidos son obligatorios.'
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: '<i class="fa ti-alert"></i>Ingrese el <b>correo electrónico</b>',
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, '<i class="fa ti-alert">Ingrese un correo electrónico válido']
    },
    password: {
      type: String,
      required: '<i class="fa ti-alert"></i>Ingrese la <b>contraseña</b>'
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
