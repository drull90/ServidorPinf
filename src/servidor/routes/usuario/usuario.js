
let admin = require("../../firebase/firebaseAdmin");

let database = admin.dataBase;
let fireAuth = admin.firebaseAdminAuth;

async function listarAsignaturas(req, res) {
    try {

        // let token = admin.getUserToken(req);
        // let user = await firebaseAdminAuth.verifyIdToken(token);
        
        // let uuid = user.uuid;

        let uuid = "HPLZSWQI";

        const datosMatricula = await database.collection('matricula').doc('HPLZSWQI').get();

        // Enviar codigo y nombre
        let asignaturas = {};

        let arr = Object.keys(datosMatricula.data());

        await Promise.all(arr.map(async (asignatura) => {
            let nombre = await database.collection('asignaturas').doc(asignatura).get();
            asignaturas[asignatura] = nombre.data().nombre;
        }));

        res.send(asignaturas);
    }
    catch(error) {
        console.log(error);
        res.send('{ "message": "' + error + '" }');
    }
}

module.exports = {
    listarAsignaturas
}