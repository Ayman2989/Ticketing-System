"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Clienttype {
  _id: string;
  client_name: string;
  status: string;
}

function Page() {
  const [clienttypes, setClienttypes] = useState<Clienttype[]>([]);

  useEffect(() => {
    const fetchClienttypes = async () => {
      try {
        const res = await fetch("/api/client-types/get-all");
        if (!res.ok) throw new Error("Failed to fetch client-types");

        const data = await res.json();
        setClienttypes(data.clientTypes);
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchClienttypes();
  }, []);
  const handleDelete = async (_id: string) => {
    try {
      await axios.delete(`/api/client-types/delete/${_id}`);
      setClienttypes((prev) => prev.filter((client) => client._id !== _id)); // Update state after deletion
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 p-4">
      <Link
        href="/client-types/create-client-type"
        className="m-2 px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300 font-bold"
      >
        Create Client Type
      </Link>
      <h1 className="text-3xl p-8 font-bold text-etuwaCustom-db">
        Client Types
      </h1>
      <div className="p-4">
        <div className="bg-gradient-to-r from-etuwaCustom-b to-etuwaCustom-db text-white mb:flex mb:items-center mb:justify-between sm:grid sm:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] sm:gap-4 p-4 bg-gray-100 rounded-lg shadow-md font-semibold">
          <h3 className="text-center">Client Name</h3>
          <h3 className="text-center">Actions</h3>
        </div>
        {clienttypes.map((clienttype) => (
          <div
            className="text-etuwaCustom-db font-medium mb:flex mb:items-center mb:justify-between sm:grid sm:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] sm:gap-4 p-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-102 bg-gradient-to-br from-etuwaCustom-wb to-etuwaCustom-lb relative overflow-hidden m-1"
            key={clienttype._id}
          >
            <Link
              href={`/client-types/${clienttype._id}`}
              className="text-center "
            >
              {clienttype.client_name}
            </Link>

            <div className="flex items-center justify-center space-x-2">
              <Link
                prefetch
                className="bg-violet-500 text-white px-2 py-1 rounded"
                href={`/client-types/${clienttype._id}`}
              >
                <svg
                  className="h-5 w-5 text-gray-100"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  {" "}
                  <path stroke="none" d="M0 0h24v24H0z" />{" "}
                  <circle cx="12" cy="12" r="2" />{" "}
                  <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />{" "}
                  <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" />
                </svg>
              </Link>
              <Link
                href={`/client-types/${clienttype._id}/update`}
                prefetch
                className="bg-green-500 text-white px-2 py-1 rounded transform transition-transform duration-300 hover:scale-105"
              >
                <svg
                  className="h-5 w-5 text-gray-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </Link>
              <button
                onClick={() => handleDelete(clienttype._id)}
                className="bg-red-500 text-white px-2 py-1 rounded transform transition-transform duration-300 hover:scale-105"
              >
                <svg
                  className="h-5 w-5 text-gray-100"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
