'use stric'

let admin = require("../../firebase/firebaseAdmin");

let database = admin.dataBase;
let fbauth = admin.firebaseAdminAuth;

async function listarAsignaturas(req, res) {
    try {
        let uid = req.body;

        const datosMatricula = await database.collection('matricula').doc(uid).get();

        // Enviar codigo y nombre
        let asignaturas = {};

        if(datosMatricula.data() !== undefined) {
            let arr = Object.keys(datosMatricula.data());
            await Promise.all(arr.map(async (asignatura) => {
                let nombre = await database.collection('asignaturas').doc(asignatura).get();
                asignaturas[asignatura] = nombre.data().nombre;
            }));
        }

        res.send(asignaturas);
    }
    catch(error) {
        console.log(error);
        res.send('{ "message": "' + error + '" }');
    }
}

async function changeUserStatus(req, res) {
    try {
        let uid = req.user.uid;

        const status = await database.collection('usuarios').doc(uid).update({
            "estado": req.body
        })

        res.status(200).send('{ "message": "User status changed" }');
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }
}

async function getUserProfile(req, res) {
    try {
        let uid = req.user.uid;

        let data = {
            nick: null,
            pinfcoins: null,
            estado: null,
            email: null
        }

        let userData = await database.collection('usuarios').doc(uid).get();

        userData = userData.data();

        let user = await fbauth.getUser(uid);

        data.nick = userData.nick;
        data.pinfcoins = userData.pinfcoins;
        data.estado = userData.estado;
        data.email = user.email;

        res.status(200).send(data);
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }
}

async function cambiarNick(req, res){

    try{
    let arroba ="@";
     if(req.usuario.startsWith("@")){
       uuidss = req.usuario;
       let long = req.usuario.length;
       let nickantiguo = req.usuario.slice(1,long);
     }else{
       uuidss = arroba.concat(req.usuario);
       let nickantiguo = req.usuario;
     }
     //ahora todo es igual en ambos:
     //miramos que el nombre este disponible
     let interruptor = 1;
     let newuuids = arroba.concat(req.newusuario);
   
     let aRef = database.collection('uuids').doc(newuuids);
     let geta = await aRef.get()
       .then(doc => {
         if (!doc.exists) {
           console.log('No such document!');
           interruptor = 0;
         } else {
           console.log('Document data:', doc.data());
         
         }
       })
       .catch(err => {
         console.log('Error getting document', err);
       });
   
     if(interruptor){
       console.log("dicho usuario esta tomado");
       res.status(500).send('{ "message": "Nick no disponible" }');
     }else
     {
       //sacamos el id del usuario
       let clave = "hi";
       let claveusuario ="hi";
       let bRef = database.collection('uuids').doc(uuidss);
       let getb = await bRef.get()
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
   
       
       claveusuario=clave.uuid;
   
       //ahora modificamos el campo usuario y nick
       let ref = database.collection('usuarios').doc(claveusuario);
       let getref = await ref.get()
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
   
       clave["nick"]=req.newusuario;
       
       let petira = database.collection('usuarios').doc(claveusuario);
       let petirb = await petira.set(clave);
   
       //ahora hay que cambiar el campo uuids y ponerle el nick nuevo
       await database.collection('uuids').doc(uuidss).delete();
   
       await database.collection('uuids').doc(newuuids).set({ "uuid":claveusuario});
       
       res.status(200).send('{ "message": "Peticion rechazada" }');
     }
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }
}

async function cambiarEstado(req,res){
    try{
    let arroba ="@";
    if(req.usuario.startsWith("@")){
        uuidsss = req.usuario;
        let long = req.usuario.length;
        let nick = req.usuario.slice(1,long);  
      }else{
        uuidsss = arroba.concat(req.usuario);
        let nick = req.usuario;
      }
    
      let interruptor = 1;
      let clavedestino ="hi";
      //comprobamos si el nick de dicho usuario existe
      let uuidsrRef = database.collection('uuids').doc(uuidsss);
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
         console.log('No existe, poner un return aqui');
         res.status(500).send('{ "message": "Peticion rechazada, el nick de dicho usuario no existe" }');
       } 
      else{
    
        //existe dicho usuario, ahora toca cambiar el nick
      
      let ref = database.collection('usuarios').doc(clavedestino);
      let getref = await ref.get()
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
    
      clave["estado"]=req.newestado;
     
      let petira = database.collection('usuarios').doc(clavedestino);
      let petirb = await petira.set(clave);
      res.status(200).send('{ "message": "Peticion rechazada" }');
    }
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }
    
}


module.exports = {
    listarAsignaturas,
    changeUserStatus,
    getUserProfile,
    cambiarNick,
    cambiarEstado
}