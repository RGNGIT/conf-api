function regNewTalk() {
    $.post(server + 'regNewTalk', 
    { 
        datefrom:document.querySelector("#date-from").value, 
        dateto:document.querySelector("#date-to").value,
        rkey:$("#room-select").children(":selected").attr("id")
    })
    .then(res => {
        if(res == "Err") {
            document.querySelector("#talk-status").innerHTML = "Данный диапазон дат пересекается с существующим расписанием!";
        }
    });
}