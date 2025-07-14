"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Report {
  _id: string;
  userId: string; // Employee name
  activeTime: string;
  idleTime: string;
  date: string;
  attachment: string; // Base64 strings for images
  createdAt: string;
}

interface ReportsDisplayProps {
  reports: Report[];
}

const ReportsDisplay: React.FC<ReportsDisplayProps> = ({ reports }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedUser, setSelectedUser] = useState<string>("All Users");
  const router = useRouter();

  // Convert selected date to YYYY-MM-DD format
  const formattedSelectedDate = selectedDate.toISOString().split("T")[0];

  // Extract unique user names for dropdown
  const uniqueUsers = Array.from(
    new Set(reports.map((report) => report.userId))
  );

  // Filter reports based on date and selected user
  const filteredReports = reports.filter(
    (report) =>
      report.date === formattedSelectedDate &&
      (selectedUser === "All Users" || report.userId === selectedUser)
  );

  return (
    <div className="p-6 text-etuwaCustom-db">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      {/* Filters: Date Picker & User Dropdown */}
      <div className="mb-4 flex gap-4 items-center">
        <div>
          <label className="font-semibold">Select a Date: </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => date && setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border border-etuwaCustom-db rounded p-2 bg-etuwaCustom-wb outline-none"
          />
        </div>

        <div>
          <label className="font-semibold">Select a User: </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border border-etuwaCustom-db rounded p-2 bg-etuwaCustom-wb outline-none"
          >
            <option value="All Users">All Users</option>
            {uniqueUsers.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Display Reports */}
      {filteredReports.length === 0 ? (
        <p>No reports available for {formattedSelectedDate}.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((report) => {
            const firstOrLastImage = report.attachment[0]; // First image (use `.slice(-1)[0]` for last image)

            return (
              <div key={report._id} className="border p-4 rounded shadow">
                <p className="text-lg font-semibold">User: {report.userId}</p>
                <p>Date: {report.date || "N/A"}</p>
                <p>Active Time: {report.activeTime || "N/A"}</p>
                <p>Idle Time: {report.idleTime || "N/A"}</p>
                <p>Logged In at {report.createdAt}</p>

                {/* Show one image with hover effect */}
                {firstOrLastImage ? (
                  <div
                    className="relative mt-2 cursor-pointer group"
                    onClick={() => router.push(`/reports/${report._id}`)}
                  >
                    <img
                      src={firstOrLastImage}
                      alt="Screenshot"
                      className="w-auto h-auto object-cover rounded transition duration-300 group-hover:opacity-5 "
                    />
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 text-etuwaCustom-db font-semibold text-lg transition-opacity">
                      View all Images
                    </span>
                  </div>
                ) : (
                  <p>No attachments available.</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReportsDisplay;
