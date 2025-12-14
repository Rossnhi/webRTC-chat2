let connection;
let connections = {};

const configuration = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" }
    ]
};
class Connection {
    constructor(id) {
        this.id = id;
        this.pc = new RTCPeerConnection(configuration);
        this.statusIndicator = document.getElementById("statusIndicator");
        this.pc.onconnectionstatechange = () => {
            console.log(this.pc.connectionState);
            if (this.pc.connectionState == "connecting") {
                this.statusIndicator.style.backgroundColor = "#e1cf5b";
            }
            else if (this.pc.connectionState == "connected") {
                this.statusIndicator.style.backgroundColor = "#90c417ff";
            }
            else {
                this.statusIndicator.style.backgroundColor = "#5c5c5c";
            }
        }
        // answerer
        this.pc.ondatachannel = (e) => {
            if (e.channel.label == "chat") {
                this.chatChannel = e.channel;
                this.handleMessage();
            }
        }
        this.chatChannel;
    }

    gatherIce() {
        return new Promise((resolve) => {
            if (this.pc.iceGatheringState == "complete") {
                resolve();
            }
            else {
                this.pc.addEventListener("icegatheringstatechange", function onIceStateChange() {
                    if (this.iceGatheringState == "complete") {
                        this.removeEventListener("icegatheringstatechange", onIceStateChange);
                        resolve();
                    }
                });
            }
        });
    }

    handleMessage() {
        this.chatChannel.onmessage = (e) => {
            let message = JSON.parse(e.data);
            window.chatData.messages.push(message);
            displayMessage(message, "message other");
            handleNewMessageNotif();
            if (window.chatData.hosting) {
                for (let connectionKey in connections) {
                    if(connectionKey != this.id) {
                        connections[connectionKey].sendToPeer(JSON.stringify(message));
                    }
                }
            }
        }
    }

    sendToPeer(message) {
        if (this.chatChannel) {
            this.chatChannel.send(message);
        }
    }

    // offerer
    async generateOffer() {
        this.chatChannel = this.pc.createDataChannel("chat");
        this.handleMessage();
        // pingChannel = pc.createDataChannel("ping", { ordered: false, maxRetransmits: 0 });
        //handlePing();

        const offer = await this.pc.createOffer();
        await this.pc.setLocalDescription(offer);

        await this.gatherIce();
        return this.pc.localDescription;
    }

    recieveAnswer(ans) {
        this.pc.setRemoteDescription(JSON.parse(ans));
    }

    async generateAnswer(offer) {
        this.pc.setRemoteDescription(JSON.parse(offer));
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);

        await this.gatherIce();
        return this.pc.localDescription;
    }
}
