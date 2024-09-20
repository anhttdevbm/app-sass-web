importScripts("https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyBswIUARLNVHGrYAKxAa5SW4Xns9ZQhbrk",
  authDomain: "task-cover-notification.firebaseapp.com",
  projectId: "task-cover-notification",
  storageBucket: "task-cover-notification.appspot.com",
  messagingSenderId: "588821095572",
  appId: "1:588821095572:web:b45719a6b4cef895b00081",
  measurementId: "G-XGRM15R8FV",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
