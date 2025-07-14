"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { UserContext } from "./context";

type TimerContextType = {
  hours: number;
  minutes: number;
  seconds: number;
  isRunning: boolean;
  idleHours: number;
  idleMinutes: number;
  idleSecs: number;
  pause: () => void;
  resume: () => void;
  stopAll: () => void;
  disableIdleTracking: () => void;
  enableIdleTracking: () => void;

  // ⬇️ Add these new properties below:
  onBreak: boolean;
  breakSeconds: number;
  startBreak: () => void;
  cancelBreak: () => void;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const { userInfo } = useContext(UserContext);

  // Helpers
  const getTodayKey = () => {
    const today = new Date().toISOString().split("T")[0];
    return `timer-${today}-${userInfo?.employee_id}`;
  };

  const loadTimerFromStorage = () => {
    const key = getTodayKey();
    const saved = localStorage.getItem(key);
    return saved ? Number(saved) : 0;
  };

  const loadIdleFromStorage = () => {
    const key = `idle-${getTodayKey()}`;
    const saved = localStorage.getItem(key);
    return saved ? Number(saved) : 0;
  };

  const saveIdleToStorage = (seconds: number) => {
    const key = `idle-${getTodayKey()}`;
    localStorage.setItem(key, seconds.toString());
  };

  const saveTimerToStorage = (seconds: number) => {
    const key = getTodayKey();
    localStorage.setItem(key, seconds.toString());
  };

  const [totalSeconds, setTotalSeconds] = useState(() => {
    if (typeof window !== "undefined") return loadTimerFromStorage();
    return 0;
  });

  const [isRunning, setIsRunning] = useState(true);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [pausedByIdle, setPausedByIdle] = useState(false);
  const [idleSeconds, setIdleSeconds] = useState(() => {
    if (typeof window !== "undefined") return loadIdleFromStorage();
    return 0;
  });

  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const idleDelay = 10000; // 10 ثواني

  // حالة تعطيل أو تفعيل تتبع الخمول
  const [idleTrackingEnabled, setIdleTrackingEnabled] = useState(true);
  const [onBreak, setOnBreak] = useState(false);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const breakTimerRef = useRef<NodeJS.Timeout | null>(null);

  // وقت بالساعة والدقائق والثواني
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const idleHours = Math.floor(idleSeconds / 3600);
  const idleMinutes = Math.floor((idleSeconds % 3600) / 60);
  const idleSecs = idleSeconds % 60;

  // دوال التحكم الأساسية
  const pause = () => {
    setManuallyPaused(true);
    setIsRunning(false);
  };

  const resume = () => {
    setManuallyPaused(false);
    setPausedByIdle(false);
    setIsRunning(true);
  };

  const stopAll = () => {
    console.log("🛑 Stopping all timers (active + idle)");
    setIsRunning(false);
    setManuallyPaused(true);
    setPausedByIdle(false);
  };

  // ⏱ تشغيل المؤقت الرئيسي (active time)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && !onBreak) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => {
          const updated = prev + 1;
          saveTimerToStorage(updated);
          return updated;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, onBreak]);

  // ⏱ تتبع وقت الخمول (idle time)
  useEffect(() => {
    let idleInterval: NodeJS.Timeout | null = null;
    if (pausedByIdle && !manuallyPaused && !onBreak) {
      idleInterval = setInterval(() => {
        setIdleSeconds((prev) => {
          const updated = prev + 1;
          saveIdleToStorage(updated);
          return updated;
        });
      }, 1000);
    }

    return () => {
      if (idleInterval) clearInterval(idleInterval);
    };
  }, [pausedByIdle, manuallyPaused]);

  // إعادة تعيين الساعة عند منتصف الليل
  useEffect(() => {
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
      now.getTime();

    const timeout = setTimeout(() => {
      localStorage.removeItem(getTodayKey());
      setTotalSeconds(0);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  // دالة تفعيل الخمول مع فحص إذا كانت التتبع مفعّل
  const triggerIdle = () => {
    if (!idleTrackingEnabled) return; // إذا تتبع الخمول معطل ما نسوي شيء
    if (!manuallyPaused && !pausedByIdle) {
      console.log("💤 User idle. Pausing.");
      setIsRunning(false);
      setPausedByIdle(true);
    }
  };

  // إعادة تعيين مؤقت الخمول
  const resetIdleTimer = useCallback(() => {
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);

    idleTimeoutRef.current = setTimeout(() => {
      triggerIdle();
    }, idleDelay);
  }, [manuallyPaused, pausedByIdle, idleTrackingEnabled]);

  // التعامل مع أي حركة للمستخدم أو ضغط زر
  const handleUserActivity = () => {
    if (pausedByIdle && !manuallyPaused) {
      console.log("🖱️ Activity detected. Resuming.");
      setIsRunning(true);
      setPausedByIdle(false);
    }

    resetIdleTimer();
  };

  const handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    if (
      clientX !== lastMousePosition.current.x ||
      clientY !== lastMousePosition.current.y
    ) {
      lastMousePosition.current = { x: clientX, y: clientY };
      handleUserActivity();
    }
  };

  const handleKeyDown = () => {
    handleUserActivity();
  };

  // دوال تعطيل وتفعيل تتبع الخمول
  const disableIdleTracking = () => {
    setIdleTrackingEnabled(false);
    setIsRunning(true);
    setPausedByIdle(false);
  };

  const enableIdleTracking = () => {
    setIdleTrackingEnabled(true);
    resetIdleTimer();
  };
  const startBreak = () => {
    stopAll();
    disableIdleTracking();
    setOnBreak(true);
    setBreakSeconds(30 * 60);

    breakTimerRef.current = setInterval(() => {
      setBreakSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(breakTimerRef.current!);
          endBreak();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelBreak = () => {
    clearInterval(breakTimerRef.current!);
    setBreakSeconds(0);
    setOnBreak(false);
    resume();
    enableIdleTracking();
  };

  const endBreak = () => {
    setOnBreak(false);
    resume();
    enableIdleTracking();
  };

  // مراقبة أحداث حركة المستخدم
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keydown", handleKeyDown);
    resetIdleTimer();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleKeyDown);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [resetIdleTimer]);

  // إرسال بيانات الجلسة للسيرفر
  const sendSessionData = useCallback(() => {
    if (!userInfo?.employee_id) return;

    const sessionData = {
      userId: userInfo.employee_id,
      date: new Date().toISOString().split("T")[0],
      activeTime: totalSeconds,
      idleTime: idleSeconds,
    };

    console.log("📤 Sending session data:", sessionData);

    const blob = new Blob([JSON.stringify(sessionData)], {
      type: "application/json",
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/reports/update", blob);
    } else {
      fetch("/api/reports/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      });
    }
  }, [userInfo?.employee_id, totalSeconds, idleSeconds]);

  // إرسال البيانات عند إغلاق الصفحة أو تغير التبويب
  useEffect(() => {
    if (!userInfo?.employee_id) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendSessionData();
      }
    };

    window.addEventListener("beforeunload", sendSessionData);
    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", sendSessionData);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [sendSessionData, userInfo?.employee_id]);

  return (
    <TimerContext.Provider
      value={{
        hours,
        minutes,
        seconds,
        isRunning,
        pause,
        resume,
        stopAll,
        idleHours,
        idleMinutes,
        idleSecs,
        disableIdleTracking,
        enableIdleTracking,

        // ⛔ onBreak, breakSeconds, etc. are not recognized without updating the type
        onBreak,
        breakSeconds,
        startBreak,
        cancelBreak,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error("useTimer must be used within TimerProvider");
  return context;
};
