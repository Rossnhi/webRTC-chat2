let joinButton = document.getElementById("join");
joinButton.addEventListener("click", joinRoom);

let hostButton = document.getElementById("host");
hostButton.addEventListener("click", hostRoom);

let nameInp = document.getElementById("name");
function joinRoom() {
    if (nameInp.value.trim() != "") {
        window.name = nameInp.value.trim();
        window.location.href = "chat.html";
    }
    else {
        alert("Enter your name and room code first!");
    }
}

function hostRoom() {
    if (nameInp.value.trim() != "") {

    }
}

