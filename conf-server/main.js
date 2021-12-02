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

// Запросы на получить чето
app.get('/getRoleList', function (req, res) {
    queryExec("SELECT * FROM role;")
    .then(result => {
        res.json(result);
    },
    failure => {
        res.send(failure);
    });
});

app.get('/getUserList', function (req, res) {
    queryExec("SELECT * FROM user;")
    .then(result => {
        res.json(result);
    },
    failure => {
        res.send(failure);
    });
});

app.get('/getTalkList', function (req, res) {
    queryExec("SELECT (talk.Name, Date, room.Name) FROM talk, schedule, room WHERE (room.Key = Room_Key AND talk.Key = Talk_Key);")
    .then(result => {
        if(req.query.toSort == "true") {
            res.send("Тут ща отсортирую");
        } else {
            res.json(result);
        }
    },
    failure => {
        res.send(failure);
    });
});

// Запросы на добавить чето


app.listen(8000, () => {
    console.log("Сервер запущен.");
});