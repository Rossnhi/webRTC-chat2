const db = firebase.firestore();
let roomRef = db.collection("rooms").doc(window.chatData.room);
const peersRef = roomRef.collection("peers");

async function handleSignalling() {
    if(window.chatData.hosting) {
        roomRef.set({
            hostName : window.chatData.name,
            hostID : window.chatData.id,
        });

        peersRef.onSnapshot(async (snapshot) => {
            for (const change of snapshot.docChanges()) {
                const peerData = change.doc.data();
                const peerId = change.doc.id;

                if (change.type === "added") {
                    connections[peerId] = new Connection(peerId);
                }
                else if (change.type === "modified") {
                    if (!connections[peerId]) {
                        connections[peerId] = new Connection(peerID);
                    }
                    if(peerData.status == "offered" && !peerData.answer) {
                        change.doc.ref.update({
                            status : "answered",
                            answer : JSON.stringify(await connections[peerId].generateAnswer(peerData.offer))
                        });
                    }
                }
                // else if (change.type === "removed") {
                //     console.log(`Peer left: ${peerId}`);
                // }
            };
        });

        // roomRef.onSnapshot(async (doc) => {
        //     let roomData = doc.data();
        //     if(roomData.status == "offered") {
        //         roomRef.update({
        //             status : "answered",
        //             answer : JSON.stringify(await connection.generateAnswer(roomData.offer))
        //         });
        //     }
        // });
    }
    else {
        const docSnap = await roomRef.get();
        if(!docSnap.exists) {
            alert("Room does not exist. Please enter a valid room ID.");
            window.location.href = "index.html";
        }else {
            connection = new Connection(window.chatData.id);
            const peerRef = peersRef.doc(window.chatData.id);

            peerRef.set({
                name : window.chatData.name,
                status : "offer pending",
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