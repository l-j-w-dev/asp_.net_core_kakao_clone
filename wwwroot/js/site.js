var connection = new signalR.HubConnectionBuilder().withUrl("/Hub").build();
window.onload = function () {
    
}
connection.start().then(function () {
    
})
connection.on('Enter', function (nick, color) {
    var n = document.createElement('input');
    n.type = 'hidden';
    n.id = 'name';
    n.value = nick;
    document.querySelector('.profile').style.backgroundColor = color;
    document.querySelector('.profile').innerHTML = nick.substr(0, 2);
    document.getElementById('container').appendChild(n);
    document.querySelector('#top td').innerHTML = nick + ") " + document.querySelector('#top td').innerHTML;
})

connection.on('EnterAlert', function (who) {
    var al = document.createElement('div');
    al.className = 'alert';
    al.innerHTML = who + '님이 들어왔습니다.'
    document.getElementById('chat').appendChild(al);
    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
})

connection.on('ExitAlert', function (who) {
    var al = document.createElement('div');
    al.className = 'alert';
    al.innerHTML = who + '님이 나갔습니다.'
    document.getElementById('chat').appendChild(al);
    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
})
connection.on('Counter', function (num) {
    document.querySelectorAll("td")[1].innerHTML = "(" + num + ")";
})

connection.on('RecvChat', function (user, message, color, time) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var wrap = document.createElement('div');
    if (document.querySelector('#name').value == user) {
        wrap.className = 'chatWrap _mine';
    } else {
        wrap.className = 'chatWrap';
    }
    
    var div = document.createElement('div');
    div.className = 'msg_color';
    div.style.backgroundColor = color;
    div.innerHTML = user.substr(0, 2);
    var append = "<tr><td class='msg_user'>" + user + "<td></td></tr><tr><td class='msg_content _ori'>" + message + "</td><td class='msg_time'>" + time + "</td></tr>";
    var table = document.createElement('table');
    table.className = 'chatBox';
    table.setAttribute('name', user);
    table.innerHTML = append;
    if (document.querySelectorAll('.chatBox').length > 0) {
        var last = document.querySelectorAll('.chatBox')[document.querySelectorAll('.chatBox').length - 1];
        if (last.getAttribute('name') == user && time == document.querySelectorAll('.chatBox')[document.querySelectorAll('.chatBox').length - 1].querySelectorAll('.msg_time')[0].innerHTML) {
            document.querySelectorAll('.chatBox')[document.querySelectorAll('.chatBox').length - 1].querySelectorAll('.msg_time')[0].innerHTML = '';
            div.className = 'msg_add';
            table.className = 'chatBox _add';
            table.innerHTML = "<tr><td class='msg_user _add'><td></td></tr><tr><td class='msg_content'>" + msg + "</td><td class='msg_time'>" + time + "</td></tr>";
        }
    }
    if (document.querySelector('#name').value != user) {
        wrap.appendChild(div);
    } else {
        var pass = false;
        if (document.querySelectorAll('.chatBox').length > 0) {
            var last = document.querySelectorAll('.chatBox')[document.querySelectorAll('.chatBox').length - 1];
            if (last.getAttribute('name') == user) {
                table.innerHTML = "<tr><td class='msg_user _add'><td></td></tr><tr><td class='msg_time'>" + time + "</td><td class='msg_content'>" + msg + "</td></tr>";
                pass = true;
            }
        }
        if(!pass)
            table.innerHTML = "<tr><td class='msg_user _add'><td></td></tr><tr><td class='msg_time'>" + time + "</td><td class='msg_content _ori'>" + msg + "</td></tr>";
    }
    wrap.appendChild(table);
    document.getElementById('chat').appendChild(wrap);
    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight
})
const bottomHeight = document.getElementById('bottom').scrollHeight;
document.getElementById('chatarea').addEventListener('input', function (e) {
    const target = e.target;
    console.log(target.offsetHeight)
    
    document.querySelector('.btnSend').disabled = target.value.length != 0 ? false : true;

    target.style.height = '57px';
    target.style.height = (target.scrollHeight) + 'px';
    if (target.offsetHeight >= 57) {
        document.getElementById('bottom').style.height = (bottomHeight + (target.scrollHeight) - 57) + 'px'
    }
})

function setOpacity(obj) {
    document.querySelector('html').style.opacity = obj.value / 100;
}

document.getElementById('chatarea').addEventListener('keydown', function (e) {
    if (e.keyCode == 13 && !e.shiftKey) {
        var filter = "win16|win32|win64|mac";
        if (navigator.platform) {
            if (filter.indexOf(navigator.platform.toLowerCase()) >= 0) {
                sendChat();
                e.preventDefault();
            }
        }
    }
})

function sendChat() {
    target = document.getElementById('chatarea');
    if (!document.querySelector('.btnSend').disabled && target.value.length > 0) {
        connection.invoke('SendChat', target.value);
        target.value = "";
        target.style.height = '57px';
        document.querySelector('.btnSend').disabled = true;
        document.getElementById('bottom').style.height = bottomHeight + 'px';
        document.getElementById('chatarea').focus();
    }
}

document.querySelector('.like').addEventListener('click', function (e) {
    httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', location.origin + "/Home/Like", true);
    httpRequest.send(null);
    setTimeout(function () {
        var heart = document.querySelector('.like');
        if (heart.className == 'like fa fa-heart') {
            heart.className = 'like fa fa-heart-o';
            heart.title = '좋아요';
        } else {
            heart.className = 'like fa fa-heart';
            heart.title = '좋아요 취소';
        }
        connection.invoke('Like');
    }, 100);
})
connection.on('Like', function (num) {
    document.querySelector('.like').innerHTML = " " + num;
})
