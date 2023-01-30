
let carrito = [];
let sub_total = [];
let total;
let filtrados = "";
let filtro_check = [];
let busqueda_con_check = "";

let cuerpo = document.getElementById("main_html");

let botonBuscarJs = document.getElementById("botonBuscar");
let inputBuscarHtml = document.getElementById("inputBuscar");

inputBuscarHtml.onchange = realizar_busqueda;


let contenedorCarritoJs = document.getElementById("contenedorCarrito");
botonBuscarJs.onclick = realizar_busqueda;

let mostrarCarro = document.getElementById("mostrar");
mostrarCarro.onclick = visualisacion_carrito

let checkCategorias = document.getElementsByClassName("categorias");
for (const checkCategoria of checkCategorias) {//para esuchar todos los click de ccategorias(tambien esta hecho con query selllector)
    checkCategoria.onclick = filtrado_check;
};


function mostrar_producto(producto) {//funtion para crear caja contenedores de productos
    contenedorPrincipal.innerHTML = "";
    producto.forEach((e) => {
        let contenedorProducto = document.createElement("article");
        contenedorProducto.className = "articulo";
        contenedorProducto.innerHTML = `
        
        <div>
            <h3 class="productos">${e.categoria}</h3>
            <p > 
                ${e.nombre}
            </p>
            <img src="${e.img}">
            <div>
                <h4>$${e.precio}
                </h4>
                <button class="boton_agregar" id=elimnar${e.id}> Agregar</button>
            </div>
        </div>
    `
        contenedorPrincipal.appendChild(contenedorProducto);
    });

    let botonAgregarCarrito = document.querySelectorAll(`.boton_agregar`);//otra forma de seleccionar todo las clases
    botonAgregarCarrito.forEach((e) => e.onclick = agregar_carrito);//otra forma de esuchar el evento
    if (localStorage.getItem("producto_usuario") != null) {
        carrito = JSON.parse(localStorage.getItem("producto_usuario"));
        renderisado_carrito();
        mostrarCarro.innerHTML = `carrito${carrito.length}`;
    } else {
        localStorage.clear();
        renderisado_carrito();
    }
    if (contenedorPrincipal.innerHTML == "") {
        contenedorPrincipal.innerHTML = `<p >producto no encontrado</p>`;
    }
}

mostrar_producto(productos)


function visualisacion_carrito() {//muestra o oculta lo contenido en carrito
    contenedorPrincipal.classList.toggle("ocultar");
    contenedorCarritoJs.classList.toggle("ocultar");
    if (mostrarCarro.innerText.includes("ocultar") == false) {
        mostrarCarro.innerText = "ocultar";
    } else {
        if (carrito.length != 0) {
            mostrarCarro.innerText = `carrito${carrito.length}`;
        } else {
            mostrarCarro.innerText = "carrito";
        }
    }
};
let busqueda = "";
function realizar_busqueda() {
    filtrados = "";
    busqueda = inputBuscarHtml.value.toLowerCase()
    filtrados = productos.filter((el) =>
        el.categoria.toLowerCase().includes(busqueda)
        || el.nombre.toLowerCase().includes(busqueda))
    if (filtro_check == "") {
        mostrar_producto(filtrados);
    } else {
        filtrado_check();
    };
}


function renderisado_carrito() {
    sub_total = []
    carrito.forEach((el) => sub_total.push(el.cantidad * el.precio));
    total = sub_total.reduce((a, el) => a + el, 0);
    carrito.forEach((el) => contenedorCarritoJs.innerHTML += `
            <div>
                <p> ${el.id}) Nombre:${el.nombre} </p>
                <button  class ="class_boton_restar" id=restar${el.id}>- </button>   
                <span> ${el.cantidad} </span>
                <button  class ="class_boton_agregar" id=sumar${el.id}> + </button>   
                <button class="botones_quitar"  id=quitar${el.id}>quitar</button>
                <span> ${el.cantidad * el.precio} </span>
            </div>
        `
    );
    if (carrito != "") {
        contenedorCarritoJs.innerHTML += `
                <div>
                    <span> Total: $${total} </span>
                    <button  id=finalizaCompra> Finalizar comprar</button>
                </div>
            `;
            
        let botonesSumar = document.querySelectorAll(`.class_boton_agregar`);
        let botonesRestar = document.querySelectorAll(`.class_boton_restar`);
        let botonesEliminarArticulos = document.querySelectorAll(`.botones_quitar`);

        botonesEliminarArticulos.forEach((el) => el.onclick = elminar_articulo);
        botonesRestar.forEach((el) => el.onclick = restar_cantidad);
        botonesSumar.forEach((el) => el.onclick = sumar_cantidad);
        localStorage.setItem("producto_usuario", JSON.stringify(carrito));

        let finalizaCompra = document.getElementById("finalizaCompra");
        finalizaCompra.onclick = envio_info
    } else {
        contenedorCarritoJs.innerHTML = `
                    <div>
                        <span>No tiene articulos en su carrito </span>
                    </div>
                `;
    }
};


function filtrado_check() {//funcion para ver si checkbox esta selecionado o no
    filtro_check = [];
    let busqueda_con_check = "";
    // function if_bajo_alto(){
    //     if(check_precios_bajos.checked){
    //         check_precios_altos.checked=false;
    //         filtrados.sort((x, y) => x.precio - y.precio);
    //     }else if(check_precios_altos.checked){
    //         check_precios_bajos.checked=false;
    //         filtrados.sort((x, y) => y.precio - x.precio);
    //     }else{
    //         filtrados.sort((x, y) => x.id - y.id);
    //     }

    // }
    for (const checkCategoria of checkCategorias) {
        if (checkCategoria.checked) {
            filtro_check.push(checkCategoria.id);
        };
    };
    if (busqueda == "") {
        filtrados = productos.filter((el) => filtro_check.includes(cambio_espacios(el.categoria)));
        if (filtro_check == "") {
            mostrar_producto(productos);
        } else {
            mostrar_producto(filtrados);
        };
    }
    //else{
    //     if(filtro_check==""){
    //         if_bajo_alto()
    //         mostrar_producto(filtrados);

    //     }else{
    //         if_bajo_alto()
    //         busqueda_con_check = filtrados.filter((el)=>filtro_check.includes(cambio_espacios(el.categoria)));
    //         mostrar_producto(busqueda_con_check);       
    //     }


    // }
};
function extractor_numero(cadena) {//funcion para extrar el numeros de las clase creadas con js para comparar con los id del array
    let idObtenido = "";
    for (i = 0; i < cadena.length; i++) {
        if (isNaN(cadena[i]) == false) {
            idObtenido = idObtenido + cadena[i]
        };
    };
    return idObtenido;
};
function cambio_espacios(cadena) {//funcion para cambiar el espacio por "_" para comparar las id asociadas a las class categorias de el html con las categorias de js
    let resultado = "";
    for (i = 0; i < cadena.length; i++) {
        if (cadena[i] == " ") {
            resultado += "_";
        } else {
            resultado += cadena[i];
        }
    }
    return resultado;
}


function agregar_carrito(e) {
    contenedorCarritoJs.innerText = "";
    let idExtraido = Number(extractor_numero(e.target.id));
    if (carrito.find((el) => el.id == idExtraido)) {
        let indice = carrito.indexOf(carrito.find((el) => el.id == idExtraido));
        carrito[indice].cantidad++;
    } else {
        carrito.push(productos.find((el) => el.id == idExtraido));
        carrito[carrito.length - 1].cantidad = 1;
    }
    renderisado_carrito();
    mostrarCarro.innerHTML = `carrito${carrito.length}`;
}

function elminar_articulo(e) {
    contenedorCarritoJs.innerText = "";
    let idExtraido = Number(extractor_numero(e.target.id));
    let a_eliminar = carrito.indexOf(carrito.find((el) => idExtraido == el.id));
    carrito.splice(a_eliminar, 1);
    if (carrito.length == 0) {
        localStorage.clear();
        contenedorCarritoJs.innerText = "";
    }
    renderisado_carrito();
}

function restar_cantidad(e) {
    contenedorCarritoJs.innerText = "";
    let idExtraido = Number(extractor_numero(e.target.id));
    if (carrito.find((el) => el.id == idExtraido)) {
        let indice = carrito.indexOf(carrito.find((el) => el.id == idExtraido));
        if (carrito[indice].cantidad > 1) {
            carrito[indice].cantidad--;
        }
    }
    renderisado_carrito();
}

function sumar_cantidad(e) {
    contenedorCarritoJs.innerText = "";
    let idExtraido = Number(extractor_numero(e.target.id));
    if (carrito.find((el) => el.id == idExtraido)) {
        let indice = carrito.indexOf(carrito.find((el) => el.id == idExtraido));
        carrito[indice].cantidad++;
    }
    renderisado_carrito();
}


function envio_info() {
    let ventana_envio = document.createElement("div")
    ventana_envio.className = "ventana_finalizado_comprar"

    carrito.forEach((el) => ventana_envio.innerHTML += `
            <div >
                <p> ${el.id} nombre:${el.nombre} </p>
                <span> ${el.cantidad} </span>
                <span> ${el.cantidad * el.precio} </span>
            </div>
        `
    );
    ventana_envio.innerHTML = `
        <div id=envio_productos>
            ${ventana_envio.innerHTML}
            <div>
                <span> Total:${total} </span>
                <button  id=boton_volver>volver a la tienda</button>
                <button  id=boton_confirmar>confirmar compra</button>
            </div>
        </div>
    `;
    cuerpo.appendChild(ventana_envio)

    let boton_confirmar = document.getElementById("boton_confirmar")
    boton_confirmar.onclick = realizar_comprar

    let boton_volver = document.getElementById("boton_volver")
    boton_volver.onclick = volver_tienda

    function realizar_comprar() {
        ventana_envio.innerHTML = `
        <div id=envio_productos>
            <p>
                    Agradesemos su compra
                </p>
                <button  id=boton_aceptar>aceptar</button>
            </div>   
        `
        localStorage.clear();
        contenedorCarritoJs.innerText = "";
        carrito = []
        visualisacion_carrito()
        let boton_aceptar = document.getElementById("boton_aceptar");
        boton_aceptar.onclick = cerra_ventana;
    }

    function volver_tienda() {
        ventana_envio.innerHTML = ""
        ventana_envio.classList.remove("ventana_finalizado_comprar")
    }

    function cerra_ventana() {
        ventana_envio.innerHTML = ""
        ventana_envio.classList.remove("ventana_finalizado_comprar")
        contenedorCarritoJs.innerHTML = `
        <div >
            <span>No tiene articulos en su carrito </span>
        </div>
    `;
    }
}