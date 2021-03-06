var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var antecedenteSchema = new Schema({
  idPaciente: {
    type: Schema.Types.ObjectId,
    ref: 'Paciente',
    required: true
  },
  borrado: {
    type: Boolean,
    default: false
  },
  alteracionApetito: {
    type: Boolean,
    default: false
  },
  nausea: {
    type: Boolean,
    default: false
  },
  vomito: {
    type: Boolean,
    default: false
  },
  estrenimiento: {
    type: Boolean,
    default: false
  },
  diarrea: {
    type: Boolean,
    default: false
  },
  flatulencia: {
    type: Boolean,
    default: false
  },
  acidez: {
    type: Boolean,
    default: false
  },
  gastritis: {
    type: Boolean,
    default: false
  },
  problemasMasticacion: {
    type: Boolean,
    default: false
  },
  cambioSaborComidas: {
    type: Boolean,
    default: false
  },
  alergia: {
    type: Boolean,
    default: false
  },
  descripcionAlergias: String,
  suplementoVitaminicos: {
    type: Boolean,
    default: false
  },
  descripcionSuplementos: String,
  medicamento: {
    type: Boolean,
    default: false
  },
  descripcionMedicamentos: String,
  ojos: {
    type: Boolean,
    default: false
  },
  cabello: {
    type: Boolean,
    default: false
  },
  unias: {
    type: Boolean,
    default: false
  },
  piel: {
    type: Boolean,
    default: false
  },
  antecedentesPersonales: String,
  antecedentesFamiliares: String,
  observaciones: String
});

mongoose.model('Antecedentes', antecedenteSchema);
