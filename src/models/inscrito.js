const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const inscritoEsquema = new Schema({
	idCurso : {
		type : Number,
		required : true	,
	},
  nombreCurso : {
    type: String,
    required : true,
    trim : true
  },
  documento : {
    type: String,
    required : true
  }
});

inscritoEsquema.index({idCurso: 1, documento: 1}, {unique: true});

inscritoEsquema.plugin(uniqueValidator);

const Inscrito = mongoose.model('Inscrito', inscritoEsquema);

module.exports = Inscrito
