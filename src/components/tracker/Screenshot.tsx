"use client";

import { useContext, useEffect } from "react";
import html2canvas from "html2canvas";
import { UserContext } from "../../../context";

const ScreenShot = () => {
  const { userInfo } = useContext(UserContext);
  const userId = userInfo?.employee_id;

  useEffect(() => {
    if (!userInfo || !userId) return; // Ensure userInfo exists before running
    console.log("loaded");

    const captureScreenshot = async () => {
      console.log("capturing");

      const canvas = await html2canvas(document.body, {
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        width: window.innerWidth,
        height: window.innerHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      });
      const imageUrl = canvas.toDataURL(); // Convert to base64

      console.log("Captured screenshot", imageUrl);

      // Send to API
      await fetch("/api/reports/add-screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, image: imageUrl }),
      });
    };

    // Set the interval to capture the screenshot every 2 minutes (120,000ms)
    const intervalId = setInterval(captureScreenshot, 9600000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [userInfo, userId]);

  return null;
};

export default ScreenShot;
