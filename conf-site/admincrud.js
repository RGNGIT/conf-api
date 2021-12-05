function deleteUser(id) {
    $.post(server + 'deleteUser', {key:id}, res => {
        show('users');
    });
}

function apply(key, isAdmin) {
    $.post(server + 'updateUser', {
        name:document.querySelector("#red-name").value,
        surname:document.querySelector("#red-surname").value,
        patronymic:document.querySelector("#red-pat").value,
        login:document.querySelector("#red-login").value,
        rolekey: !isAdmin ? (document.querySelector("#red-role").value == "Слушатель" ? 2 : 3) : 1,
        userkey:key
    }, res => {
        show('users');
    });
}

function redactUser(key, context) {
    $.get(server + `getUserDataByKey?key=${key}`, res => {
        context.innerHTML = "<form><p style='text-align:center'>Редактирование<p>" +
        `<p><input class='news-input' type='text' id='red-surname' placeholder='Фамилия' value='${res[0].Surname}' size='18'/></p>` +
        `<p><input class='news-input' type='text' id='red-name' placeholder='Имя' value='${res[0].Name}' size='18'/></p>` +
        `<p><input class='news-input' type='text' id='red-pat' placeholder='Отчество' value='${res[0].Patronymic}' size='18'/></p>` +
        `<p><input class='news-input' type='text' id='red-login' placeholder='Логин' value='${res[0].Login}' size='18' /></p>` +
        (res[0].Role_Key != 1 ? (`<select class='news-input' id='red-role'><option>Слушатель</option><option>Спикер</option></select><p></p>`) : '<p style="text-align:center">Роль админа изменить может только бог!<p>') +
        `</form><div style='text-align: center;'><button class='inline-btn' onclick='apply(${key}, ${res[0].Role_Key == 1 ? true : false})'>Применить</button></div>`;
    });
}