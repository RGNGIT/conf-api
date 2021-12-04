function makeASpeaker(toReject, key) {
    if(toReject) {
        $.post(server + 'updateRole', {userkey:key, rolekey:2}, res => {
            show('users')
        });
    } else {
        $.post(server + 'updateRole', {userkey:key, rolekey:3}, res => {
            show('users')
        });
    }
}