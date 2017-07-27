var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var citaSchema = new Schema({
  creado: {
    type: Date,
    default: new Date
  },
  title: {
    type: String
  },
  descripcion: {
    type: String
  },
  start: {
    type: Date,
    validate: [
      function(start){
        return start > new Date;
      },
      'La fecha y hora deben ser mayor a la actual'
    ]
  },
  end: {
    type: Date
  },
  duracion: {
    type: Number,
    required: 'Ingrese la duración'
  },
  stick: {
    type: Boolean,
    default: true
  },
  estaOcupado: {
    type: Boolean,
    defautl: false
  },
  backgroundColor: {
    type: String
  },
  paciente: {
    type: Schema.ObjectId
  }
});

citaSchema.pre('save', function(next){

  if(this.estaOcupado){
    this.backgroundColor = '#666';
    this.title = 'Ocupado';
  } else {
    this.backgroundColor = '#449a2e';
    this.title = 'Disponible'
  }

  this.end = moment(this.start).add(this.duracion, 'm');

  next();

});

mongoose.model('Cita', citaSchema);
