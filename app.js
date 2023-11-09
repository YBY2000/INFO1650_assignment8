// app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const User = require('./app/models/User');
const routes = require('./app/routes/routes');
const bcrypt = require('bcrypt'); 
const port = 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

routes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
