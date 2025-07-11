let form = document.getElementById('chatForm');
let messageBox = document.getElementById("messageBox");
form.addEventListener("submit", sendMessage);

let chatWindow = document.getElementById("chatWindow")

function sendMessage(e) {
    e.preventDefault(); // Prevent page reload
    if (messageBox.value.trim() != "") {
        let message = {name: window.chatData.name, message: messageBox.value};
        window.chatData.messages.push(message);
        displayMessage(message.message, message.name, "message self");
        sendToPeer(JSON.stringify(message));
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

// chatWindow.innerHTML += "<button id='test'>test</button>"
// let testBut = document.getElementById("test")
// testBut.addEventListener("click", sendOtherMessage)
// function sendOtherMessage() {
//     window.messages.push({name: "Susu", message: "How about this?"})
//     displayMessage("how about this?", "Susu", "message other");
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