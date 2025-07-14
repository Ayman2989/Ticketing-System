"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

interface Ticket {
  _id: string;
  status: string; // status field to filter closed tickets
  assigned_to: string; // employee or user assigned to the ticket
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

const CompletedTicketsByUserChart = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [closedTicketsData, setClosedTicketsData] = useState<ChartData | null>(
    null
  );

  useEffect(() => {
    // Fetch ticket data from the API
    axios
      .get("/api/tickets/get-all") // Replace with your actual API endpoint
      .then((response) => {
        const tickets = response.data.tickets;
        setTickets(tickets);

        // Filter closed tickets
        const closedTickets = tickets.filter(
          (ticket: Ticket) => ticket.status === "Completed"
        );

        // Group closed tickets by assigned_to (employee)
        const userTicketCount: Record<string, number> = {};

        closedTickets.forEach((ticket: Ticket) => {
          const user = ticket.assigned_to;
          userTicketCount[user] = (userTicketCount[user] || 0) + 1;
        });

        // Generate chart data for the bar chart
        const users = Object.keys(userTicketCount);
        const ticketCounts = users.map((user) => userTicketCount[user]);

        setClosedTicketsData({
          labels: users,
          datasets: [
            {
              label: "Completed Tickets by Users",
              data: ticketCounts,
              backgroundColor: "#2980B9", // Bar color
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
      });
  }, []);

  return (
    <div className="p-6">
      {closedTicketsData ? (
        <div className="max-w-4xl mx-auto">
          <Bar
            data={closedTicketsData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Closed Tickets by Users",
                  font: {
                    size: 20,
                    weight: "bold",
                  },
                },
                tooltip: {
                  backgroundColor: "#f9fafb",
                  titleColor: "#111827",
                  bodyColor: "#6b7280",
                  borderColor: "#ddd",
                  borderWidth: 1,
                  padding: 10,
                  callbacks: {
                    // Format the tooltip to show the count for each user
                    label: (tooltipItem) => {
                      const label = tooltipItem.label;
                      const value = tooltipItem.raw as number;
                      return `${label}: ${value} closed tickets`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Users (Assigned To)",
                    font: {
                      size: 14,
                      weight: "bold",
                    },
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Closed Ticket Count",
                    font: {
                      size: 14,
                      weight: "bold",
                    },
                  },
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      ) : (
        <p className="text-center">Loading chart data...</p>
      )}
    </div>
  );
};

export default CompletedTicketsByUserChart;
