var mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
var datosControlSchema = new Schema({
  //aqui van los campos
  idPaciente: {
    type: Schema.Types.ObjectId,
    ref: 'Paciente',
    required: true
  },
  fechaDato: {
    type: Date,
    default: Date.now
  },
  observaciones:{
    type:String,
  },
  datos:[
    {
      nombreDato:{
        type: String,
        required: 'El nombre del dato es obligatorio.'
      },
      valorDato:{
        type: SchemaTypes.Double,
        required: 'El valor es obligatorio'
      },
      unidadDato: {
        type: String,
        enum: ['%','mg/L','cm','lbs']
      }
    }
  ]
});
mongoose.model('DatosControl', datosControlSchema);

