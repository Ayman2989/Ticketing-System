"use client";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context";
import axios from "axios";
import FloatingNav from "./FloatingMenu";

interface HeaderProps {
  onMenuClick: () => void;
}

const fetchReportByDate = async (userId: string, date: string) => {
  try {
    const res = await fetch("/api/reports/view-worktime", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, date }),
    });

    if (!res.ok) throw new Error("Something went wrong");

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching report:", error);
    return null;
  }
};

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { userInfo, logout } = useContext(UserContext);
  const [workTime, setWorkTime] = useState(null);
  const [completedShift, setCompletedShift] = useState(false);
  console.log(userInfo);
  const today = new Date().toISOString().split("T")[0]; // "2025-04-23"

  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/users/logout");
      logout();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const { workTime, completedShift } = await fetchReportByDate(
        userInfo.employee_id,
        today
      );
      console.log("Fetched report:", workTime, completedShift);
      setWorkTime(workTime);
      setCompletedShift(completedShift);
    };

    getData();
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full lg:w-10/12 bg-etuwaCustom-wb text-white p-4 flex items-center justify-between h-14 lg:max-h-20 z-10 shadow-xl rounded-xl lg:left-52">
        {/* Hamburger Button */}
        <button
          className="lg:hidden bg-gradient-to-r from-etuwaCustom-sb to-etuwaCustom-db p-2 rounded-md"
          onClick={onMenuClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6h16.5M3.75 12h16.5M3.75 18h16.5"
            />
          </svg>
        </button>
        {/* User Info */}
        <div className="flex items-center justify-between w-full">
          <div className="flex justify-center items-center gap-2">
            <h1 className="drop-shadow-white-glow transition-all duration-700 ease-in-out hover:scale-110 ml-2 text-lg font-semibold text-etuwaCustom-db animate-pulse">
              Welcome, {userInfo?.employee_name}
            </h1>
            <h1
              className={`${
                completedShift ? "text-green-700" : "text-etuwaCustom-db"
              }`}
            >
              You Worked for {workTime} today
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="font-medium text-etuwaCustom-db w-28 border-2 transition-all duration-500 border-etuwaCustom-db rounded-lg p-1 hover:bg-etuwaCustom-db hover:text-etuwaCustom-wb"
          >
            logout
          </button>
        </div>
      </header>
      <FloatingNav />
    </>
  );
};

export default Header;
