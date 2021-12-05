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
    queryExec("SELECT *, user.Key, user.Name, role.Name AS RName FROM user, role WHERE Role_Key = role.Key;")
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

app.get('/getUserDataByKey', function (req, res) {
    queryExec(`SELECT * FROM user WHERE (user.Key='${req.query.key}');`)
    .then(result => {
        res.json(result);
    });
});


app.get('/getUserDataByLogin', function (req, res) {
    queryExec(`SELECT * FROM user WHERE (Login='${req.query.login}');`)
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

app.post('/updateRole', function (req, res) {
    queryExec(`UPDATE user SET Role_Key = ${req.body.rolekey} WHERE user.Key = ${req.body.userkey};`)
    .then(result =>{
        res.send(result);
    });
});

app.post('/deleteUser', function (req, res) {
    queryExec(`DELETE FROM user WHERE user.Key = ${req.body.key};`)
    .then(result => {
        res.send(result);
    });
});

app.post('/updateUser', function (req, res) {
    queryExec(`UPDATE user SET Name = '${req.body.name}', Surname = '${req.body.surname}', Patronymic = '${req.body.patronymic}', Login = '${req.body.login}', Role_Key = ${req.body.rolekey} WHERE user.Key = ${req.body.userkey};`)
    .then(result => {
        res.send(result);
    });
});

app.listen(8080, () => {
    console.log("Сервер запущен.");
});