const params = new URLSearchParams(window.location.search);
window.chatData = {name: params.get("name"), messages : [
    {
        "name": "Roro",
        "message": "hiii",
        "timeStamp": "02:34 PM"
    },
    {
        "name": "Boro",
        "message": "helloooo",
        "timeStamp": "02:36 PM"
    },
    {
        "name": "Zoro",
        "message": "How are you??",
        "timeStamp": "02:38 PM"
    }
], 
room : params.get("room"),
hosting: params.get("hosting") == "true" ? true : false,
id : crypto.randomUUID()
};

const firebaseConfig = {
    apiKey: "AIzaSyCowiq8v6aQnSFBr5c0jQHu1ncA4DEjpCU",
    authDomain: "rooms-25759.firebaseapp.com",
    projectId: "rooms-25759",
    storageBucket: "rooms-25759.firebasestorage.app",
    messagingSenderId: "69878928021",
    appId: "1:69878928021:web:3ec57f81903b987d7dc19c"
};

firebase.initializeApp(firebaseConfig);
