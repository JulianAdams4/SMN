var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var antecedenteSchema = new Schema({
  idPaciente: {
    type: Schema.Types.ObjectId,
    ref: 'Paciente',
    required: true
  },
  alteracionApetito: Boolean,
  nausea: Boolean,
  vomito: Boolean,
  estrenimiento: Boolean,
  diarrea: Boolean,
  flatulencia: Boolean,
  acidez: Boolean,
  gastritis: Boolean,
  problemasMasticacion: Boolean,
  cambioSaborComidas: Boolean,
  alergia: Boolean,
  suplementoVitaminicos: Boolean,
  medicamento: Boolean,
  ojos: Boolean,
  cabello: Boolean,
  uñas: Boolean,
  piel: Boolean
});

mongoose.model('Antecedentes', antecedenteSchema);
