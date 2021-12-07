window.getCookie = (name) => {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

function regNewTalk() {
    if((new Date(document.querySelector("#date-from").value) > new Date(document.querySelector("#date-to").value)) || 
    (document.querySelector("#date-from").value == '' || 
    document.querySelector("#date-to").value == '')) {
        document.querySelector("#talk-status").innerHTML = "Недопустимый диапазон дат!";
    } else {
    document.querySelector("#talk-status").innerHTML = "Попытка зарегистрировать доклад в базе...";
    $.post(server + 'regNewTalk', 
    { 
        talkname:document.querySelector("#red-talkname").value,
        datefrom:document.querySelector("#date-from").value, 
        dateto:document.querySelector("#date-to").value,
        rkey:$("#room-select").children(":selected").attr("id"),
        dbkey:getCookie("db-key")
    })
    .then(res => {
        if(res == "Err") {
            document.querySelector("#talk-status").innerHTML = "Данный диапазон дат пересекается с существующим расписанием!";
        } else {
            show('talks');
        }
    });
}
}

function cancelTalk(key) {
    $.post(server + 'cancelTalk', {key:key})
    .then(res => {
        show('talks');
    });
}