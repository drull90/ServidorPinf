
let admin = require("../../firebase/firebaseAdmin");

let database = admin.dataBase;
let fireAuth = admin.firebaseAdminAuth;

async function listarAsignaturas(req, res) {
    try {

        // let token = admin.getUserToken(req);
        // let user = await firebaseAdminAuth.verifyIdToken(token);
        
        // let uuid = user.uuid;

        let uuid = "HPLZSWQI";

        const matricula = database.collection('matricula').doc('HPLZSWQI');
        let data = await matricula.get();

        console.log(data.data());

        res.send('{ "message": "ok" }');
    }
    catch(error) {
        res.send('{ "message": "' + error + '" }');
    }
}

module.exports = {
    listarAsignaturas
}