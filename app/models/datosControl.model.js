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
      fechaDato: {
        type: Date,
        default: Date.now
      },
      unidadDato: {
        type: String,
        enum: ['%','mg/L','cm']
      }
    }
  ]
});
mongoose.model('DatosControl', datosControlSchema);
