"use client";

import { useEffect, useState } from "react";
import ReportsDisplay from "@/components/page-comps/report-comps/ReportDisplay";

interface Report {
  _id: string;
  userId: string;
  activeTime: string;
  idleTime: string;
  date: string;
  attachment: string; // Change from string[] to string (only first image)
  createdAt: string;
}

interface User {
  employee_id: string;
  employee_name: string;
}

const ReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCreatedAt = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString("en-QA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // For AM/PM style
    });
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/reports/get-all", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch reports");
        const data = await res.json();
        setReports(data.reports);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingReports(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    if (reports.length === 0) return;

    setLoadingUsers(true);
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users/get-all", {
          next: { revalidate: 20 },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.users);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [reports]);

  const userMap = new Map<string, string>(
    users.map((user) => [user.employee_id, user.employee_name])
  );

  const updatedReports: Report[] = reports.map((report) => ({
    ...report,
    createdAt: formatCreatedAt(report.createdAt),
    userId: userMap.get(report.userId) ?? "Unknown Employee",
  }));

  if (loadingReports) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg font-semibold mb-2 text-etuwaCustom-b">
          Fetching Reports...
        </p>

        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div>
      {loadingUsers && (
        <p className="text-center text-etuwaCustom-db">Loading user data...</p>
      )}
      <ReportsDisplay reports={updatedReports} />
    </div>
  );
};

export default ReportsPage;
