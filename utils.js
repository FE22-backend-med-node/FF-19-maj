// skapa middleware som kollar om det som användaren skickat in är 
// i enlighet med vad vi förväntar oss
const fs = require("fs");

function checkContent(request, response, next) {
    const productToAdd = request.body;
    if (productToAdd.hasOwnProperty('title') && productToAdd.hasOwnProperty('price')) {
        next();
    } else {
        const result = {
            success: false,
            error: 'Misses vital data in body'
        }
        response.status(400).json(result);
    }
};

function checkSerial(req, res, next) {
    const serial = req.body.serial;

    let products = fs.readFileSync("products.json");

    products = JSON.parse(products);

    let index = products.findIndex((product) => product.serial === serial)
    if (index > -1) {
        next()
    } else {
        const result = {
            success: false,
            error: 'No product with this serial number exists'
        }
        res.status(400).json(result);
    }

}

// skapa middleware för att kolla så att inga konstiga tecken är medi användarnamnet

module.exports = { checkContent, checkSerial }