class detallePrestamo {
  constructor(cuota,interes,capital,valorCuota,saldo){
    this.cuota = cuota.toFixed(2);
    this.interes = interes.toFixed(2);
    this.capital = capital.toFixed(2);
    this.valorCuota = valorCuota.toFixed(2);
    this.saldo = saldo.toFixed(2);
  }
}



const montoInput  = document.querySelector("#monto");
const plazoInput  = document.querySelector("#plazo");
const tnaInput = document.querySelector("#tna");
const detalle = document.querySelector(".detalle");
const alertas = document.querySelector(".titulo1");

const prestamo = [];

let valor;
let meses;
let tna;
let cuota = 0;
let interes = 0;

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



function principal () {

  if (document.querySelector(".alert-danger")){
    document.querySelector(".alert").remove();
  }


  if ( valor == 0 || meses == 0 || tna == 0 || isNaN(valor) || isNaN(meses) || isNaN(tna)) { 

    let alerta = document.createElement("div")
    alerta.innerHTML = '<div id="alert1" class="alert alert-danger" role="alert">Revise los datos ingresados</div>';
    alertas.append(alerta);
    cambioMonto();
    cambioMeses();
    cambioTna();

  } else { 
    calculo();
    detalleCuota();
    muestroCuotas();

    const pJSON = JSON.stringify(prestamo);
    sessionStorage.setItem('ultimoPrestamo', pJSON);
    console.log(prestamo);
    console.log(JSON.parse(sessionStorage.getItem('ultimoPrestamo')));
  }
  
}

function pFrances (){
  sessionStorage.setItem('tipoPrestamo','frances')
  console.log(sessionStorage.getItem('tipoPrestamo'));
  botonAleman.classList.remove("btn-secondary");
  botonAleman.classList.add("btn-outline-secondary")
  botonFrances.classList.add("btn-primary");
  botonFrances.classList.remove("btn-outline-primary");
}

function pAleman (){
  sessionStorage.setItem('tipoPrestamo','aleman')
  console.log(sessionStorage.getItem('tipoPrestamo'));
  botonFrances.classList.remove("btn-primary");
  botonFrances.classList.add("btn-outline-primary");
  botonAleman.classList.add("btn-secondary");
  botonAleman.classList.remove("btn-outline-secondary")

}

function cambioMonto() {
  
  valor = montoInput.value;

  if (valor <= 0 || valor >10000000){
    input1.classList.add('is-invalid');
  } else {
    input1.classList.remove('is-invalid')
    valor = montoInput.value;
  }  
}
function cambioMeses() {
  meses = plazoInput.value;

  if ( meses <= 0 || meses >100){
    input2.classList.add('is-invalid');
  } else {
    input2.classList.remove('is-invalid')
    meses = plazoInput.value;
  }  

}
function cambioTna() {
  tna = tnaInput.value;

  if (tna <= 0 || tna >100){
    input3.classList.add('is-invalid');

  } else {

    input3.classList.remove('is-invalid')
    tna = tnaInput.value;
  }  
}

function muestroCuotas(){

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

  for (const cuotadetalle of prestamo){
    let tabla = document.createElement("tr");
    tabla.innerHTML = "<td>"+parseInt(cuotadetalle.cuota)+"</td><td>$"+cuotadetalle.interes+
                      "</td><td>$"+cuotadetalle.capital+"</td><td>$"+cuotadetalle.valorCuota+
                      "</td><td>$"+ cuotadetalle.saldo;
    cuerpo.appendChild(tabla);
  }
}

function calculo() {
  valor = montoInput.value;
  interes = tna / 1200;
  let factor = Math.pow(interes + 1, meses);
  cuota = (valor * interes * factor) / (factor - 1);
  alert(
    "La cuota por $" +
      valor +
      " a " +
      meses +
      " meses es de " +
      cuota.toFixed(2)
  );
}

function detalleCuota() {
  while (prestamo.length) { 
    prestamo.pop(); 
}

  for (let i = 0; i <= meses - 1; i++) {
    valor = valor - (cuota-(valor*interes));
    prestamo.push(new detallePrestamo(i+1,valor*interes,cuota-(valor*interes),cuota,valor));   
  }
}


