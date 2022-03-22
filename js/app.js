const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');


const objBusqueda = {
    moneda:'',
    criptomoneda: ''
}

//Crear un Promise para verificar el llamado a las criptomendas

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas(); 

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);

    monedaSelect.addEventListener('change', leerValor);
});

 async function consultarCriptomonedas() {
    const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD";
    
    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(resultado => obtenerCriptomonedas(resultado.Data))
    //     .then(criptomonedas => selectCriptomonedas(criptomonedas))
        try {
            const respuesta = await fetch(url)
            const resultado = await respuesta.json();
            const criptomonedas = await obtenerCriptomonedas(resultado.Data)
            selectCriptomonedas(criptomonedas);
        } catch (error) {
            console.log(error);
        }
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda);
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach( cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    })
}

function submitFormulario (e) {
    e.preventDefault();

    const {moneda,criptomoneda} = objBusqueda;

    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta("Ambos Campos son Obligatorios");
        return;

    }

    consultarAPI();
}

function mostrarAlerta(msg) {
    const existeError = document.querySelector('.error')

    if (!existeError) {
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('error');
    //mensaje de error
    divMensaje.textContent = msg;
    formulario.appendChild(divMensaje);
    setTimeout(() => {
        divMensaje.remove()
    }, 3000);

 }

}

 async function consultarAPI() {
   
const {moneda, criptomoneda } = objBusqueda;

const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpiner();

    // fetch(url)
    //     .then ( respuesta => respuesta.json())
    //     .then(cotizacion => {
    //         mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    //     })

        try {
            const respuesta = await fetch(url)
            const resultado = await respuesta.json()
            const cotizacion = await resultado
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        } catch (error) {
            console.log(error);
        }

}

function mostrarCotizacionHTML(cotizacion){
   
   
    limpiarHTML()
    
    const {PRICE,HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es <span>${PRICE}</span>`;

    const precioalto = document.createElement('p');
    precioalto.innerHTML = `Su Precio más alto fue de <span>${HIGHDAY}</span> `;

    const preciobajo = document.createElement('p');
    preciobajo.innerHTML = `Su Precio más bajo fue de <span>${LOWDAY}</span> `;

    const variacion = document.createElement('p');
    variacion.innerHTML = `Ha tenido una variacion de <span>${CHANGEPCT24HOUR}%</span> `;
   
    const actualizacion = document.createElement('p');
    actualizacion.innerHTML = `Su ultima actualizacion fue hace <span>${LASTUPDATE}</span> `;
   
    resultado.appendChild(precio);
    resultado.appendChild(precioalto);
    resultado.appendChild(preciobajo);
    resultado.appendChild(variacion);
    resultado.appendChild(actualizacion);
}

function limpiarHTML() {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpiner() {
    
    limpiarHTML()

    const Spiner = document.createElement('div')
    Spiner.classList.add("sk-folding-cube");

    Spiner.innerHTML = `
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
    `

    resultado.appendChild(Spiner);
}