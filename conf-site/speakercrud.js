window.getCookie = (name) => {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

function regNewTalk() {
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

function cancelTalk(key) {
    $.post(server + 'cancelTalk', {key:key})
    .then(res => {
        show('talks');
    });
}