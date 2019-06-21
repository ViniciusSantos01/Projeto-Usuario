//Para criar un servidor
const express = require("express");
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

/*
let routesIndex = require('./routes/index');
let routesUsers = require('./routes/users');

como utilizar as rotas
app.use(routesIndex);
app.use('/users', routesUsers);
*/

let app = express();

app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(expressValidator());

//para incluir as rotas no app
consign().include('routes').include('utils').into(app);

app.listen(4000, '127.0.0.1', () => {

    console.log('Servidor rodando!');

});