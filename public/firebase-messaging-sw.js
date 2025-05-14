importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js');


firebase.initializeApp({
    apiKey: "AIzaSyACl_ax4pP-L974aZaxEQUMVI69rymj8O0",
    authDomain: "ongi-83270.firebaseapp.com",
    projectId: "ongi-83270",
    storageBucket: "ongi-83270.firebasestorage.app",
    messagingSenderId: "967073688567",
    appId: "1:967073688567:web:d98b3696b4bd3fec17dcf2",
    measurementId: "G-4KKTBFCCS9"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});