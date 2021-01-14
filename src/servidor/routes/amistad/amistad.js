'use strict'

let admin = require("../../firebase/firebaseAdmin");

let database = admin.dataBase;
let firebase = admin.firebaseAdmin.firestore;

async function aceptarPeticion(req, res) {
    try {
        let uid = req.user.uid;

        let uidPeticion = req.body;

        // Eliminar peticion enviada
        await database.collection('peticionesRecibidas').doc(uid).update({[uidPeticion]: firebase.FieldValue.delete()});

        // Eliminar peticion recibida
        await database.collection('peticionesRecibidas').doc(uidPeticion).update({ [uid]: firebase.FieldValue.delete()});

        let data = {[uidPeticion]: true}

        // Guardar en amigos ambos usuarios
        await database.collection('amistades').doc(uid).set(data, { merge: true });

        data = {[uid]: true}

        await database.collection('amistades').doc(uidPeticion).set(data, { merge: true });

        res.status(200).send('{ "message": "Peticion aceptada" }');
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }
    
}

async function rechazarPeticion(req, res) {
    try {
        let uid = req.user.uid;

        let uidPeticion = req.body;

        // Eliminar peticion enviada
        await database.collection('peticionesRecibidas').doc(uid).update({[uidPeticion]: firebase.FieldValue.delete()});
        // Eliminar peticion recibida
        await database.collection('peticionesEnviadas').doc(uidPeticion).update({[uid]: firebase.FieldValue.delete()});

        res.status(200).send('{ "message": "Peticion rechazada" }');
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }
}

async function getAmistades(req, res) {
    try {
        let uid = req.user.uid;

        let data = {
            data: []
        };

        let peticiones = await database.collection('peticionesRecibidas').doc(uid).get();
        peticiones = peticiones.data();

        if(peticiones) {
            let arr = Object.keys(peticiones);
            for(let i = 0; i < arr.length; ++i) {
                let user = await getDatosPerfil(arr[i]);
                user.tipo = "peticion";
                data.data.push(user);
            }
        }

        let amigos = await database.collection('amistades').doc(uid).get();
        amigos = amigos.data();

        if(amigos) {
            let arr = Object.keys(amigos);
            for(let i = 0; i < arr.length; ++i) {
                let user = await getDatosPerfil(arr[i]);
                user.tipo = "amistad";
                data.data.push(user);
            }
        }

        res.status(200).send(data);
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }
}

async function getDatosPerfil(uid) {

    let usuario = await database.collection('usuarios').doc(uid).get();
    usuario = usuario.data();

    let data = {
        nick: usuario.nick,
        estado: usuario.estado,
        uid: uid
    }

    return data;
}

async function enviarSolicitudAmistad(){
    try{
    if(req.receptor.startsWith('@')){
      //codigo suponiendo que me dan el nombre del uuids
      let interruptor = 1; //suponemos que el destino existe
      let clave ="hi";
      
      let clavedestino ="hi";
      let uuidsrRef = database.collection('uuids').doc(req.receptor);
      let getrDoc = await uuidsrRef.get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document!');
            interruptor = 0;
          } else {
            console.log('Document data:', doc.data());
            clave = doc.data();
         }
        })
        .catch(err => {
         console.log('Error getting document', err);
        });
  
        clavedestino=clave.uuid;
  
        if(interruptor!=1){
          res.status(500).send('{ "message": "Dicho usuario no existe" }');
        } else
          {
  
           //Saco ell uuid del emisor:
  
            let claveemisor ="hi";
           let uuidseRef = database.collection('uuids').doc(req.emisor);
            let geteDoc = await uuidseRef.get()
            .then(doc => {
                if (!doc.exists) {
                 console.log('No such document!');
              } else {
                console.log('Document data:', doc.data());
                clave = doc.data();
              }
            })
           .catch(err => {
              console.log('Error getting document', err);
            });
        
            claveemisor = clave.uuid;
  
           //Saco el nombre del emisor
  
        
           let nemisor = database.collection('usuarios').doc(claveemisor);
            let getnemisor = await nemisor.get()
              .then(doc => {
                if (!doc.exists) {
                console.log('No such document!');
               } else {
                console.log('Document data:', doc.data());
                clave = doc.data();
              }
            })
            .catch(err => {
             console.log('Error getting document', err);
            });
  
            let nickemisor = clave.nick;
  
           //Saco nombre receptor
          
  
           let nreceptor = database.collection('usuarios').doc(clavedestino);
           let getreceptor = await nreceptor.get()
            .then(doc => {
              if (!doc.exists) {
              console.log('No such document!');
              } else {
                  console.log('Document data:', doc.data());
                 clave = doc.data();
              }
           })
           .catch(err => {
             console.log('Error getting document', err);
           });
  
            let nickreceptor = clave.nick;
  

           //tengo que ver que el emisor no le haya enviado ya una peticion al receptor
  
           let petiReff = database.collection('peticionesEnviadas').doc(claveemisor);
            let getpetiDoc = await petiReff.get()
           .then(doc => {
              if (!doc.exists) {
               console.log('No such document!');
              } else {
                console.log('Document data:', doc.data());
                clave = doc.data();
             }
           })
            .catch(err => {
           console.log('Error getting document', err);
           });
  
    
  
            if(clave.mapa[nickreceptor]){
             res.status(500).send('{ "message": "Ya le has enviado una peticion a dicho usuario" }');
            }else{
             //ahora toca rellenar las peticiones enviadas y recibidas
     
             clave.mapa[nickreceptor]="true";
             
  
             let petiea = database.collection('peticionesEnviadas').doc(claveemisor);
             let petieb = await petiea.set(clave);
  
  
             //ahora metemos el emisor en las recibidas del receptor
  
  
             let petirecibidasreff = database.collection('peticionesRecibidas').doc(clavedestino);
             let getpetirecibidasref = await petirecibidasreff.get()
               .then(doc => {
                if (!doc.exists) {
                console.log('No such document!');
               } else {
                 console.log('Document data:', doc.data());
                 clave = doc.data();
                }
             })
             .catch(err => {
               console.log('Error getting document', err);
             });
  
             clave.mapa[nickemisor]="true";
             
  
             let petira = database.collection('peticionesRecibidas').doc(clavedestino);
             let petirb = await petira.set(clave);
  
             res.status(200).send('{ "message": "Peticion realizada con exito" }');
            }
  
          }
    }else
    {
        //codigo suponiendo que me dan el nick
  
   let uuidsemisor = "@";
   let uuidsreceptor = "@";
   uuidsemisor=uuidsemisor.concat(req.emisor);
   uuidsreceptor=uuidsreceptor.concat(req.receptor);
   //ya tengo los @ para busquedas en uuids
  
   
   let interruptor = 1; //suponemos que el destino existe
   let clave ="hi";
  
   //busco que el receptor exista
  
   let clavedestino ="hi";
   let uuidsrRef = database.collection('uuids').doc(uuidsreceptor);
     let getrDoc = await uuidsrRef.get()
       .then(doc => {
         if (!doc.exists) {
          console.log('No such document!');
           interruptor = 0;
         } else {
          console.log('Document data:', doc.data());
          clave = doc.data();
        }
      })
       .catch(err => {
         console.log('Error getting document', err);
      });
  
    clavedestino=clave.uuid;
  
  
    if(interruptor!=1){
    res.status(500).send('{ "message": "Dicho usuario no existe" }');
    }else{
     //sasamos la clave del emisor
  
     let claveemisor="hi";
     let emisor ="hi";
     let uuidseRef = database.collection('uuids').doc(uuidsemisor);
     let geteDoc = await uuidseRef.get()
       .then(doc => {
         if (!doc.exists) {
         console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
         clave = doc.data();
        }
     })
    .catch(err => {
      console.log('Error getting document', err);
    });
  
     claveemisor = clave.uuid;
  
  
    //vanos a intentarb unir resultados
  
    let nickemisor = req.emisor;
    let nickreceptor = req.receptor;
  
    //Inciso ------nicks en nickreceptor/nickemisor y claves en claveemisor clavedestino
  
    
    let petiReff = database.collection('peticionesEnviadas').doc(claveemisor);
    let getpetiDoc = await petiReff.get()
     .then(doc => {
       if (!doc.exists) {
         console.log('No such document!');
       } else {
          console.log('Document data:', doc.data());
         clave = doc.data();
       }
     })
   .catch(err => {
     console.log('Error getting document', err);
    });
  
  
  
    if(clave.mapa[nickreceptor]){
      res.status(500).send('{ "message": "Ya le has enviado una peticion a dicho usuario" }');
    }else{
      //ahora toca rellenar las peticiones enviadas y recibidas
   
      clave.mapa[nickreceptor]="true";
     
  
      let petiea = database.collection('peticionesEnviadas').doc(claveemisor);
      let petieb = await petiea.set(clave);
  
  
     //ahora metemos el emisor en las recibidas del receptor
  
  
     let petirecibidasreff = database.collection('peticionesRecibidas').doc(clavedestino);
     let getpetirecibidasref = await petirecibidasreff.get()
        .then(doc => {
         if (!doc.exists) {
         console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
          clave = doc.data();
         }
      })
     .catch(err => {
       console.log('Error getting document', err);
     });
  
     clave.mapa[nickemisor]="true";
     
  
     let petira = database.collection('peticionesRecibidas').doc(clavedestino);
     let petirb = await petira.set(clave);
     
     res.status(200).send('{ "message": "Peticion realizada con exito" }');
  
  }
  }
  }
    }
    catch(error) {
        console.log(error);
     res.status(500).send('{ "message": "' + error + '" }');
    }


}
  

module.exports = {
    aceptarPeticion,
    rechazarPeticion,
    enviarSolicitudAmistad
};