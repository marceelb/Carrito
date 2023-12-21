//variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

cargarEventListeners()
function cargarEventListeners(){

    //cuando agregas un curso presionando agregar al carrito
    listaCursos.addEventListener('click', agregarCurso)

    //eliminar cursos del carrito
    carrito.addEventListener('click', eliminarCurso);


    //vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; //reseteamos el arreglo
        limpiarHTML(); //eliminamos todo el HTML
        sincronizarStorage(); //Sincronizar LS una ves que vaciamos el carrito
    })

    //mostrar los cursos del LS
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse( localStorage.getItem('carrito')) || [];

        carritoHTML();
    })

};


//Funciones
function agregarCurso(e){
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado)     
    } 
};

//eliminar cursos del carrito
function eliminarCurso(e) {
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');

        //eliminar del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId);

        carritoHTML(); //itera sobre el carrito y muestra el HTML
    }
}

// Lee el contenido del HTML al que le dimos click y extrae la informacion del curso 
function leerDatosCurso(curso) {
     

    //crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    //revisar si el curso ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id );
        if (existe) {
            //modificamos la cantidad
            const cursos = articulosCarrito.map( curso => {
                if (curso.id === infoCurso.id) {
                    curso.cantidad++;
                    return curso;   //retorna el objeto actualizado
                } else {
                    return curso;   //retorna los que no son duplicados
                }
            });
            articulosCarrito = [...cursos];
        } else {
            //agregamos al carrito
            articulosCarrito = [...articulosCarrito, infoCurso];
        }

    //agregar elementos al carrito 

    carritoHTML();
}


//mostrar el carrito de compras en el HTML

function carritoHTML(){
    limpiarHTML();

    //recorrer el carrito y generar el HTML
    articulosCarrito.forEach(curso => {
        const { imagen, titulo, precio, cantidad, id } = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100"> 
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> X </a>
            </td>
        `;

        //agregar el HTML al carrito en el tbody
        contenedorCarrito.appendChild(row)
    });

    //sincronizar con Locar Storage
    sincronizarStorage();
};

function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito))
}

//eliminar los cursos del tbody
function limpiarHTML(){

   //contenedorCarrito.innerHTML = '';

    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}