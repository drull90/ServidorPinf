
let admin = require("../../firebase/firebaseAdmin");

//require('cors');

let database = admin.dataBase;

function listarAsignaturas(req, res) {
    //cors(req, res, () => {
        try { 
            //const userExRef = database.collection('expedientes'); //.doc('uuzLmnEccYAGGg61VzGr');
            //let data = await userExRef.get();
            res.send('{ "message": "ok" }');
        }
        catch(error) {
            res.send('{ "message": error }');
        }
    //})
}

module.exports = {
    listarAsignaturas
}