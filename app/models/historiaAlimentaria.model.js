var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var historiaAlimentariaSchema = new Schema({
  idPaciente: {
    type: Schema.Types.ObjectId,
    ref: 'Paciente',
    required: 'El dato debe pertenecer a un paciente.'
  },
  borrado: {
    type: Boolean,
    default: false
  },
  comidasAlDia: Number,
  preparadoPor: String,
  modificaFinesDeSemana: Boolean,
  comidaFinesdeSemana: String,
  comeEntreComidas: Boolean,
  snacksEntreComidas: String,
  queCome: String,
  aguaAlDia: Number,
  cafeAlDia: Number,
  cigarrosAlDia: Number,
  alcoholALaSemana: Number,
  grupoAlimentos:[
    {
      descripcion: String,
      frecuencia: String,
      alimentosAgradan: String,
      alimentosDesagradan: String
    }
  ]
});

mongoose.model('HistoriaAlimentaria', historiaAlimentariaSchema);
