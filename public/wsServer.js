let socket = new WebSocket("ws://localhost:3000")

socket.onopen = function () {
    console.log('Start')
}

socket.onclose = function (event) {
    if (event.wasClean) {
        alert('Соединение закрыто чисто')
    } else {
        alert('Обрыв соединения')
    }
    alert('Код: ' + event.code + ' причина: ' + event.reason)
}

socket.onmessage = function(event) {
    console.log("Получены данные " + event.data);
}