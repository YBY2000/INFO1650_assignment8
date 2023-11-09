// db.js
// connect to mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/userDB', { useNewUrlParser: true }); 
mongoose.connection
.once("open", () => console.log('Connected')) 
.on("error", error => {
    console.log("MongoDB Error: " + error);
})