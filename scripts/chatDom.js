let form = document.getElementById('chatForm');
let messageBox = document.getElementById("messageBox");
form.addEventListener("submit", sendMessage);

let chatWindow = document.getElementById("chatWindow")

function sendMessage(e) {
    e.preventDefault(); // Prevent page reload
    if (messageBox.value.trim() != "") {
        displayMessage(messageBox.value, window.name, "message self");
    }
    messageBox.value = "";
    chatWindow.scrollTop = chatWindow.scrollHeight
}

function displayMessage(message, name,  style) {
    let t = document.createTextNode(message);
    let li = document.createElement("li");
    let time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true});
    li.innerHTML = `<span class="sender">${name}: </span><span class="timeStamp">${time}</span>`
    li.appendChild(t);

    li.className = style
    chatWindow.appendChild(li);
}

