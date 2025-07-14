"use client";
import React, { useState, useRef, useEffect, useContext } from "react";
import YoutubeLogo from "../../../public/YoutubeLogo.png";
import Image from "next/image";
import MeetLogo from "../../../public/MeetLogo.png";
import TelegramLogo from "../../../public/TelegramLogo.png";
import WhatsappLogo from "../../../public/WhatsappLogo.png";
import Link from "next/link";
import { UserContext } from "../../../context";
import { useTimer } from "../../../TimerContext";

const FloatingNav = () => {
  const [showLinks, setShowLinks] = useState(false);
  const [showBreakPopup, setShowBreakPopup] = useState(false);
  const breakTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const semicircleRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondsRef = useRef<number>(0);
  const [visit, setVisit] = useState<string[]>([]);
  const [isOffsiteActive, setIsOffsiteActive] = useState(false); // ✅ new state

  const { userInfo } = useContext(UserContext);
  const userId = userInfo?.employee_id;

  const {
    hours,
    minutes,
    seconds,
    isRunning,
    pause,
    resume,
    idleHours,
    idleMinutes,
    idleSecs,
    stopAll,
    disableIdleTracking,
    enableIdleTracking,
    startBreak,
    cancelBreak,
    onBreak,
    breakSeconds,
  } = useTimer();

  const updateOffsiteTime = (userId: string, seconds: number) => {
    const key = `session_${userId}_offsiteTime`;
    const current = Number(localStorage.getItem(key)) || 0;
    const updated = current + seconds;
    console.log(
      `🧪 OFFSITE - Before: ${current}, Add: ${seconds}, New: ${updated}`
    );
    localStorage.setItem(key, String(updated));
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      console.log("⛔️ Timer stopped!");

      if (userId && secondsRef.current > 0) {
        updateOffsiteTime(userId, secondsRef.current);
      }

      secondsRef.current = 0;
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target as Node) &&
      semicircleRef.current &&
      !semicircleRef.current.contains(event.target as Node)
    ) {
      setShowLinks(false);
      setHoveredIndex(null);

      if (isOffsiteActive) {
        stopTimer(); // ✅ stop offsite timer
        setIsOffsiteActive(false); // ✅ user is back
        enableIdleTracking(); // ✅ re-enable idle tracking
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOffsiteActive]);

  const links = [
    { src: YoutubeLogo, href: "https://www.youtube.com/", label: "Youtube" },
    { src: WhatsappLogo, href: "https://web.whatsapp.com/", label: "Whatsapp" },
    { src: MeetLogo, href: "https://meet.google.com/", label: "Google Meet" },
    { src: TelegramLogo, href: "https://web.telegram.org/", label: "Telegram" },
  ];

  useEffect(() => {
    console.log("🔍 Visit list updated:", visit);
  }, [visit]);

  return (
    <div className="fixed z-50 top-14 left-1/2 transform -translate-x-1/2">
      {/* Semicircle */}
      <div
        ref={semicircleRef}
        className="w-20 h-10 rounded-b-full cursor-pointer transition-all duration-500 ease-out bg-gradient-to-b from-etuwaCustom-db to-etuwaCustom-lb relative"
        onClick={() => {
          const newState = !showLinks;
          setShowLinks(newState);
          if (!newState && isOffsiteActive) {
            stopTimer();
            setIsOffsiteActive(false);
            enableIdleTracking();
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 absolute bottom-0 left-1/2 transform -translate-x-1/2 pb-1 text-white"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m7 6 5 5 5-5"></path>
          <path d="m7 13 5 5 5-5"></path>
        </svg>
      </div>

      {/* Popup */}
      <div
        ref={popupRef}
        onMouseLeave={() => {
          resume();
        }}
        className={`z-50 overflow-hidden transition-all duration-700 ease-in-out transform -translate-x-1/2 absolute top-10 left-1/2 ${
          showLinks
            ? "opacity-100 scale-100 max-h-[800px]"
            : "opacity-0 scale-75 max-h-0"
        }`}
      >
        <div className="bg-etuwaCustom-lb text-black shadow-2xl rounded-md p-6 flex flex-col items-center transition-opacity duration-800 w-[350px]">
          <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
            <div className="p-4 text-center">
              <h1 className="text-xl font-bold">
                {String(hours).padStart(2, "0")}:
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </h1>
              <p>Status: {isRunning ? "Running" : "Paused"}</p>
              <div className="space-x-2 mt-2">
                <button
                  onClick={() => setShowBreakPopup(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Request Break
                </button>

                {/* <button
                  onClick={resume}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Resume
                </button> */}
              </div>
              <p className="text-sm mt-2">
                Idle Time: {String(idleHours).padStart(2, "0")}:
                {String(idleMinutes).padStart(2, "0")}:
                {String(idleSecs).padStart(2, "0")}
              </p>
            </div>

            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                target="_blank"
                onClick={() => {
                  stopAll(); // stop work/idle timers
                  stopTimer(); // just in case offsite already running
                  disableIdleTracking(); // ✅ disable idle tracking
                  setIsOffsiteActive(true); // ✅ user now considered offsite
                  secondsRef.current = 0;

                  setVisit((prev) => [
                    ...prev,
                    `Visited ${
                      link.label
                    } at ${new Date().toLocaleTimeString()}`,
                  ]);

                  console.log("⏱ Offsite timer started!");

                  timerRef.current = setInterval(() => {
                    secondsRef.current += 1;
                    console.log(`⏳ ${secondsRef.current} seconds elapsed`);
                  }, 1000);
                }}
                className={`
                  transition-all duration-300 ease-in-out rounded-md font-semibold text-center
                  ${
                    hoveredIndex === index
                      ? "bg-white text-black scale-110 w-full py-6 z-10"
                      : hoveredIndex !== null
                      ? "bg-blue-200 text-white scale-75 w-3/4 py-2 opacity-60"
                      : "bg-blue-100 text-black w-full py-4"
                  }
                `}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Image
                  src={link.src}
                  alt="Logo"
                  className={`w-10 h-10 mx-auto transition-transform duration-300 ${
                    hoveredIndex === index ? "scale-125" : "scale-90"
                  }`}
                />
                <p className="text-etuwaCustom-sb">
                  {hoveredIndex === index &&
                    "Please return to the application to calculate work hours"}
                </p>
              </Link>
            ))}
          </div>
          {showBreakPopup && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4 text-center">
                  Request Break
                </h2>
                <p className="text-center mb-4">
                  Do you want to take a 30-minute break?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      startBreak();
                      setShowBreakPopup(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Yes, Start Break
                  </button>
                  <button
                    onClick={() => setShowBreakPopup(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {onBreak && (
            <div className="text-center mt-4">
              <p className="text-red-600 font-semibold">
                On Break:{" "}
                {String(Math.floor(breakSeconds / 60)).padStart(2, "0")}:
                {String(breakSeconds % 60).padStart(2, "0")}
              </p>
              <button
                onClick={cancelBreak}
                className="mt-2 px-4 py-2 bg-red-400 text-white rounded"
              >
                Cancel Break
              </button>
            </div>
          )}
          {/* Break Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div
              className="bg-red-500 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(breakSeconds / 1800) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingNav;
