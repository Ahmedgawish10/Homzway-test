importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyDNMOkBx54Xdt8Jp4AQKDHVH8MpDn0NhLY",
  authDomain: "homzway-cb6df.firebaseapp.com",
  projectId: "homzway-cb6df",
  storageBucket: "homzway-cb6df.firebasestorage.app",
  messagingSenderId: "586754929711",
  appId: "1:586754929711:web:db7533e23898981cb002da",
  measurementId: "G-KKVNYTDYH9"
};
firebase?.initializeApp(firebaseConfig)

const messaging = firebase.messaging();


self.addEventListener('install', function (event) {
    console.log('Hello world from the Service Worker :call_me_hand:');
});


