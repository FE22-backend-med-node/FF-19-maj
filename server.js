// importera express-biblioteket för att kunna sätta upp vår webbserver
const express = require('express');
// importera produkter från json-filen
const products = require('./products.json');
// fs använder vi för att modifiera vårt filsystem
const fs = require('fs');
// import av custom middleware
const { checkContent, checkSerial } = require('./utils');

// hantering av cors:
const cors = require('cors');

// kalla på express-funktionen för att express-appen skall initieras
const app = express();
app.use(cors({ origin: '*' }));

// använda oss av json-parser så vi kan läsa datan
app.use(express.json());

// definiera en route handler som hanterar get-metod mot '/' och som returnerar alla produkter
app.get("/", (request, response) => {
    response.send(products);
});

// Kunna lägga till en produkt i en varukorg
app.post("/newproduct", checkContent, (request, response) => {
    let product = request.body;

    let serial = Math.floor(Math.random() * 99999999999999999);
    product.serial = serial;

    let products = fs.readFileSync('products.json');
    // göra om datan som vi får till data vi kan manipulera i js
    products = JSON.parse(products);
    // lägga in nya produkten överst i listan
    products.unshift(product);
    // skriva över gamla products-filen med vår nya lista med nya produkten i 
    fs.writeFileSync('products.json', JSON.stringify(products));
    response.send(products);
});

// Kunna ta bort en produkt i en varukorg
app.delete("/delete", checkSerial, (req, res) => {
    let productToDelete = req.body.serial;

    let products = fs.readFileSync('products.json');
    products = JSON.parse(products);

    let index = products.findIndex((p) => p.serial === productToDelete);
    products.splice(index, 1)

    fs.writeFileSync("products.json", JSON.stringify(products))
    res.send({ success: true, message: "Product deleted" })
});
// lägga till vald vara i cart.json

// sätta upp servern lokalt
app.listen(1337, () => console.log("ITS LIVE!! "))