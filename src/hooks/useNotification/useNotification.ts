"use client";

import { useEffect, useRef, useState } from "react";
import { getToken } from "firebase/messaging";
import { messaging } from "firebase-config/firebase";

const useNotification = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);


  const isRequested = useRef(false);
  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");
        try {
          const currentToken = await getToken(messaging, {
            vapidKey:
              "BP9tsAtOcvmk0JnGjih1wU88A8cKTIuhnxrN5Y-Q73mHv4zaIqjamHFut7QsfHZGVBD-X3DhiKL9WLDNUvcDw-c",
          });
          console.log("🚀 ~ requestPermission ~ currentToken:", currentToken)

          if (currentToken) {
            setFcmToken(currentToken);
            // console.log("Current token:", currentToken);
          } else {
            console.log(
              "No registration token available. Request permission to generate one.",
            );
          }
        } catch (err) {
          console.error("An error occurred while retrieving token.", err);
          setError("Error retrieving token.");
        }
      } else {
        console.error("Permission denied for notifications.");
        setError("Permission denied.");
      }
    } catch (err) {
      console.error("Error requesting notification permission:", err);
      setError("Permission request failed.");
    }
  };

  useEffect(() => {
  
    if (!isRequested.current) {
      isRequested.current = true;
      requestPermission();
    }
  }, []);

  return { fcmToken, error };
};

export default useNotification;
