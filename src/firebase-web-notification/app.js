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

document.getElementById("allow").addEventListener("click", async () => {
    try {
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            alert("Permission denied");
            return;
        }

        const registration = await navigator.serviceWorker.register(
            "./firebase-messaging-sw.js"
        );

        console.log("Service Worker:", registration);

        const token = await getToken(messaging, {
            vapidKey:
                "BEJl-ZHFrkJyEaKNmx9sV66yIg6BpDSwd4_kzvvqTPrcempZ8aTRImyfHWJuKlbQZRyrt5vPn1sNAiqd19IsWOg",
            serviceWorkerRegistration: registration,
        });

        console.log("FCM Token:", token);

        document.getElementById("token").innerText = token || "No token";
    } catch (err) {
        console.error("ERROR:", err);
    }
});

// onMessage(messaging, (payload) => {

//     console.log(payload);

//     new Notification(

//         payload.notification.title,

//         {
//             body: payload.notification.body,
//             icon: "https://firebase.google.com/favicon.ico",
//         }

//     );

// });

onMessage(messaging, (payload) => {
    console.log("Foreground:", payload);

    navigator.serviceWorker.getRegistration().then((registration) => {
        if (!registration) {
            console.log("No Service Worker found");
            return;
        }

        registration.showNotification(
            payload.notification.title,
            {
                body: payload.notification.body,
                icon: payload.notification.icon,
            }
        );
    });
});