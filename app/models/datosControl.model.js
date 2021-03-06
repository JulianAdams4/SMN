var mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var Schema = mongoose.Schema;
var datosControlSchema = new Schema({
  //aqui van los campos
  idPaciente: {
    type: Schema.Types.ObjectId,
    ref: 'Paciente',
    required: 'El dato debe pertenecer a un paciente.',
  },
  fechaDato: {
    type: Date,
    default: Date.now
  },
  observaciones:{
    type:String
  },
  datos:[
    {
      nombreDato:{
        type: String,
        required: '<i class="ti-alert"></i>El nombre del dato es obligatorio <b>obligatorio</b>'
      },
      valorDato:{
        type: String,
        required: 'El valor es obligatorio'
      },
      unidadDato: {
        type: String,
        enum: ['%','mg/L','cm','kg'],
        required: '<i class="ti-alert"></i>La unidad del dato es obligatorio <b>obligatorio</b>'
      }
    }
  ],
  borrado: {
    type: Boolean,
    default: false
  },
  foto:{
    type:String,
    required: '<i class="fa ti-alert"></i>La foto del plan es <b>obligatoria</b>'
  }
});
mongoose.model('DatosControl', datosControlSchema);
