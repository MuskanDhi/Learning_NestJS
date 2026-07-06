import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import {
    getMessaging,
    getToken,
    onMessage
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging.js";

const firebaseConfig = {
    apiKey: "AIzaSyCX5p6Iim_xJL2zwCOgC6MccnHzN12rce4",
    authDomain: "website-notification-demo.firebaseapp.com",
    projectId: "website-notification-demo",
    storageBucket: "website-notification-demo.firebasestorage.app",
    messagingSenderId: "921614189922",
    appId: "1:921614189922:web:ca36ebac8c2c77c200583b",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const status = document.getElementById("status");
const tokenBox = document.getElementById("token");

document.getElementById("allow").onclick = async () => {

    try {

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            status.innerHTML = "Permission : Denied";
            return;
        }

        status.innerHTML = "Permission : Granted ✅";

        const registration = await navigator.serviceWorker.register(
            "./firebase-messaging-sw.js"
        );

        console.log("Service Worker Registered", registration);

        const token = await getToken(messaging, {
            vapidKey:
                "BEJl-ZHFrkJyEaKNmx9sV66yIg6BpDSwd4_kzvvqTPrcempZ8aTRImyfHWJuKlbQZRyrt5vPn1sNAiqd19IsWOg",
            serviceWorkerRegistration: registration,
        });

        if (!token) {
            alert("FCM Token not generated");
            return;
        }

        tokenBox.value = token;

        console.log("FCM TOKEN:");
        console.log(token);

    } catch (err) {
        console.error("ERROR:", err);
    }

};

document.getElementById("copy").onclick = async () => {

    await navigator.clipboard.writeText(tokenBox.value);

    alert("FCM Token Copied");

};

onMessage(messaging, (payload) => {

    console.log("Foreground Message", payload);

    navigator.serviceWorker.getRegistration().then((registration) => {

        if (!registration) return;

        registration.showNotification(
            payload.notification.title,
            {
                body: payload.notification.body,
                icon: payload.notification.icon,
                badge: payload.notification.icon,
            }
        );

    });

});