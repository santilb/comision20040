/*Declaro Clases*/
class detallePrestamo {
  constructor(cuota,interes,capital,valorCuota,saldo){
    this.cuota = cuota.toFixed(2);
    this.interes = interes.toFixed(2);
    this.capital = capital.toFixed(2);
    this.valorCuota = valorCuota.toFixed(2);
    this.saldo = saldo.toFixed(2);
  }
}

/*Selecciono Secciones HTML*/
const montoInput  = document.querySelector("#monto");
const plazoInput  = document.querySelector("#plazo");
const tnaInput = document.querySelector("#tna");
const detalle = document.querySelector(".detalle");
const alertas = document.querySelector(".titulo1");

let prestamo = [];

let falsy;
let valor;
let meses;
let tna;
let cuota = 0;
let interes = 0;

/*botones de eventos*/
let boton = document.getElementById("botonPrestamo");
boton.onclick = () => principal(); 
let input1  = document.getElementById("monto");
input1.onchange = () =>  cambioMonto();
let input2  = document.getElementById("plazo");
input2.onchange = () =>  cambioMeses();
let input3  = document.getElementById("tna");
input3.onchange = () =>  cambioTna();
let botonFrances = document.getElementById("botonFrances");
botonFrances.onclick = () => pFrances();
let botonAleman = document.getElementById("botonAleman");
botonAleman.onclick = () => pAleman();


/*Funciones*/

function principal () {


document.querySelector(".alert-danger") && document.querySelector(".alert").remove();

!valor || !meses || !tna ? (campoVacio(), cambioMonto(), cambioMeses(), cambioTna()) : 
    (
    calculo(), detalleCuota(), muestroCuotas(),
    pJSON = JSON.stringify(prestamo),
    sessionStorage.setItem('ultimoPrestamo', pJSON),
    console.log(prestamo),
    console.log(JSON.parse(sessionStorage.getItem('ultimoPrestamo')))
    )
  
}

/*Alerta Campos Vacios */
function campoVacio() {
  document.querySelector(".alert-danger") && document.querySelector(".alert").remove();
  let alerta = document.createElement("div")
  alerta.innerHTML = '<div id="alert1" class="alert alert-danger" role="alert">Revise los datos ingresados</div>';
  alertas.append(alerta);
}

/*Chequea el cambio en el boton Frances*/
function pFrances (){
  sessionStorage.setItem('tipoPrestamo','frances')
  console.log(sessionStorage.getItem('tipoPrestamo'));
  botonAleman.classList.remove("btn-secondary");
  botonAleman.classList.add("btn-outline-secondary")
  botonFrances.classList.add("btn-primary");
  botonFrances.classList.remove("btn-outline-primary");
}

/*Chequea el cambio en el boton Aleman*/
function pAleman (){
  sessionStorage.setItem('tipoPrestamo','aleman')
  console.log(sessionStorage.getItem('tipoPrestamo'));
  botonFrances.classList.remove("btn-primary");
  botonFrances.classList.add("btn-outline-primary");
  botonAleman.classList.add("btn-secondary");
  botonAleman.classList.remove("btn-outline-secondary")

}

/*Chequea el cambio en el campo monto*/
function cambioMonto() { 
  valor = montoInput.value;

  valor <= 0 || valor >10000000 ? 
    input1.classList.add('is-invalid') : ( input1.classList.remove('is-invalid'),
    valor = montoInput.value)
}

/*Chequea el cambio en el campo Meses*/
function cambioMeses() {

  meses = plazoInput.value;

  meses <= 0 || meses >100 ?
    input2.classList.add('is-invalid') : (input2.classList.remove('is-invalid'),
    meses = plazoInput.value)

}

/*Chequea el cambio en el campo TNA*/
function cambioTna() {
  tna = tnaInput.value;

  tna <= 0 || tna >100 ? input3.classList.add('is-invalid')
  :
  (input3.classList.remove('is-invalid'),
  tna = tnaInput.value)
}

/*Armo tabla con cuotas*/
function muestroCuotas(){

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
  Toast.fire({
    icon: 'info',
    title: 'Simulando Prestamo'
  })

let filas = detalle.rows.length;
  if (filas != 0 ) {
    for (let i = 0; i < filas; i++) {
      detalle.deleteRow(0);
    }
}

let encabezado = document.createElement("thead")
let cuerpo = document.createElement("tbody")
encabezado.innerHTML = '<tr><th scope="col">#Cuota</th>'+
'<th scope="col">Interes</th><th scope="col">Capital</th>'+
'<th scope="col">Cuota</th><th scope="col">Saldo Restante</th></tr>';

detalle.appendChild(encabezado);
detalle.appendChild(cuerpo);

setTimeout(() => {
  
  for (const cuotadetalle of prestamo){

    const {cuota, interes, capital, valorCuota, saldo} = cuotadetalle;

    let tabla = document.createElement("tr");
    tabla.innerHTML = "<td>"+parseInt(cuota)+"</td><td>$"+interes+
                      "</td><td>$"+capital+"</td><td>$"+valorCuota+
                      "</td><td>$"+ saldo;
    cuerpo.appendChild(tabla);
  }

}, 2500);
}

/*Calcula las cuotas del prestamo*/
function calculo() {
  valor = montoInput.value;
  interes = tna / 1200;
  let factor = Math.pow(interes + 1, meses);
  cuota = (valor * interes * factor) / (factor - 1);

  Swal.fire({
    icon: 'info',
    title: 'Simulacion de Prestamo por $'+valor+' pesos AR' ,
    text: 'Su cuota sera de $'+cuota.toFixed(2)+'.',
  })

}

/*Armo prestamo*/
function detalleCuota() {

  while (prestamo.length) { 
    prestamo.pop(); 
}
  for (let i = 0; i <= meses - 1; i++) {
    valor = valor - (cuota-(valor*interes));
    prestamo = [... prestamo, new detallePrestamo(i+1,valor*interes,cuota-(valor*interes),cuota,valor)];   
  }
}


