const express = require("express");
const cors = require("cors");
const path = require("path");
const nm = require("nodemailer");
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

function generateRandom() {
    return Math.floor(100000 + Math.random() * 900000);
}

async function confirmEmail(code, email, userbox) {
    let transporter = nm.createTransport({
        sendmail: true,
        newline: 'unix',
        path: '/usr/sbin/sendmail'
    });
    let info = await transporter.sendMail({
        from: 'Conference',
        to: email,
        subject: "Подтверждение регистрации на конференции",
        text: `Код для подтверждения регистрации: ${code}`,
        html: `<h1>Здравстуйте, господин ${userbox.surname} ${userbox.name} ${userbox.pat}. Ваш код для подтверждения регистрации: <br>${code}</h1>`,
    });
    console.log(`Отправлено письмо подтверждения: ${info.messageId}`);
    return MD5Encrypt(`${code}`);
}

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
        queryExec("SELECT schedule.Key, talk.Name AS TName, DateFrom, DateTo, room.Name AS RName FROM schedule, talk, room WHERE (room.Key = Room_Key AND talk.Key = Talk_Key) ORDER BY RName;")
        .then(result => {
        res.json(result);
    });
    } else {
        queryExec("SELECT schedule.Key, talk.Name AS TName, DateFrom, DateTo, room.Name AS RName FROM schedule, talk, room WHERE (room.Key = Room_Key AND talk.Key = Talk_Key);")
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
    queryExec(`SELECT *, role.Alt_Name AS RAlt, user.Key AS UKey, role.Key AS RKey, user.Name as UName FROM user, role WHERE (Login='${req.query.login}' AND role.Key = user.Role_Key);`)
    .then(result => {
        res.json(result);
    });
});

app.get('/getUserSubs', function (req, res) {
    queryExec(`SELECT schedule.Key AS SKey, talk.Name AS TName, schedule.DateFrom, schedule.DateTo, room.Name AS RName FROM talk, schedule, room, user, user_sub WHERE schedule.Room_Key = room.Key AND schedule.Talk_Key = talk.Key AND user_sub.User_Key = user.Key AND schedule.Key = user_sub.Schedule_Key AND user.Key = ${req.query.userkey};`)
    .then(result => {
        res.json(result);
    });
});

app.get('/getSpeakerTalks', function (req, res) {
    queryExec(`SELECT schedule.Key AS SKey, talk.Name AS TName, schedule.DateFrom, schedule.DateTo, room.Name AS RName FROM talk, schedule, room, user, user_talk WHERE schedule.Room_Key = room.Key AND schedule.Talk_Key = talk.Key AND user_talk.User_Key = user.Key AND schedule.Key = user_talk.Schedule_Key AND user.Key = ${req.query.userkey};`)
    .then(result => {
        res.json(result);
    });
});

app.get('/getRoomList', function (req, res) {
    queryExec("SELECT * FROM room;")
    .then(result => {
        res.json(result);
    });
});

app.get('/getScheduleTimes', function (req, res) {
    queryExec("SELECT DateFrom, DateTo FROM schedule;")
    .then(result => {
        res.json(result);
    });
});

// Посты
app.post('/regNewUser', function (req, res) {
    queryExec(`INSERT INTO user (Name, Surname, Patronymic, Login, Password, Email, Role_Key) VALUES ('${req.body.name}', '${req.body.surname}', '${req.body.patronymic}', '${req.body.login}', '${MD5Encrypt(req.body.password)}', '${req.body.email}', 2);`)
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
    queryExec(`UPDATE user SET Name = '${req.body.name}', Surname = '${req.body.surname}', Patronymic = '${req.body.patronymic}', Login = '${req.body.login}', Email = '${req.body.email}', Role_Key = ${req.body.rolekey} WHERE user.Key = ${req.body.userkey};`)
    .then(result => {
        res.send(result);
    });
});

app.post('/subToTalk', function (req, res) {
    queryExec(`INSERT INTO user_sub (User_Key, Schedule_Key) VALUES (${req.body.userkey}, ${req.body.schedulekey});`)
    .then(result => {
        res.send(result);
    });
});

app.post('/unsubToTalk', function (req, res) {
    queryExec(`DELETE FROM user_sub WHERE (User_Key = ${req.body.userkey} AND Schedule_Key = ${req.body.schedulekey});`)
    .then(result => {
        res.send(result);
    });
});

app.post('/cancelTalk', function (req, res) {
    queryExec(`DELETE FROM schedule WHERE schedule.Key = ${req.body.key};`)
    .then(result => {
        res.send(result);
    });
});

app.post('/regNewTalk', function (req, res) {
    queryExec(`SELECT * FROM schedule, room WHERE ((CONVERT('${req.body.datefrom}', DATETIME) <= schedule.DateTo) AND (CONVERT('${req.body.dateto}', DATETIME) >= schedule.DateFrom) AND Room_Key = ${req.body.rkey});`)
    .then(result => {
        if(result.length > 0) {
            res.send("Err");
        } else {
            queryExec(`SELECT talk.Key FROM talk WHERE talk.Name = '${req.body.talkname}';`)
            .then(result1 => {
                if(result1.length == 0) {
                    queryExec(`INSERT INTO talk (Name) VALUES ('${req.body.talkname}');`)
                    .then(res1 => {
                        queryExec("SELECT talk.Key FROM talk;").then(result2 => {
                        queryExec(`INSERT INTO schedule (DateFrom, DateTo, Talk_Key, Room_Key) VALUES ('${req.body.datefrom}', '${req.body.dateto}', ${result2[result2.length - 1].Key}, ${req.body.rkey});`)
                        .then(res3 => {
                            queryExec("SELECT schedule.Key FROM schedule;").then(result3 => {
                            queryExec(`INSERT INTO user_talk (User_Key, Schedule_Key) VALUES (${req.body.dbkey}, ${result3[result3.length - 1].Key});`)
                            .then(final => res.send(final));
                        });
                        });
                    });
                    });
                } else {
                    queryExec(`INSERT INTO schedule (DateFrom, DateTo, Talk_Key, Room_Key) VALUES ('${req.body.datefrom}', '${req.body.dateto}', ${result1[0].Key}, ${req.body.rkey});`)
                    .then(res2 => {
                        queryExec("SELECT schedule.Key FROM schedule;").then(result2 => {
                        queryExec(`INSERT INTO user_talk (User_Key, Schedule_Key) VALUES (${req.body.dbkey}, ${result2[result2.length - 1].Key});`)
                        .then(final => res.send(final));
                    });
                  });
                }
            });
        }
    });
});

app.post('/confirmEmail', (req, res) => {
        confirmEmail(generateRandom(), req.body.email, req.body.userbox).then(result => {
            console.log(`Сгенерированый хеш: ${result}`);
            res.send(result);
        });
});

app.post('/confirmCode', (req, res) => {
    if(req.body.code == MD5Encrypt(req.body.entry)) {
        res.send("Ok");
    } else {
        res.send("Err");
    }
});

app.listen(8000, () => {
    console.log("Сервер запущен.");
});