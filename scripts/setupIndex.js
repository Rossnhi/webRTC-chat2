let joinButton = document.getElementById("join");
joinButton.addEventListener("click", joinRoom);

let hostButton = document.getElementById("host");
hostButton.addEventListener("click", hostRoom);

let nameInp = document.getElementById("name");
let codeInp = document.getElementById("roomCode");
function joinRoom() {
    if (nameInp.value.trim() != "" && codeInp.value.trim() != "") {
        window.location.href = `chat.html?name=${encodeURIComponent(nameInp.value.trim())}&room=${encodeURIComponent(codeInp.value.trim())}&hosting=false`;
    }
    else {
        alert("Enter your name and room code first!");
    }
}

function hostRoom() {
    if (nameInp.value.trim() != "") {
        window.location.href = `chat.html?name=${encodeURIComponent(nameInp.value.trim())}&room=${encodeURIComponent(generateRoomCode())}&hosting=true`;
    }
    else {
        alert("Enter your name first!");
    }
}

// Generate random 4 letter room code
function generateRoomCode() {
    let code = "";
    for (let i = 0; i < 4; i++) {
        code += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }
    return code;
}