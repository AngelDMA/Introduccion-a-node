const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const usuarioEsquema = new Schema({
	nombre : {
		type : String,
		required : true	,
		trim : true
	},
  correo : {
    type: String,
    required : true,
		unique : true
  },
  telefono : {
    type: String
  },
	password :{
		type : String,
		required : true
	},
	documento : {
		type: String,
		required : true,
		unique : true
	},
	tipo : {
    type : String,
    required : true,
    enum : {values: ['aspirante', 'coordinador', 'docente']}
	},
	avatar : {
		type: Buffer
	}
});

usuarioEsquema.plugin(uniqueValidator);

const Usuario = mongoose.model('Usuario', usuarioEsquema);

module.exports = Usuario
