const params = new URLSearchParams(window.location.search);
window.chatData = {name: params.get("name"),messages : []};

const firebaseConfig = {
    apiKey: "AIzaSyCowiq8v6aQnSFBr5c0jQHu1ncA4DEjpCU",
    authDomain: "rooms-25759.firebaseapp.com",
    projectId: "rooms-25759",
    storageBucket: "rooms-25759.firebasestorage.app",
    messagingSenderId: "69878928021",
    appId: "1:69878928021:web:3ec57f81903b987d7dc19c"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

