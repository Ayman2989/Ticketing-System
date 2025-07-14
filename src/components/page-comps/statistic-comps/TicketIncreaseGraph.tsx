"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

interface Ticket {
  _id: string;
  issue_date: string; // Added the issue_date field
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
    tension: number;
  }[];
}

const TicketIncreaseChart = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketIncreaseData, setTicketIncreaseData] =
    useState<ChartData | null>(null);

  useEffect(() => {
    // Fetch ticket data from the API
    axios
      .get("/api/tickets/get-all") // Replace with your actual API endpoint
      .then((response) => {
        const tickets = response.data.tickets;
        setTickets(tickets);

        // Group tickets by their issue_date (year-month)
        const dateCount: Record<string, number> = {};

        tickets.forEach((ticket: any) => {
          const date = new Date(ticket.issue_date);
          const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`; // format as "YYYY-MM"
          dateCount[formattedDate] = (dateCount[formattedDate] || 0) + 1;
        });

        // Sort the dates (in ascending order)
        const sortedDates = Object.keys(dateCount).sort();
        const ticketCounts = sortedDates.map((date) => dateCount[date]);

        // Generate cumulative ticket count for each month
        const cumulativeCounts = ticketCounts.map((count, index) => {
          return ticketCounts.slice(0, index + 1).reduce((a, b) => a + b, 0);
        });

        // Generate chart data for the line chart
        setTicketIncreaseData({
          labels: sortedDates,
          datasets: [
            {
              label: "Tickets Over Time",
              data: cumulativeCounts,
              fill: false,
              borderColor: "#2980B9", // Line color
              tension: 0.2,
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
      {ticketIncreaseData ? (
        <div className="max-w-4xl mx-auto">
          <Line
            data={ticketIncreaseData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Ticket Increase Over Time",
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
                    // Format the tooltip to show the cumulative ticket count for that month
                    label: (tooltipItem) => {
                      const label = tooltipItem.label;
                      const value = tooltipItem.raw as number;
                      return `${label}: ${value} tickets`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Year-Month",
                    font: {
                      size: 14,
                      weight: "bold",
                    },
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Cumulative Ticket Count",
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

export default TicketIncreaseChart;
