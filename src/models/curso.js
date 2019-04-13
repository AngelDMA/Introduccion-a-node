const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const cursoEsquema = new Schema({
	nombre : {
		type : String,
		required : true	,
		trim : true
	},
  id : {
    type: Number,
    required : true,
		unique: true
  },
	descripcion: {
		type: String,
		required : true
	},
  valor : {
    type: Number,
		required : true,
  },
	modalidad :{
		type : String,
		default: 'No especificado'
	},
	intensidad : {
		type: Number,
	},
	estado : {
    type : String,
    default: 'disponibles'
  },
	nombreDocente : {
		type : String,
		trim : true,
		default : null
	},
	documentoDocente : {
		type : String,
		default : null
	}
});

cursoEsquema.plugin(uniqueValidator);

const Curso = mongoose.model('Curso', cursoEsquema);

module.exports = Curso
