importScripts("https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCX5p6Iim_xJL2zwCOgC6MccnHzN12rce4",
    authDomain: "website-notification-demo.firebaseapp.com",
    projectId: "website-notification-demo",
    storageBucket: "website-notification-demo.firebasestorage.app",
    messagingSenderId: "921614189922",
    appId: "1:921614189922:web:ca36ebac8c2c77c200583b",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("Background Message:", payload);

    self.registration.showNotification(
        payload.notification.title,
        {
            body: payload.notification.body,
            icon: payload.notification.icon || "https://firebase.google.com/favicon.ico",
            badge: payload.notification.icon || "https://firebase.google.com/favicon.ico",
        }
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow("http://127.0.0.1:5500/src/firebase-web-notificationss/")
    );
});