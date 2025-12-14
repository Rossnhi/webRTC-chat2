let form = document.getElementById('chatForm');
let messageBox = document.getElementById("messageBox");
form.addEventListener("submit", sendMessage);

let roomID = document.getElementById("roomID");
roomID.innerText = `Room ID : ${window.chatData.room}`;

let chatWindow = document.getElementById("chatWindow")

function sendMessage(e) {
    e.preventDefault(); // Prevent page reload
    if (messageBox.value.trim() != "") {
        let time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true});
        let message = {name: window.chatData.name, message: messageBox.value, timeStamp : time};
        window.chatData.messages.push(message);
        displayMessage(message);
        connection.sendToPeer(JSON.stringify(message));
    }
    messageBox.value = "";
    chatWindow.scrollTop = chatWindow.scrollHeight
}

function displayMessage(message) {
    let t = document.createTextNode(message.message);
    let li = document.createElement("li");
    li.innerHTML = `<span class="sender">${message.name}: </span><span class="timeStamp">${message.timeStamp}</span>`
    li.appendChild(t);
    let style;
    if (message.name == window.chatData.name) {
        style = "message self"
    }
    else {
        style = "message other"
    }
    li.className = style;
    chatWindow.appendChild(li);
}

// Other Message Test
// chatWindow.innerHTML += "<button id='test'>test</button>"
// let testBut = document.getElementById("test")
// testBut.addEventListener("click", sendOtherMessage)
// function sendOtherMessage() {
//     let message = {name: "Susu", message: "How about this?", timeStamp : "02:34pm"};
//     window.chatData.messages.push(message)
//     displayMessage(message);
//     handleNewMessageNotif();
// }

let notif = document.getElementById("newMessageNotif")
chatWindow.addEventListener("scroll", hideNotifIfScrolled)
function handleNewMessageNotif() {
    if (chatWindow.scrollTop + chatWindow.clientHeight < chatWindow.scrollHeight) {
        notif.style.transform = "scale(1)";
    }

    if (chatWindow.scrollTop + chatWindow.clientHeight >= 0.9 * chatWindow.scrollHeight) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
}
function hideNotifIfScrolled() {
    if (chatWindow.scrollTop + chatWindow.clientHeight >= chatWindow.scrollHeight) {
        notif.style.transform = "scale(0)";
    }
}

for (let message of window.chatData.messages) {
    displayMessage(message);
}