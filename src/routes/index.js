const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const Usuario = require('./../models/usuario')
const Curso = require('./../models/curso')
const Inscrito = require('./../models/inscrito')
const dirViews = path.join(__dirname, '../../template/views')
const dirPartials = path.join(__dirname, '../../template/partials')
const bcrypt = require('bcrypt');
const multer = require('multer')
const sgMail = require('@sendgrid/mail')
require('./../helpers/helpers')
require('./../config/config')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

app.set('view engine', 'hbs')
app.set('views', dirViews)
hbs.registerPartials(dirPartials)

/* var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/uploads')
	},
	filename: function (req, file, cb) {
		cb(null, 'avatar' + req.body.documento + path.extname(file.originalname))
	}
}) */

var upload = multer({
	limits: {
		fileSize: 10000000
	},
	fileFilter(req, file, cb) {

		// You can always pass an error if something goes wrong:
		if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){		
			return cb(new Error('Formato no válido'))
		}

		// To accept the file pass `true`, like so:
		cb(null, true)


	}
})

app.get('/', (req, res) => {
	res.render('index', {
		titulo: 'Inicio',
	})
});

app.get('/registro', (req, res) => {
	res.render('registro', {
		titulo: 'Registro'
	})
})

app.get('/crearCurso', (req, res) => {
	res.render('crearCurso', {
		titulo: 'Crear curso'
	})
})

app.post('/cambiar-nota', (req,res) => {
	Inscrito.findOneAndUpdate({$and: [{documento : req.body.documento}, {idCurso: req.body.idCurso}]}, {notaFinal: req.body.nota}, {new: true}, (err, resultado)=>{
		if(err){
			return console.log(err)
		}

		if(!resultado){
			res.render('actualizado',{
				titulo: 'Error',
				mensaje: 'No existe usuario con el documento ingresado',
				nombre: '.'
			})
		}
		else {
			Inscrito.find({idCurso: req.body.idCurso}, (err, resultado) => {
				if (err) {
					return console.log(err)
				}
				Usuario.find({}, (err, resultado2) => {
					if (err) {
						return console.log(err)
					}
					res.render('curso-seleccionado',{
						inscritos: resultado,
						usuarios: resultado2
					})
				})
			})
		}
	})
})

app.post('/crearCurso', (req, res ) => {

 let modalidadR
 if (req.body.modalidad_curso == 'elegir'){
	 modalidadR = 'No especificado'
 }
 else modalidadR = req.body.modalidad_curso;

	let curso = new Curso ({
		nombre : req.body.nombre,
		id : req.body.id,
		descripcion : req.body.descripcion,
		valor : req.body.valor,
		intensidad : req.body.intensidad,
		modalidad : modalidadR
	})

	curso.save((err, resultado) => {
		if (err) {
			return res.render('indexpost', {
				mostrar: err
			})
		}
		res.render('indexpost', {
			mostrar: "Se ha creado exitosamente"
		})
	})
});

app.get('/cursos', (req, res) => {
	if (req.session.tipo != 'coordinador') {
		Curso.find({ estado: 'disponibles' }, (err, respuesta) => {
			if (err) {
				return console.log(err)
			}
			res.render('cursos', {
				titulo: 'Cursos disponibles',
				listado: respuesta
			})
		})
	}
})

app.get('/inscribir', (req, res) => {
	let doc = req.session.usuario;
	Curso.find({ estado: 'disponibles' }, (err, respuesta) => {
		if (err) {
			return console.log(err)
		}
		res.render('inscribir', {
			titulo: 'Inscripción',
			listado: respuesta,
			documento: doc
		})
	})
})

app.post('/inscribir', (req, res) => {
	let curso1;
	if (req.body.curso == "") {
		return res.redirect('/inscribir')
	}
	else {
		Curso.findOne({ id: Number(req.body.curso) }, (err, resultados) => {
			if (err) {
				return console.log(err)
			}
			curso1 = resultados.nombre;
			let inscrito = new Inscrito({
				idCurso: req.body.curso,
				nombreCurso: curso1,
				documento: req.session.usuario
			});
			inscrito.save((err, resultado) => {
				if (err) {
					if (err.name == 'ValidationError') {
						return res.render('indexpost', {
							mostrar: "Ya tienes inscrtio este curso"
						})
					}
					else {
						return res.render('indexpost', {
							mostrar: err
						})
					}
				}
				res.render('indexpost', {
					mostrar: "Te has registrado exitosamente"
				})
			})
		});
	}
});

app.post('/registro', upload.single('imagen-perfil'), (req, res) => {

	let usuario = new Usuario({
		nombre: req.body.nombre,
		correo: req.body.correo,
		telefono: req.body.telefono,
		documento: req.body.documento,
		password: bcrypt.hashSync(req.body.password, 10),
		tipo: 'aspirante',
		avatar: req.file.buffer
	})

	const msg = {
		to: req.body.correo,
		from: 'jsninoc@unal.edu.co',
		subject: 'Bienvenido',
		text: 'Te has inscrito correctamente en la página.'
	}

	usuario.save((err, resultado) => {
		if (err) {
			return res.render('indexpost', {
				mostrar: err
			})
		}
		sgMail.send(msg).catch(err => console.log(err))
		res.render('indexpost', {
			mostrar: "<h3 class='tituloUsuarios text-center'> Se ha registrado exitosamente <h3> <p class='text-center'> Por favor revisar el correo con el cual se inscribió, también su spam, para el mensaje de bienvenida"
		})
	})
});

app.post('/curso-seleccionado', (req, res ) => {
	Inscrito.find({idCurso: req.body.id}, (err, resultado) => {
		if (err) {
			return console.log(err)
		}
		Usuario.find({}, (err, resultado2) => {
			if (err) {
				return console.log(err)
			}
			res.render('curso-seleccionado',{
				titulo: req.body.nombre,
				inscritos: resultado,
				usuarios: resultado2
			})
		})
	})
});

app.post('/ingresar', (req, res) => {
	Usuario.findOne({ documento: req.body.documento }, (err, resultados) => {
		if (err) {
			return console.log(err)
		}
		if (!resultados) {
			return res.render('ingresar', {
				mensaje: "Usuario no encontrado"
			})
		}
		if (!bcrypt.compareSync(req.body.password, resultados.password)) {
			return res.render('ingresar', {
				mensaje: "Contraseña no es correcta"
			})
		}
		//Para crear las variables de sesión
		req.session.usuario = resultados.documento
		req.session.nombre = resultados.nombre
		req.session.tipo = resultados.tipo
		avatar = resultados.avatar.toString('base64')
		req.session.avatar = avatar

		res.render('ingresar', {
			mensaje: "Bienvenido " + resultados.nombre,
			nombre: resultados.nombre,
			sesion: true,
			tipo: resultados.tipo,
			avatar: avatar
		})
	})
})

app.get('/miscursos', (req, res) => {
	Inscrito.find({ documento: req.session.usuario }, (err, resultado) => {
		if (err) {
			return console.log(err)
		}

		if (!resultado) {
			return console.log('No tiene cursos inscritos')
		}

		res.render('miscursos', {
			titulo: 'Mis cursos',
			listado: resultado
		})
	})
})

app.post('/miscursos', (req, res) => {
	Inscrito.findOneAndDelete({ $and: [{ documento: req.session.usuario }, { idCurso: req.body.idCurso }] }, req.body, (err, resultado) => {
		if (err) {
			return console.log(err)
		}

		Inscrito.find({ documento: req.session.usuario }, (err, resultado) => {
			if (err) {
				return console.log(err)
			}

			if (!resultado) {
				return console.log('No tiene cursos inscritos')
			}

			res.render('miscursos', {
				titulo: 'Mis cursos',
				listado: resultado
			})
		})
	})
})

app.get('/listaUsuarios', (req, res) => {
	Usuario.find({}, (err, resultado) => {
		if (err) {
			return console.log(err)
		}

		res.render('listaUsuarios', {
			titulo: 'Lista de usuarios',
			listado: resultado
		})
	})
})

app.get('/cursos-disponibles', (req, res) => {
	Curso.find({ estado: 'disponibles' }, (err, resultado) => {
		if (err) {
			return console.log(err)
		}
		Inscrito.find({}, (err2, resultado2) => {
			if (err2) {
				return console.log(err2)
			}
			Usuario.find({}, (err3, resultado3) => {
				if (err3) {
					return console.log(err3)
				}
				res.render('cursos-disponibles', {
					titulo: 'Cursos disponibles',
					cursos: resultado,
					inscritos: resultado2,
					usuarios: resultado3
				})
			})
		})
	})
})

app.post('/cursos-disponibles', (req, res) => {
	let vector = req.body.nombre.split(',');
	let doc = vector[0];
	let idC = Number(vector[1]);
	Inscrito.findOneAndDelete({ $and: [{ documento: doc }, { idCurso: idC }] }, req.body, (err, resultado) => {
		if (err) {
			return console.log(err)
		}
	})
	res.redirect('cursos-disponibles');
})

app.post('/actualizarEstado', (req, res) => {
	var valores = req.body.cerrar.split(",");
	doc = valores[0];
	nom = valores[1];
	id1 = Number(valores[2]);
	Curso.findOneAndUpdate({ id: id1 })
	Curso.findOneAndUpdate({ id: id1 }, { $set: { documentoDocente: doc, nombreDocente: nom, estado: "cerrado" } }, { new: true }, (err, resultado) => {
		if (err) {
			return console.log(err)
		}
		res.redirect("/cursos-disponibles")
	})
})

app.post('/actualizado', (req, res) => {
	Usuario.findOneAndUpdate({ documento: req.body.documento }, req.body, { new: true }, (err, resultado) => {
		if (err) {
			return console.log(err)
		}

		if (!resultado) {
			res.render('actualizado', {
				titulo: 'Error',
				mensaje: 'No existe usuario con el documento ingresado',
				nombre: '.'
			})
		}

		res.render('actualizado', {
			titulo: 'Usuario actualizado',
			mensaje: 'Se ha actualizado el usuario ',
			nombre: resultado.nombre
		})
	})
})

app.get('/cursos-docente', (req, res) => {

	Curso.find({ documentoDocente: req.session.usuario }, (err, resultado) => {
		if (err) {
			return console.log(err)
		}

		Inscrito.find({}, (err2, resultado2) => {
			if (err2) {
				return console.log(err2)
			}
			Usuario.find({}, (err3, resultado3) => {
				if (err3) {
					return console.log(err3)
				}
				res.render('cursos-docente', {
					titulo: 'Cursos docente',
					cursos: resultado,
					inscritos: resultado2,
					usuarios: resultado3
				})
			})
		})
	})


})

app.get('/chat', (req, res) => {
	res.render('chat')
})

app.get('/salida', (req, res) => {
	req.session.destroy((err) => {
		if (err) return console.log(err)
	})
	res.redirect('/')
})



app.get('*', (req, res) => {
	res.render('error', {
		titulo: "Error 404"
	})
});

module.exports = app
