const express = require("express");
const cors = require("cors");
const path = require("path");
const {queryExec} = require("./db");

const app = express();

const corsOpt = {
    origin: '*', 
    credentials: true,
    optionSuccessStatus: 200
 };

// Сет директории фронта
const static_path = path.join(__dirname, "../conf-site");
app.use(express.static(static_path));
app.use(express.urlencoded({ extended: true }));

// Рабочий спейс

// Запросы на получить чето
// Получение списка ролей
app.get('/getRoleList', function (req, res) {
    queryExec("SELECT * FROM role;")
    .then(result => {
        res.json(result);
    },
    failure => {
        res.send(failure);
    });
});
// Получение списка пользователей
app.get('/getUserList', function (req, res) {
    queryExec("SELECT * FROM user;")
    .then(result => {
        res.json(result);
    },
    failure => {
        res.send(failure);
    });
});
// Получение списка докладов (параметр toSort отсортированый по аудиториям если true, иначе просто список как есть в базе)
app.get('/getTalkList', function (req, res) {
    if(req.query.toSort == "true") {
        queryExec("SELECT talk.Name AS TName, DateFrom, DateTo, room.Name AS RName FROM schedule, talk, room WHERE (room.Key = Room_Key AND talk.Key = Talk_Key) ORDER BY RName;")
        .then(result => {
        res.json(result);
    });
    } else {
        queryExec("SELECT talk.Name AS TName, DateFrom, DateTo, room.Name AS RName FROM schedule, talk, room WHERE (room.Key = Room_Key AND talk.Key = Talk_Key);")
        .then(result => {
            res.json(result);
    });
    }
});

// Запросы на добавить чето
app.post('', () => {
    
});

app.listen(8000, () => {
    console.log("Сервер запущен.");
});