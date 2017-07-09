var mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var Schema = mongoose.Schema;
var planNutricionalSchema = new Schema({
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
  documento:{
    type:String,
    required: '<i class="fa ti-alert"></i>El documento del plan es <b>obligatorio</b>'
  },
  vigente: {
    type: Boolean,
    default: true
  },
  borrado: {
    type: Boolean,
    default: false
  }
});
mongoose.model('PlanNutricional', planNutricionalSchema);
