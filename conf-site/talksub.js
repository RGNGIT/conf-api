function subscribe(userkey, schedulekey) {
    $.post(server + 'subToTalk', {userkey:userkey, schedulekey:schedulekey}, res => {
        show('main');
    });
}

function unsubscribe(userkey, schedulekey) {
    $.post(server + 'unsubToTalk', {userkey:userkey, schedulekey:schedulekey}, res => {
        show('main');
    });
}