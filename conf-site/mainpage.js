window.getCookie = (name) => {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

const server = "http://localhost:8000/";
const canvas = document.querySelector("#main-canvas");
const canvasHeader = document.querySelector("#cnv-hdr");
const userTag = document.querySelector("#user-tag");
const role = getCookie("role-key");

function showTalksSpeaker() {
    canvas.innerHTML = "<p style='text-align:center;'>Загрузка докладов...</p>";

}

function showTalksSchedule(toSort) {
    canvas.innerHTML = "<p style='text-align:center;'>Загрузка расписания...</p>";
    $.get(server + `getTalkList?toSort=${toSort}`)
    .then(res => {
        let auditorium = "";
        let toAdd = "";
        for(let i of res) {
            if(i.RName != auditorium) {
                toAdd += `<h3 style="text-align:center;">Доклады в аудитории ${i.RName}</h3>`;
                auditorium = i.RName;
            }
            toAdd += 
            `<div>` +
            `<hr color="black" noshade>Доклад: ${i.TName}. Аудитория: ${i.RName}. Время проведения с ${i.DateFrom} по ${i.DateTo}.` +
            `</div>`;
            canvas.innerHTML = toAdd;
        }
    });
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
        case 'reg':
            
            break;
    }
}

function init() {
    show('main');
    if(getCookie("logged-in") == 'true') {
        let html = `Залогинен как ${getCookie("name")} ${getCookie("surname")} ${getCookie("patronymic")} | `;
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
        userTag.innerHTML = html;
    }
}

init();