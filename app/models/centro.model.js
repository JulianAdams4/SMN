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
  horariosAtencion: String,
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