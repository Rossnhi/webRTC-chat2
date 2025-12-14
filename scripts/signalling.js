const db = firebase.firestore();
let roomRef = db.collection("rooms").doc(window.chatData.room);
const peersRef = roomRef.collection("peers");
let hostName = document.getElementById("hostName");

async function handleSignalling() {
    if(window.chatData.hosting) {
        hostName.innerText = `Host: ${window.chatData.name}`;
        roomRef.set({
            hostName : window.chatData.name,
            hostID : window.chatData.id,
        });

        peersRef.onSnapshot(async (snapshot) => {
            for (const change of snapshot.docChanges()) {
                const peerData = change.doc.data();
                const peerId = change.doc.id;

                if (change.type === "added") {
                    connections[peerId] = new Connection(peerId, peerData.name);
                }
                else if (change.type === "modified") {
                    if (!connections[peerId]) {
                        connections[peerId] = new Connection(peerId, peerData.name);
                    }
                    if(peerData.status == "offered" && !peerData.answer) {
                        change.doc.ref.update({
                            status : "answered",
                            answer : JSON.stringify(await connections[peerId].generateAnswer(peerData.offer))
                        });
                    }
                }
            };
        });
    }
    else {
        const docSnap = await roomRef.get();
        if(!docSnap.exists) {
            alert("Room does not exist. Please enter a valid room ID.");
            window.location.href = "index.html";
        }else {
            hostName.innerText = `Host: ${docSnap.data().hostName}`;

            // Display peers connection status in sidebar
            peersRef.onSnapshot(async (snapshot) => {
                for (const change of snapshot.docChanges()) {
                    const peerData = change.doc.data();
                    const peerId = change.doc.id;
                    if (peerId === window.chatData.id) continue;
                    let indicator = document.getElementById("statusIndicator-" + peerId);
                    if (!indicator && peerId !== window.chatData.id) {
                        createStatusIndicator(peerId, peerData.name, peerData.connectionState);
                        indicator = document.getElementById("statusIndicator-" + peerId);
                    }
                    applyColor(indicator, peerData.connectionState);
                };
            });


            connection = new Connection(window.chatData.id, docSnap.data().hostName);
            const peerRef = peersRef.doc(window.chatData.id);

            peerRef.set({
                name : window.chatData.name,
                status : "offer pending",
                connectionState : connection.pc.connectionState
            });

            peerRef.update({
                status : "offered",
                offer : JSON.stringify(await connection.generateOffer())
            });

            peerRef.onSnapshot(async (doc) => {
                let peerData = doc.data();
                if(peerData.status == "answered") {
                    connection.recieveAnswer(peerData.answer);
                    peerRef.update({
                        status : "connected",
                    });
                }
            });
        }
    }
}
handleSignalling();

function createStatusIndicator(peerId, peerName, connectionState) {
    let peerStatus = document.createElement("li");
    let statusIndicator = document.createElement("div");
    statusIndicator.classList.add("statusIndicator");
    statusIndicator.id = "statusIndicator-" + peerId;
    if(connectionState == "connected") {
        statusIndicator.style.backgroundColor = "#e1cf5b";
    }else if(connectionState == "connected") {
        statusIndicator.style.backgroundColor = "#90c417ff";
    }else {
        statusIndicator.style.backgroundColor = "#5c5c5c";
    }
    peerStatus.appendChild(statusIndicator);
    let text = document.createTextNode(peerName);
    peerStatus.appendChild(text);
    sidebar.appendChild(peerStatus);
}

function applyColor(indicator, state) {
    if(!indicator) return;
    indicator.style.backgroundColor =
        state === "connected"  ? "#90c417ff" :
        state === "connecting" ? "#e1cf5b" :
                                 "#5c5c5c";
}









// firestore api testing
// if(window.chatData.hosting) {
//     db.collection("rooms").doc("ABCD").set({
//         'key1' : 'value1',
//         'key2' : 'value2'
//     });

//     // db.collection("rooms").add({
//     //     'key1' : 'value1'
//     // });

//     db.collection("rooms").doc("ABCD").update({
//         'key2' : 'changed',
//         'key3' : 'value3'
//     });

//     db.collection("rooms").doc("ABCD").collection("members").add({
//         name : 'zoro'
//     });

//     db.collection("rooms").doc("ABCD").get().then( (doc) => {
//         console.log(doc.data());
//     });
    
// }