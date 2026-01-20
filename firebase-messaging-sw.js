importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// نفس إعدادات مشروعك
firebase.initializeApp({
    apiKey: "AIzaSyDpvqNAReChsHn5tFJSp7vV_EJHmtD2x4c",
    authDomain: "pools-e4381.firebaseapp.com",
    projectId: "pools-e4381",
    storageBucket: "pools-e4381.firebasestorage.app",
    messagingSenderId: "339799216046",
    appId: "1:339799216046:web:26e437a7b7d5c24fe9023f",
    measurementId: "G-EYPMCWES9N"
});

const messaging = firebase.messaging();

// هذا الكود هو المسؤول عن إظهار الإشعار حتى لو الموقع مغلق
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/img/logo.png', // تأكد أن لديك صورة بهذا الاسم أو غير المسار
    vibrate: [200, 100, 200]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
