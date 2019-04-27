const hbs = require('hbs');

hbs.registerHelper('if_eq', function(a, b, opts) {
    if (a == b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

hbs.registerHelper('listarInscripcion', (listado, documento) => {
  let texto = `<div class="container">
      <h2 class="text-center">Inscripción de materias</h2>
      <form action="/inscribir" method="post">
          <div class="row">
              <div class="col">
                  <input type="text" class="form-control" placeholder=${documento} name="documento" disabled>
              </div>
              <div class="col">
                <select name="curso" id="" class="form-control">`;
  listado.forEach(curso => {
    texto = texto +
        `<option value="${curso.id}">${curso.nombre}</option>`;
  })

  texto = texto +
      `</select>
       </div>
       </div>
       <div class="text-center">
           <button class="btn btn-primary">Inscribir curso</button>
       </div>
       </form>`;
  return texto;
})

hbs.registerHelper('listar', (listado) => {
let texto = `<table class='table table-striped table-hover'>
				<thead class='thead-dark'>
				<th>Nombre</th>
				<th>Descripción</th>
				<th>Valor</th>
				</thead>
				<tbody>`;
	listado.forEach(curso =>{
		texto = texto +
				`<tr>
				<td> ${curso.nombre} </td>
				<td> ${curso.descripcion} </td>
				<td> ${curso.valor}</td>
				</tr> `;
	})
	texto = texto + `</tbody> </table>`;
	return texto;

});

hbs.registerHelper('listar2', (listado) => {
    let texto = '<div class="accordion" id="accordionExample">';
    i = 1;
    listado.forEach(curso => {
        texto = texto +
               `<div class="card">
                <div class="card-header" id="heading${i}">
                <h2 class="mb-0">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                    ${curso.nombre}
                    </button>
                </h2>
                </div>

                <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                <div class="card-body">
                    id: ${curso.id} <br>
                    descripcion: ${curso.descripcion} <br>
                    valor: ${curso.valor} <br>
                    modalidad: ${curso.modalidad} <br>
                    intensidad: ${curso.intensidad} <br>

                </div>
                </div>`;
                i=i+1;
    });

    texto = texto + '</div>';

    return texto;
});

hbs.registerHelper('listarUsuarios', (listado) => {
    let texto = '<div class="container"> <div class="accordion" id="accordionExample">';
    i = 1;
    listado.forEach(usuario => {
        texto = texto +
               `<div class="card">
                    <div class="card-header" id="heading${i}">
                        <h2 class="mb-0">
                            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                            ${usuario.nombre}
                            </button>
                        </h2>
                    </div>

                    <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                        <div class="card-body">
                            <form action="/actualizado" method="post">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item">
                                        <label>Nombre</label>
                                        <input type="text" class="form-control" name="nombre" value="${usuario.nombre}">
                                    </li>
                                    <li class="list-group-item">
                                        <label>Correo</label>
                                        <input type="text" class="form-control" name="correo" value="${usuario.correo}">
                                    </li>
                                    <li class="list-group-item">
                                        <label>Telefono</label>
                                        <input type="text" class="form-control" name="telefono" value="${usuario.telefono}">
                                    </li>
                                    <li class="list-group-item">
                                        <label>Documento</label>
                                        <input type="text" class="form-control" name="documento" value="${usuario.documento}" readonly="readonly">
                                    </li>
                                    <li class="list-group-item">
                                        <label>Tipo</label>
                                        <input type="text" class="form-control" name="tipo" value="${usuario.tipo}">
                                    </li>
                                    <button class="btn btn-outline-primary">Actualizar</button>
                                </ul>
                            </form>
                        </div>
                    </div>
                </div>`;
                i=i+1;
    });

    texto = texto + '</div> </div>';

    return texto;
})

hbs.registerHelper('listarCursos', (cursos, inscritos, usuarios) => {
  let texto = '<div class="accordion" id="accordionExample">';
  i = 1;
  cursos.forEach(curso => {
      texto = texto +
             `<div class="card">
                <div class="card-header" id="heading${i}">
                    <h2 class="mb-0">
                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                        ${curso.nombre}
                        </button>
                    </h2>
                </div>

              <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
              <div class="card-body">`

              var filtro1 = usuarios.filter(usuario => usuario.tipo == 'docente');
              if (!filtro1){
                texto = texto + '<title>No hay docentes para asignar</title>'
              }
              else {
                texto = texto +
                      `<div class="col">
                        Seleccione docente
                      </div>
                      <form action=/actualizarEstado method="post">
                      <div class="col">
                        <select name="cerrar" id="" class="form-control">`;
                          filtro1.forEach(filtro => {
                            let value = filtro.documento + "," + filtro.nombre + "," + curso.id
                            texto = texto +
                            `<option value="${value}">${filtro.nombre}</option>`;
                          })

                texto = texto +
                    `</select>
                    </div>
                    <div class="text-center">
                        <button class="btn btn-primary">Cerrar curso</button>
                    </div>
                    </form>
                    <br>`;
              }
      texto = texto +
              `<form action="/cursos-disponibles" method="post">
              		<table class='table table-striped table-hover'>
              				<thead class='thead-dark'>
              				<th>Nombre</th>
              				<th>Documento</th>
              				<th>Correo</th>
              				<th></th>
              				</thead>
              				<tbody>`;

              var filtro = inscritos.filter(inscrito => inscrito.idCurso == curso.id);
              filtro.forEach(inscrito => {
                let estudiante = usuarios.find(usuario => usuario.documento == inscrito.documento)
                let valor = estudiante.documento + ',' + String(curso.id);
                texto = texto +
                `<tr>
        				<td> ${estudiante.nombre} </td>
        				<td> ${estudiante.documento} </td>
        				<td> ${estudiante.correo}</td>
        				<td><button class="btn btn-danger" name="nombre" value="${valor}">Eliminar</button></td>

        				</tr>`
              })
              texto = texto + `</tbody> </table></form>
              </div>
              </div>`;
              i=i+1;
  });

  texto = texto + '</div> </div> </div>';

  return texto;
})

hbs.registerHelper('cambiarNotaEstudiantes', (inscritos, usuarios) => {
  let texto =
  `<div class="container">
  <h5 class="text-center tituloUsuarios">Estudiantes Inscritos en el curso</h5>
  <form action="/cambiar-nota" method="post" id="form-cambiar-nota">
  <table class='table table-striped table-hover'>
      <thead class='thead-dark'>
      <th>Nombre</th>
      <th>Documento</th>
      <th>Correo</th>
      <th>Nota</th>
      <th></th>
      </thead>
      <tbody>`;

      inscritos.forEach(inscrito => {
      let estudiante = usuarios.find(usuario => usuario.documento == inscrito.documento)
      texto = texto +
      `<tr>
      <td> ${estudiante.nombre} </td>
      <td> ${estudiante.documento} </td>
      <td> ${estudiante.correo}</td>
      <td><input name="nota" id="nota" value="${inscrito.notaFinal}"><input name="documento" id="documento" value="${inscrito.documento}" type="hidden"></td>
      <td><button class="btn btn-danger" name="idCurso" id="idCurso" value="${inscrito.idCurso}">actualizar</button></td>
      </tr>`
  })
  texto = texto + `</tbody> </table></form></div>`
  return texto;
})

hbs.registerHelper('listarCursosInscritos', (listado) => {
    let texto = `<div class="container">
                <form action="/miscursos" method="post">
                <table class='table table-striped table-hover'>
				<thead class='thead-dark'>
                <th>Nombre del curso</th>
                <th></th>
				</thead>
				<tbody>`;
	listado.forEach(inscrito =>{
		texto = texto +
				`<tr>
                <td>${inscrito.nombreCurso} </td>
                <td><button class="btn btn-danger" name="idCurso" value="${inscrito.idCurso}">Salir del curso</button></td>
				</tr> `;
	})
	texto = texto + `</tbody> </table> </form> </div>`;
	return texto;
})
hbs.registerHelper('cursosAsignados', (cursos, inscritos, usuarios)=>{

    let texto = '<div class="container"> <div class="accordion" id="accordionExample">';
    i = 1;
    cursos.forEach(curso => {
        texto = texto +
               `<div class="card">
                    <div class="card-header" id="heading${i}">
                        <h2 class="mb-0">
                            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                            ${curso.nombre}
                            </button>
                            <form action="/curso-seleccionado" method="post">
                            <input name="nombre" type="hidden" value="${curso.nombre}">
                            <input name="id" type="hidden" value="${curso.id}">
                            <button class="btn btn-primary" style="float:right" type="submit">
                            Seleccionar
                            </button>
                            </form>
                        </h2>
                    </div>

                    <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                        <div class="card-body">

                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item">
                                    Nombre
                                        ${curso.nombre}
                                    </li>
                                    <li class="list-group-item">
                                    Descripcion
                                       ${curso.descripcion}
                                    </li>
                                    <li class="list-group-item">
                                    Valor
                                       ${curso.valor}
                                    </li>
                                    <li class="list-group-item">
                                    Modalidad
                                        ${curso.modalidad}
                                    </li>
                                    <li class="list-group-item">
                                    Intensidad
                                        ${curso.intensidad}
                                    </li>

                                </ul>

                                <h5 class="text-center tituloUsuarios">Estudiantes Inscritos en el curso</h5>

                                <table class='table table-striped table-hover'>
                                    <thead class='thead-dark'>
                                    <th>Nombre</th>
                                    <th>Documento</th>
                                    <th>Correo</th>
                                    <th>Teléfono</th>
                                    </thead>
                                    <tbody>`;

                                    var filtro = inscritos.filter(inscrito => inscrito.idCurso == curso.id);
                                    filtro.forEach(inscrito => {
                                    let estudiante = usuarios.find(usuario => usuario.documento == inscrito.documento)
                                    let valor = estudiante.documento + ',' + String(curso.id);
                                    texto = texto +
                                    `<tr>
                                    <td> ${estudiante.nombre} </td>
                                    <td> ${estudiante.documento} </td>
                                    <td> ${estudiante.correo}</td>
                                    <td> ${estudiante.telefono}</td>
                                    </tr>`
                                })
                                texto = texto + `</tbody> </table></form>
                        </div>
                    </div>
                </div>`;
                i=i+1;
    });

    texto = texto + '</div> </div>';

    return texto;
})
