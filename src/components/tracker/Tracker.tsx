// "use client";

// import { useContext, useEffect, useRef, useState } from "react";
// import { UserContext } from "../../../context";

// const IDLE_THRESHOLD = 10 * 1000; // 10 seconds of inactivity before switching to idle mode
// const API_ENDPOINT = "/api/reports/update"; // Update this with your actual API endpoint

// const SessionTracker = () => {
//   const { userInfo } = useContext(UserContext);
//   const userId = userInfo?.employee_id;

//   if (!userInfo || !userId) return null; // Ensure the userInfo exists

//   // Generate a unique key for each user
//   const getLocalStorageKey = (key: string) => `session_${userId}_${key}`;
//   const getCurrentDate = () => new Date().toISOString().split("T")[0];

//   // Using useRef to persist values across renders
//   const totalActiveTimeRef = useRef<number>(
//     Number(localStorage.getItem(getLocalStorageKey("totalactiveTime"))) || 0
//   );
//   const idleTimeRef = useRef<number>(
//     Number(localStorage.getItem(getLocalStorageKey("idleTime"))) || 0
//   );
//   const [currentDate, setCurrentDate] = useState<string>(() => {
//     const storedDate = localStorage.getItem(getLocalStorageKey("currentDate"));
//     return storedDate || getCurrentDate();
//   });

//   const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
//   const activityIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const isIdleRef = useRef(false); // Track whether the user is idle

//   const checkIfOnWorkSite = async () => {
//     const localVal = localStorage.getItem("isOnWorkSite");
//     if (localVal !== null) return localVal === "true";

//     return new Promise<boolean>((resolve) => {
//       if (chrome?.storage?.local) {
//         chrome.storage.local.get(["isOnWorkSite"], (result) => {
//           resolve(result.isOnWorkSite || false);
//         });
//       } else {
//         resolve(false);
//       }
//     });
//   };

//   useEffect(() => {
//     if (!userInfo || !userId) return; // Ensure userInfo exists before running
//     const checkDateAndReset = () => {
//       const today = getCurrentDate();
//       if (today !== currentDate) {
//         console.log("Date changed! Resetting stats...");

//         // Reset all stored values for the new day
//         setCurrentDate(today);
//         localStorage.setItem(getLocalStorageKey("currentDate"), today);
//         totalActiveTimeRef.current = 0;
//         idleTimeRef.current = 0;
//         localStorage.setItem(getLocalStorageKey("totalactiveTime"), "0");
//         localStorage.setItem(getLocalStorageKey("idleTime"), "0");
//         localStorage.setItem(getLocalStorageKey("offsiteTime"), "0");
//       }
//     };

//     // Check for date change every 1 minute
//     const dateCheckInterval = setInterval(checkDateAndReset, 60 * 1000);

//     return () => clearInterval(dateCheckInterval);
//   }, [currentDate, userId, userInfo]);
//   // Updating localStorage on changes
//   useEffect(() => {
//     if (!userInfo || !userId) return; // Ensure userInfo exists before running
//     // Track active time every second (only when not idle)
//     activityIntervalRef.current = setInterval(async () => {
//       const isOnWorkSite = await checkIfOnWorkSite();

//       if (!isIdleRef.current || isOnWorkSite) {
//         totalActiveTimeRef.current += 1;
//         localStorage.setItem(
//           getLocalStorageKey("totalactiveTime"),
//           String(totalActiveTimeRef.current)
//         );
//       }
//     }, 1000);

//     // Function to switch to idle mode
//     const startIdleMode = () => {
//       if (!isIdleRef.current) {
//         isIdleRef.current = true;
//         idleTimerRef.current = setInterval(async () => {
//           const isOnWorkSite = await checkIfOnWorkSite();

//           if (!isOnWorkSite) {
//             idleTimeRef.current += 1;
//             localStorage.setItem(
//               getLocalStorageKey("idleTime"),
//               String(idleTimeRef.current)
//             );
//           }
//         }, 1000);
//       }
//     };

//     // Function to detect inactivity (user stops interacting)
//     const handleInactivity = () => {
//       if (inactivityTimeoutRef.current)
//         clearTimeout(inactivityTimeoutRef.current);
//       inactivityTimeoutRef.current = setTimeout(() => {
//         startIdleMode();
//       }, IDLE_THRESHOLD);
//     };

//     // Function to reset idle mode when user interacts
//     const resetIdleMode = () => {
//       if (isIdleRef.current) {
//         isIdleRef.current = false;
//         if (idleTimerRef.current) {
//           clearInterval(idleTimerRef.current);
//           idleTimerRef.current = null;
//         }
//       }
//       handleInactivity(); // Restart inactivity timer
//     };

//     // Listen for user activity to reset idle state
//     window.addEventListener("mousemove", resetIdleMode);
//     window.addEventListener("keydown", resetIdleMode);
//     window.addEventListener("click", resetIdleMode);
//     window.addEventListener("scroll", resetIdleMode);

//     handleInactivity(); // Start tracking inactivity

//     return () => {
//       if (activityIntervalRef.current)
//         clearInterval(activityIntervalRef.current);
//       if (idleTimerRef.current) clearInterval(idleTimerRef.current);
//       if (inactivityTimeoutRef.current)
//         clearTimeout(inactivityTimeoutRef.current);
//       window.removeEventListener("mousemove", resetIdleMode);
//       window.removeEventListener("keydown", resetIdleMode);
//       window.removeEventListener("click", resetIdleMode);
//       window.removeEventListener("scroll", resetIdleMode);
//     };
//   }, [currentDate, userId, userInfo]);

//   // Send session data to the API when the user leaves
//   const sendSessionData = () => {
//     if (!userInfo || !userId) return; // Ensure userInfo exists before running

//     const offsiteTime =
//       Number(localStorage.getItem(getLocalStorageKey("offsiteTime"))) || 0;

//     const sessionData = {
//       userId,
//       date: currentDate,
//       activeTime: totalActiveTimeRef.current + offsiteTime,
//       idleTime: idleTimeRef.current - offsiteTime,
//       // offsiteTime
//     };
//     console.log("📤 Sending session data:", sessionData);
//     // Use navigator.sendBeacon for reliability
//     if (navigator.sendBeacon) {
//       const blob = new Blob([JSON.stringify(sessionData)], {
//         type: "application/json",
//       });
//       navigator.sendBeacon(API_ENDPOINT, blob);
//     } else {
//       fetch(API_ENDPOINT, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(sessionData),
//       });
//     }
//   };

//   // Attach event listeners for tab close or unload
//   useEffect(() => {
//     if (!userInfo || !userId) return;
//     console.log("trackingg");

//     window.addEventListener("beforeunload", sendSessionData);
//     window.addEventListener("visibilitychange", () => {
//       if (document.visibilityState === "hidden") sendSessionData();
//     });

//     return () => {
//       window.removeEventListener("beforeunload", sendSessionData);
//       window.removeEventListener("visibilitychange", sendSessionData);
//     };
//   }, [userInfo, userId]);

//   return null;
// };

// export default SessionTracker;
