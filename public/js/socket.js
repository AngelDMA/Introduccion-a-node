socket = io()

socket.on("mensaje", (informacion) => {
    console.log(informacion)
})

const formulario = document.querySelector('#form-cambiar-nota')
const notificacion = document.querySelector('#msj-not')

/* formulario.addEventListener('submit', (datos) => {
    const texto = datos.target.elements.nota.value
    socket.emit("texto", {
        mensaje: texto
    }, () => {
        notificacion.innerHTML = notificacion.innerHTML + texto + '<br>'
    })
}) */

socket.on("texto", (text) => {
    console.log(text)
    notificacion.innerHTML = notificacion.innerHTML + text.mensaje + '<br>'
})

const formChat = document.querySelector('#chat')
const mensaje = formChat.querySelector('#msj_chat')
const msj_enviado = document.querySelector('#msj_enviado')

formChat.addEventListener('submit', (datos) => {
    datos.preventDefault()
    const texto = datos.target.elements.msj_chat.value
    const nombre = datos.target.elements.nombre_usuario.value
    socket.emit("chat", {
        texto: texto,
        nombre: nombre
    },() => {
        mensaje.value = '';
        mensaje.focus()
    })
})

socket.on("chat", (text) => {
    msj_enviado.innerHTML = msj_enviado.innerHTML + '<span class="nombre-usuario">' + text.nombre + '</span>' + ': ' + text.texto +'<br>'
})