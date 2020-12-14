var pdfReader = require("pdfreader");

var rows = [];
var asignaturas = [];

let usuario = "HPLZSWQI";  //Duda obtener el usuario uuid que verdaderamente ha iniciado sesión

function analizarExpediente() {

  for(let i = 1; i <= rows.length ; i++){

    if(rows[i] == "Asignaturas Matriculadas:"){  
      var precod = rows[i+1].substr(0,5);   //Toma como referencia la parte común del código de todas las asignaturas
    }
  }

  for(let i = 1; i <= rows.length ; i++){
    if(rows[i] != null){
      if(rows[i].match(precod)){ //Analiza las lineas del pdf que continene una asignatura
        let linea = rows[i].split(" ");
        if(parseFloat(linea[linea.length - 2]) >= 5){ //Si la asignatura está aprobada (calificación >= 5.0) se almacena
          asignaturas.push(rows[i]); 
        } 
     }
   }
  }
}

function ObtenerPinfCoins(){

  for(let i = 0; i<= rows.length ; i++){ //Bucle para obtener la nota media del alumno
    if(rows[i] != null){
      if(rows[i].match("NOTA MEDIA PONDERADA")){
        if(rows[i+1].match("Art. 5.3 del R.D. 1125/2003")){
          let linea = rows[i].split(" ");
          var NotaMedia = parseFloat(linea[4].substr(0,4));
        }
      }
    }
  }

  for(let i = 0; i <= asignaturas.length ; i++){ //Bucle para obtener el total de créditos superados por el alumno
    if(asignaturas[i] != null){
      let linea = asignaturas[i];
      var creditosSuperados =+ parseInt((linea[67]));
    }
  }

  //console.log("PinfCoins: " + creditosSuperados * NotaMedia); //PinfCoins = creditosSuperados * NotaMedia en base 10
  return (creditosSuperados * NotaMedia); 

}

function getNombre(string){
  let str = string.split(" ");
  let nombre = "";
  for(let i = 1; i < str.length ; i++){
    let num = str[i];

    if(isNaN(num)){
      nombre = nombre + " " + str[i];
    }
    else{
      break;
    }

  }
  return nombre;
}

async function subirExpedienteConPDF(){
  
  new pdfReader.PdfReader().parseFileItems("/ruta_al_pdfExpediente", function(err, item) {  //Duda incluir path al pdf que sube el usuario
    if (!item ){
      analizarExpediente();
    }
    else if(item.text) 
    {
      rows.push(item.text);
    }
   });

   for(let i = 0; i <= asignaturas.length ; i++){
    if(asignaturas[i] != null){
      var l = asignaturas[i].split(" ");
      var calificacion = l[l.length - 2];
      var nombre = getNombre(asignaturas[i]);
      var cod = l[1];
      var coins = ObtenerPinfCoins();
      console.log("PinfCoins")
    }
  
    
     const userExRef = db.collection('expedientes').doc(usuario); 
     const asigRef = db.collection('asignaturas');
     const userRef = db.collection('usuarios').doc(usuario);

     const a = await userExRef.set({
       "codigo": cod,
       "calificacion": calificacion
     },{ merge: true });


     const b = await asigRef.set({
       "codigo": cod,
       "nombre": nombre
     },{ merge: true });

     const c = await userRef.update({"pinfcoins": coins});

    }   
}

subirExpedienteConPDF();
