const express = require("express");
const cors = require("cors");
const path = require("path");
const {queryExec} = require("./db");
const {MD5Encrypt} = require("./encrypt");

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

app.get('/getUserData', function (req, res) {
    queryExec(`SELECT * FROM user WHERE Login='${req.query.login}';`)
    .then(result => {
        res.json(result);
    });
});

// Посты
app.post('/regNewUser', function (req, res) {
    queryExec(`INSERT INTO user (Name, Surname, Patronymic, Login, Password, Role_Key) VALUES ('${req.body.name}', '${req.body.surname}', '${req.body.patronymic}', '${req.body.login}', '${MD5Encrypt(req.body.password)}', 2);`)
    .then(suc => {
        res.send("Done");
    },
    err => {
        res.send("Err");
    });
});

app.post('/loginUser', function (req, res) {
    queryExec(`SELECT * FROM user WHERE Login = '${req.body.login}';`)
    .then(result => {
        if(MD5Encrypt(req.body.password) == result[0].Password) {
            res.send("LoggedIn");
        } else {
            res.send("Err");
        }
    });
});

app.post('/checkAccount', function (req, res) {
    queryExec(`SELECT * FROM user WHERE Login = '${req.body.login}';`)
    .then(result => {
        res.send(`${result.length}`);
    });
});

app.listen(8000, () => {
    console.log("Сервер запущен.");
});