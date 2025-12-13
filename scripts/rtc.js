const configuration = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" }
    ]
};
const pc = new RTCPeerConnection(configuration);

let statusIndicator = document.getElementById("statusIndicator");
pc.onconnectionstatechange = () => {
    console.log(pc.connectionState);
    if (pc.connectionState == "connecting") {
        statusIndicator.style.backgroundColor = "#e1cf5b";
    }
    else if (pc.connectionState == "connected") {
        statusIndicator.style.backgroundColor = "#94d350";

    }
    else {
        statusIndicator.style.backgroundColor = "#5c5c5c";
    }
}

let iceNo = 1;
pc.onicecandidate = (e) => {
    console.log(`#${iceNo} candidate`);
    iceNo += 1;
    if (e.candidate == null) {
        console.log("Ice gathering completed!");
        // signal
    }
}


// Manual signalling
let copyCodeBut = document.getElementById("copyCode");
copyCodeBut.addEventListener("click", (e) => {
    let text = JSON.stringify(JSON.stringify(pc.localDescription));
        navigator.clipboard.writeText(text)
            .then(() => console.log("Copied to clipboard:", text))
            .catch(err => console.error("Clipboard error:", err));
})

let chatChannel;

function handleMessage() {
    chatChannel.onmessage = (e) => {
        let messageData = JSON.parse(e.data);
        window.chatData.messages.push(messageData)
        displayMessage(messageData, "message other");
        handleNewMessageNotif();
    }
}

function sendToPeer(message) {
    if (chatChannel) {
        chatChannel.send(message);
    }
}

// offerer
async function generateOffer() {
    chatChannel = pc.createDataChannel("chat");
    handleMessage();

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
}

function recieveAnswer(ans) {
    pc.setRemoteDescription(JSON.parse(ans));
}

// answerer
pc.ondatachannel = (e) => {
    if(e.channel.label == "chat") {
        chatChannel = e.channel;
        handleMessage();
    }
}
async function generateAnswer(offer) {
    pc.setRemoteDescription(JSON.parse(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
}