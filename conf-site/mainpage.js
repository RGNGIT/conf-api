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
                `<hr color="black" noshade>ФИО: ${i.Surname} ${i.Name} ${i.Patronymic} | ${i.RName}.` +
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
        canvas.innerHTML = "<p style='text-align:center;'>Загрузка докладов...</p>";
    }
    else {
        canvas.innerHTML = "<p style='text-align:center;'>Извините, но доступ к докладам имеет только докладчик.</p>";
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

function regButtonAction() {
    if(getCookie("logged-in") == 'true') {
        document.cookie = "logged-in=false";
        document.cookie = `login=`;
        document.cookie = `name=`;
        document.cookie = `surname=`;
        document.cookie = `patronymic=`;
        document.cookie = `role-key=`;
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
            showTalksSchedule(true);
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
        let html = `Залогинен как ${getCookie("surname")} ${getCookie("name")} ${getCookie("patronymic")} | `;
        switch(role) {
            case '1':
                html += "Админ";
                break;
            case '2':
                html += "Слушатель";
                break;
            case '3':
                html += "Спикер";
                break;
        }
        userTag.innerHTML = html + " | Выйти из аккаунта";
    }
}

init();