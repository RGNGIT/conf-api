window.getCookie = (name) => {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

const server = "http://localhost:8080/";
const lloginPrompt = document.querySelector("#l-login");
const lpasswordPrompt = document.querySelector("#l-password");
const rloginPrompt = document.querySelector("#r-login");
const rpasswordPrompt = document.querySelector("#r-password");
const rnamePrompt = document.querySelector("#r-name");
const rsurnamePrompt = document.querySelector("#r-surname");
const rpatPrompt = document.querySelector("#r-pat");
const statusLine = document.querySelector("#login-status");

// Для регистрации
function regCheck() {
    $.post(server + 'checkAccount', {login:rloginPrompt.value})
    .then(res => {
        if(res == '0') {
            register();
        } else {
            statusLine.innerHTML = "Аккаунт с таким логином существует!";
        }
    });
}

function register() {
    $.post(server + 'regNewUser', {
        login:`${rloginPrompt.value}`,
        password:`${rpasswordPrompt.value}`,
        name:`${rnamePrompt.value}`,
        surname:`${rsurnamePrompt.value}`,
        patronymic:`${rpatPrompt.value}`,
        }, res => {
            console.log(res);
    });
    statusLine.innerHTML = "Зареган!";
}

// Для логина
function loginCheck() {
    $.post(server + 'checkAccount', {login:lloginPrompt.value})
    .then(res => {
        if(res != '0') {
            login();
        } else {
            statusLine.innerHTML = "Аккаунт с таким логином не существует!";
        }
    });
}

function login() {
    $.post(server + 'loginUser', {
        login:`${lloginPrompt.value}`,
        password:`${lpasswordPrompt.value}`
        }, res => {
            if(res == "LoggedIn") {
                statusLine.innerHTML = "Успешно залогинен!";
                $.get(server + `getUserData?login=${lloginPrompt.value}`, resg => {
                    document.cookie = "logged-in=true";
                    document.cookie = `login=${resg[0].Login}`;
                    document.cookie = `name=${resg[0].Name}`;
                    document.cookie = `surname=${resg[0].Surname}`;
                    document.cookie = `patronymic=${resg[0].Patronymic}`;
                    document.cookie = `role-key=${resg[0].Role_Key}`;
                    setTimeout(window.location = "index.html", 1000);
                });
            } else {
                statusLine.innerHTML = "Что-то пошло не так!";
            }
    });
}

function onLogin() {
    loginCheck();
}

function onRegister() {
    regCheck();
}