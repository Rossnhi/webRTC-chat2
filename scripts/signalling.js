const db = firebase.firestore();
console.log(window.chatData);


let myData; // a local copy of the data on firebase to keep track of changes
let roomRef = db.collection("rooms").doc(window.chatData.room);
if( window.chatData.hosting) {
   myData = {
       host : window.chatData.name,
       members : [],
   };
   roomRef.set(myData);


   myData.connections = [];
   roomRef.onSnapshot((room) => {
       let roomData = room.data();
       roomData.members.forEach(async member => {
           if (!myData.members.includes(member)) {
               let newOffer = await generateOffer();
               roomRef.collection("connections").doc(member).set({
                   status : "offered",
                   offer : newOffer
               })
               myData.members.push(member);
               myData.connections.push({[member] : {
                   status : "offered",
                   offer : newOffer
               }});
           }
       });
   });
}


else {
   joinDataInit();
}


async function joinDataInit() {
   myData = await roomRef.get()
   myData = await myData.data();
   myData.members.push(window.chatData.name);
   roomRef.update(myData);
  
   roomRef.onSnapshot((room) => {
      
   });


}








// let rooms = {
//     XHJD : {
//         host : "Roro",
//         members : ["Susu"],
//         docSusu: {
//             status : "answered", // offered/answered/connected
//             offer : "jgj",
//             answer: "hfy"
//         }
//     },
//     GHKU : {


//     }
// }

