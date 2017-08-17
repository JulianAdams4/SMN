var mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var Schema = mongoose.Schema;
var paqueteSchema = new Schema({
  //aqui van los campos
  nombre:{
    type:String,
     required: '<i class="ti-alert"></i>El nombre es <b>obligatorio</b>'
  },
  descripcion:{
    type:String,
  },
  precio:{
    type:String,
    required: '<i class="ti-alert"></i>El precio es <b>obligatorio</b>'
  },
  borrado: {
    type: Boolean,
    default: false
  },
  foto:{
    type:String,
    required: '<i class="fa ti-alert"></i>La foto del paquete es <b>obligatoria</b>'
  }
});
mongoose.model('PaqueteDieta', paqueteSchema);
