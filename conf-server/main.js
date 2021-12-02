const express = require("express");
const cors = require("cors");
const {queryExec} = require("./db");

const app = express();

const corsOpt = {
    origin: '*', 
    credentials: true,
    optionSuccessStatus: 200
 };

// Рабочий спейс

/*
    queryExec("SELECT * FROM role;")
    .then(result => {
        
    },
    failure => {
        
    });
*/

app.get('/doSomething', function (req, res) {
    
});



app.listen(8000, () => {
    console.log("Сервер запущен.");
});