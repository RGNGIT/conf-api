window.getCookie = (name) => {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

const server = "http://localhost:8080/";
const canvas = document.querySelector("#main-canvas");
const canvasHeader = document.querySelector("#cnv-hdr");
const userTag = document.querySelector("#user-tag");
const role = getCookie("role-key");

function showUsers() {
    if(role == '1') {
        canvas.innerHTML = "<p style='text-align:center;'>Загрузка пользователей...</p>";
        $.get(server + 'getUserList', (res) => {
            let userRole = "";
            let toAdd = "";
            let id = 0;
            for(let i of res) {
                if(i.RName != userRole) {
                    toAdd += `<h3 style="text-align:center;">Роль ${i.RName}</h3>`;
                    userRole = i.RName;
                }
                toAdd += 
                `<div id='user-${i.Key}''>` +
                `<hr color="black" noshade>ФИО: ${i.Surname} ${i.Name} ${i.Patronymic} | ${i.Alt_Name}.` +
                `<button id='${i.Key}' style='float:right;' onclick='deleteUser(id)'>Удалить</button>` +
                `<button id='${i.Key}' style='float:right;' onclick='redactUser(id, document.querySelector("#redact-" + id))'>Редактировать</button>` +
                `<div id='redact-${i.Key}'></div>` +
                `</div>`;
                id++;
            }
            canvas.innerHTML = toAdd;
        });
    }
    else {
        canvas.innerHTML = "<p style='text-align:center;'>Извините, но доступ к списку пользователей имеет только администратор.</p>";
    }
}

function showTalksSpeaker() {
    if(role == '3') {
        $.get(server + 'getRoomList')
        .then(result => {
            canvas.innerHTML = "<form><p style='text-align:center'>Регистрация доклада<p>" +
            `<p><input class='news-input' type='text' id='red-surname' placeholder='Название' size='18'/></p>` + 
            `<select class='news-input' id='room-select'></select><p></p>` +
            `<div class='datetime-input'>С <input id='date-from' type='datetime-local'></input> по <input id='date-to' type='datetime-local'></input></div>` +
            `<p style='text-align:center;' id='talk-status'></p>` +
            `</form><div style='text-align: center;'><button class='inline-btn' onclick='regNewTalk()'>Зарегистрировать</button></div>`;
            canvas.innerHTML += "<hr color='black' noshade><div id='talk-list'><p style='text-align:center;'>Загрузка докладов...</p></div>";
            let list = document.querySelector("#talk-list");
            for(let i of result) {
                document.querySelector("#room-select").innerHTML += `<option id='${i.Key}'>${i.Name}</option>`;
            }
        $.get(server + `getSpeakerTalks?userkey=${getCookie("db-key")}`)
        .then(res => {
            let toAdd = "";
            if(res.length == 0) {
                toAdd = "<p style='text-align:center;'>Вы не зарегистрировали ни одного доклада!</p>";
            }
            for(let i of res) {
                toAdd += `<hr color="black" noshade>Доклад: ${i.TName}. Аудитория: ${i.RName}. Время проведения с ${i.DateFrom} по ${i.DateTo}.`;
            }
            list.innerHTML = toAdd;
        });
    });
    }
    else {
        list.innerHTML = "<p style='text-align:center;'>Извините, но доступ к докладам имеет только спикер.</p>";
    }
}

function showTalksSchedule(toSort) {
    canvas.innerHTML = "<p style='text-align:center;'>Загрузка расписания...</p>";
    let id = 0;
    let toAdd = "";
    let ignore = [];
    $.get(server + `getUserSubs?userkey=${getCookie("db-key")}`)
    .then(res => {
        if(res.length > 0) {
            toAdd += `<h3 style="text-align:center;">Доклады, на которые вы подписаны</h3>`;
            for(let i of res) {
                toAdd += 
                `<div id='talk-${id}''>` +
                `<hr color="black" noshade>Доклад: ${i.TName}. Аудитория: ${i.RName}. Время проведения с ${i.DateFrom} по ${i.DateTo}.` +
                `<button id='${i.SKey}' style='float:right;' onclick='unsubscribe(${getCookie("db-key")}, id)'>${"Отписаться"}</button>` +
                `</div>`;
                ignore.push(i.SKey);
            }
        }
    $.get(server + `getTalkList?toSort=${toSort}`)
    .then(resg => {
        let auditorium = "";
        if(resg.length == 0) {
            toAdd = "<p style='text-align:center;'>Нет ни одного доклада!</p>";
        }
        for(let i of resg) {
            if(!ignore.includes(i.Key)) {
            if(i.RName != auditorium) {
                toAdd += `<h3 style="text-align:center;">Доклады в аудитории ${i.RName}</h3>`;
                auditorium = i.RName;
            }
            toAdd += 
            `<div id='talk-${id}''>` +
            `<hr color="black" noshade>Доклад: ${i.TName}. Аудитория: ${i.RName}. Время проведения с ${i.DateFrom} по ${i.DateTo}.` +
            `<button id='${i.Key}' style='float:right;' onclick='subscribe(${getCookie("db-key")}, id)'>${"Подписаться"}</button>` +
            `</div>`;
            id++;
        }
        }
        canvas.innerHTML = toAdd;
    });
});
}

function showTalksScheduleLogout(toSort) {
    canvas.innerHTML = "<p style='text-align:center;'>Загрузка расписания...</p>";
    let id = 0;
    let toAdd = "";
    $.get(server + `getTalkList?toSort=${toSort}`)
    .then(resg => {
        let auditorium = "";
        if(resg.length == 0) {
            toAdd = "<p style='text-align:center;'>Нет ни одного доклада!</p>";
        }
        for(let i of resg) {
            if(i.RName != auditorium) {
                toAdd += `<h3 style="text-align:center;">Доклады в аудитории ${i.RName}</h3>`;
                auditorium = i.RName;
            }
            toAdd += 
            `<div id='talk-${id}''>` +
            `<hr color="black" noshade>Доклад: ${i.TName}. Аудитория: ${i.RName}. Время проведения с ${i.DateFrom} по ${i.DateTo}.` +
            `</div>`;
            id++;
        }
        canvas.innerHTML = toAdd;
    });
}

function regButtonAction() {
    if(getCookie("logged-in") == 'true') {
        document.cookie = "logged-in=false";
        document.cookie = `login=`;
        document.cookie = `name=`;
        document.cookie = `surname=`;
        document.cookie = `patronymic=`;
        document.cookie = `role-key=`;
        document.cookie = `role-alt-name=`;
        document.cookie = `db-key=`;
        location.reload();
    } else {
        window.location = "login.html";
    }
}

function show(toShow) {
    switch(toShow) {
        case 'main':
            canvasHeader.innerHTML = "Главная. Расписание";
            getCookie("logged-in") == "true" ? showTalksSchedule(true) : showTalksScheduleLogout(true);
            break;
        case 'talks':
            canvasHeader.innerHTML = "Доклады";
            showTalksSpeaker();
            break;
        case 'users':
            canvasHeader.innerHTML = "Список пользователей";
            showUsers();
            break;
        case 'reg':
            regButtonAction();
            break;
    }
}

function init() {
    show('main');
    if(getCookie("logged-in") == 'true') {
        userTag.innerHTML = `Залогинен как ${getCookie("surname")} ${getCookie("name")} ${getCookie("patronymic")} | ${getCookie("role-alt-name")} | Выйти из аккаунта`;
    }
}

init();