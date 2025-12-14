const db = firebase.firestore();
let roomRef = db.collection("rooms").doc(window.chatData.room);
// const peersRef = roomRef.collection("peers");

async function handleSignalling() {
    if(window.chatData.hosting) {
        connection = new Connection();
        roomRef.set({
            hostName : window.chatData.name,
            hostID : window.chatData.id,
        });

        // peersRef.onSnapshot((snapshot) => {
        //     snapshot.docChanges().forEach((change) => {
        //         const peerData = change.doc.data();
        //         const peerId = change.doc.id;

        //         if (change.type === "added") {
        //             console.log(`New peer joined: ${peerId}`, peerData);
        //         }
        //         else if (change.type === "modified") {
        //             console.log(`Peer updated: ${peerId}`, peerData);
        //         }
        //         else if (change.type === "removed") {
        //             console.log(`Peer left: ${peerId}`);
        //         }
        //     });
        // });

        roomRef.onSnapshot(async (doc) => {
            let roomData = doc.data();
            if(roomData.status == "offered") {
                roomRef.update({
                    status : "answered",
                    answer : JSON.stringify(await connection.generateAnswer(roomData.offer))
                });
            }
        });
    }
    else {
        connection = new Connection();
        const docSnap = await roomRef.get();
        if(!docSnap.exists) {
            alert("Room does not exist. Please enter a valid room ID.");
            window.location.href = "index.html";
        }else {
            roomRef.update({
                status : "offer pending",
            });

            roomRef.update({
                status : "offered",
                offer : JSON.stringify(await connection.generateOffer())
            });

            roomRef.onSnapshot(async (doc) => {
                let roomData = doc.data();
                if(roomData.status == "answered") {
                    connection.recieveAnswer(roomData.answer);
                    roomRef.update({
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