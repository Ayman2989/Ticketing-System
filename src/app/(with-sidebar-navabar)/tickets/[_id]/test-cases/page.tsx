"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TestCaseProps {
  _id: string;
  title: string;
  status: string;
  description: string;
  attachment?: File | null;
}

interface TicketProps {
  _id: string;
  title: string;
}

export default function TestCasePage({ params }: { params: { _id: string } }) {
  const ticketId = params._id;
  const [testCases, setTestCases] = useState<TestCaseProps[] | null>(null);
  const [ticket, setTicket] = useState<TicketProps | null>(null);
  const [loading, setLoading] = useState(true);

  // delete testcase
  const deleteTestCase = async (testCaseId: string) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/tickets/${ticketId}/test-cases/delete/${testCaseId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete test case");

      const data = await res.json();
      setTestCases((prev) =>
        prev ? prev.filter((tc) => tc._id !== testCaseId) : null
      );
      console.log(data.message);
    } catch (error) {
      console.error("Error deleting test case:", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [testCasesRes, ticketRes] = await Promise.all([
          fetch(
            `http://localhost:3000/api/tickets/${ticketId}/test-cases/get-all`,
            { cache: "no-store" }
          ),
          fetch(`http://localhost:3000/api/tickets/${ticketId}`, {
            cache: "no-store",
          }),
        ]);

        if (!testCasesRes.ok || !ticketRes.ok)
          throw new Error("Failed to fetch data");

        const testCasesData = await testCasesRes.json();
        const ticketData = await ticketRes.json();

        setTestCases(testCasesData.testCases);
        setTicket(ticketData.ticket);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center text-red-500">Failed to load ticket.</div>
    );
  }

  return (
    <div className="flex-1 p-4">
      <Link
        href={`/tickets/${ticketId}/test-cases/create-test-case`}
        className="m-2 px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300 font-bold"
      >
        Create Test Case
      </Link>
      <h1 className="text-3xl p-8 font-bold text-etuwaCustom-db">
        Test Cases for Ticket: {ticket.title}
      </h1>

      <div className="p-4">
        <div className="bg-gradient-to-r from-etuwaCustom-b to-etuwaCustom-db text-white mb:flex mb:items-center mb:justify-between sm:grid sm:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] sm:gap-4 p-4 bg-gray-100 rounded-lg shadow-md font-semibold">
          <h3 className="text-center">Title</h3>
          <h3 className="text-center">Status</h3>
          <h3 className="text-center">Actions</h3>
        </div>
        {testCases?.map((testCase) => (
          <div
            className="text-etuwaCustom-db font-medium mb:flex mb:items-center mb:justify-between sm:grid sm:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] sm:gap-4 p-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-102 bg-gradient-to-br from-etuwaCustom-wb to-etuwaCustom-lb relative overflow-hidden m-1"
            key={testCase._id}
          >
            <Link
              href={`/tickets/${ticketId}/test-cases/${testCase._id}`}
              className="text-center"
            >
              {testCase.title}
            </Link>
            <div className="text-center">{testCase.status}</div>
            <div className="flex items-center justify-center space-x-2">
              <Link
                className="bg-violet-500 text-white px-2 py-1 rounded"
                href={`/tickets/${ticketId}/test-cases/${testCase._id}`}
              >
                View
              </Link>
              <Link
                className="bg-green-500 text-white px-2 py-1 rounded transform transition-transform duration-300 hover:scale-105"
                href={`/tickets/${ticketId}/test-cases/${testCase._id}/update`}
              >
                Edit
              </Link>
              <button
                onClick={() => deleteTestCase(testCase._id)}
                className="bg-red-500 text-white px-2 py-1 rounded transform transition-transform duration-300 hover:scale-105"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
