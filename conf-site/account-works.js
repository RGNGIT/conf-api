const server = "http://localhost:8000/";
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