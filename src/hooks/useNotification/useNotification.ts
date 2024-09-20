// pages/index.js

"use client";

import { useEffect } from "react";

import { getToken } from "firebase/messaging";
import { messaging } from "firebase-config/firebase";

const useNotification = () => {
//   const requestPermission = async () => {
//     const permission = await Notification.requestPermission();

//     if (permission === "granted") {
//       console.log("Notification permission granted.");
//       try {
//         const token = await getToken(messaging, {
//           vapidKey: "BP9tsAtOcvmk0JnGjih1wU88A8cKTIuhnxrN5Y-Q73mHv4zaIqjamHFut7QsfHZGVBD-X3DhiKL9WLDNUvcDw-c",
//         });
//         // if (token) {
//         //     console.log('Device Token:', token);
        
//         //     await fetch('/api/addUser', {
//         //         method: 'POST',
//         //         headers: {
//         //             'Content-Type': 'application/json',
//         //         },
//         //         body: JSON.stringify({
//         //             userId: 'userB',
//         //             token: token,
//         //         }),
//         //     });
//         // }
//         console.log("check token noti", token);
//         return token;
//       } catch (error) {
//         console.error("Error getting token:", error);
//       }
//     } else if (permission === "denied") {
//       console.error("Permission denied for notifications.");
//     } else {
//       console.warn("Notification permission dismissed.");
//     }
//   };

function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            getToken(messaging, { vapidKey: "BP9tsAtOcvmk0JnGjih1wU88A8cKTIuhnxrN5Y-Q73mHv4zaIqjamHFut7QsfHZGVBD-X3DhiKL9WLDNUvcDw-c" }).then((currentToken) => {
                if (currentToken) {
                    // Send the token to your server and update the UI if necessary
                    console.log('Current token:', currentToken);
                    // ...
                } else {
                    // Show permission request UI
                    console.log('No registration token available. Request permission to generate one.');
                    // ...
                }
            }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
                // ...
            });
        } else {
            console.error('Permission denied for notifications.');
        }
    }).catch((err) => {
        console.error('Error requesting notification permission: ', err);
    });
}



  useEffect(() => {
    requestPermission();
  }, []);
};

export default useNotification;
