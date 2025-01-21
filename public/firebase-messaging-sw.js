importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyAVzHKDlv5bKBTgmbpwNYNPeDr8r6bOUNo",
  authDomain: "saas-387913.firebaseapp.com",
  projectId: "saas-387913",
  storageBucket: "saas-387913.firebasestorage.app",
  messagingSenderId: "617215876101",
  appId: "1:617215876101:web:45d8f0ccea7e8ae8a7d06c",
  measurementId: "G-TSE82HY83P"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
