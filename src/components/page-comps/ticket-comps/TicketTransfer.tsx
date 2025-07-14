"use client";

import axios from "axios";
import { set } from "mongoose";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const TicketTransfer = ({ _id }: { _id: string }) => {
  const router = useRouter();
  const [trasnferTicket, setTransferTicket] = useState(false);
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleTransfer = async (ticketId: string) => {
    if (!selectedUser) {
      alert("Please select a user before transferring.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `http://localhost:3000/api/tickets/transfer-ticket/${ticketId}`,
        {
          selectedUser: selectedUser,
        }
      );
      router.push(`/tickets`);
    } catch (error: any) {
      console.error(
        "Error transferring ticket:",
        error.response?.data || error.message
      );
      alert("Failed to transfer ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users/get-all");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        const userNames = data.users.map(
          (user: { employee_name: string }) => user.employee_name
        );
        console.log(userNames);

        setUsers(userNames);
      } catch (error: any) {
        return error.message;
      }
    };
    fetchUsers();
  }, []);
  useEffect(() => {
    console.log(selectedUser);
  }, [selectedUser]);

  return (
    <div className="p-4">
      <button
        onClick={() => setTransferTicket(!trasnferTicket)}
        className="px-6 py-2 bg-etuwaCustom-db text-white font-medium rounded-lg hover:bg-white border-2 border-etuwaCustom-db hover:text-etuwaCustom-db transtion duration-300"
      >
        Ticket Transfer
      </button>
      {trasnferTicket && (
        <>
          <h1 className="m-2 text-etuwaCustom-db">
            Who do you want to transfer this ticket to?
          </h1>
          <div className="m-2">
            <select
              id="selectedUser"
              value={selectedUser || ""}
              className={`w-full border border-gray-300 focus:border-etuwaCustom  focus:outline-none  rounded-lg p-2`}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value=""></option>
              {users.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4 pt-3">
            <button
              onClick={() => handleTransfer(_id)}
              className="px-6 py-2 bg-etuwaCustom-db text-white font-medium rounded-lg hover:bg-white border-2 border-etuwaCustom-db hover:text-etuwaCustom-db transtion duration-300"
            >
              {loading ? "Transferring" : "Transfer"}
            </button>
            <button
              onClick={() => setTransferTicket(!trasnferTicket)}
              className="px-6 py-2 bg-white text-etuwaCustom-db rounded-lg font-medium hover:scale-95  border-2 border-etuwaCustom-db transtion duration-300"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TicketTransfer;
