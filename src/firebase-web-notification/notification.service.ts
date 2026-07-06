import { Injectable } from '@nestjs/common';
import admin from '../firebase-admin';

@Injectable()
export class NotificationService {
    // async send(token: string, title: string, body: string) {
    //     const message = {
    //         token,
    //         notification: {
    //             title,
    //             body,
    //         },
    //         webpush: {
    //             headers: {
    //                 Urgency: 'high',
    //             },
    //             notification: {
    //                 title,
    //                 body,
    //                 icon: 'https://firebase.google.com/favicon.ico',
    //             },
    //             fcmOptions: {
    //                 link: 'http://127.0.0.1:5500/src/firebase-web-notification/index.html',
    //             },
    //         },
    //     };

    //     console.log(message);

    //     // const response = await admin.messaging().send(message);
    //     const response = await admin.messaging().send({

    //         token,

    //         notification: {
    //             title,
    //             body,
    //         },

    //         webpush: {
    //             notification: {
    //                 icon: "https://firebase.google.com/favicon.ico",
    //             }
    //         }

    //     });

    //     console.log(response);

    //     return response;
    // }



    // async send(
    //     token: string,
    //     title: string,
    //     body: string,
    // ) {

    //     try {

    //         const response = await admin.messaging().send({

    //             token,

    //             notification: {
    //                 title,
    //                 body,
    //             },

    //             webpush: {

    //                 headers: {
    //                     Urgency: 'high',
    //                 },

    //                 notification: {
    //                     title,
    //                     body,
    //                     icon: 'https://firebase.google.com/favicon.ico',
    //                 },

    //                 fcmOptions: {
    //                     link: 'http://127.0.0.1:5500/src/firebase-web-notification/index.html',
    //                 },
    //             },
    //         });

    //         console.log(`Notification Sent: ${response}`);

    //         return response;

    //     } catch (error) {

    //         console.error(error);

    //         throw error;

    //     }

    // }


    async send(
        token: string,
        title: string,
        body: string,
    ) {
        const response = await admin.messaging().send({
            token,

            notification: {
                title,
                body,
            },

            webpush: {
                headers: {
                    Urgency: "high",
                },

                notification: {
                    title,
                    body,
                    icon: "https://firebase.google.com/favicon.ico",
                    badge: "https://firebase.google.com/favicon.ico",
                    requireInteraction: true,
                },

                fcmOptions: {
                    link: "http://127.0.0.1:5500/src/firebase-web-notificationss/",
                },
            },
        });

        console.log("Notification Sent:", response);

        return response;
    }
}