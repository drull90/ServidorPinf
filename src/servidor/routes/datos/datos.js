'use strict'

const data = [
    {
        a: "a",
        b: "b"
    },
    {
        a: "b",
        b: "c"
    },
    {
        a: "c",
        b: "d"
    }
];

function getDatos(req, res) {
    try {
        res.status(200).send(data);
    }
    catch(error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    getDatos
};