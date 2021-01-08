
let admin = require("../../firebase/firebaseAdmin");

let database = admin.dataBase;

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

module.exports = {
    listarAsignaturas,
    changeUserStatus
}