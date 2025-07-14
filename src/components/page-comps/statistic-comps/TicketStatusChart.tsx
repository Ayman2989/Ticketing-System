"use client";

import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

interface Ticket {
  _id: string;
  status: string; // Added the status field
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}

const TicketStatusChart = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [statusChartData, setStatusChartData] = useState<ChartData | null>(
    null
  );
  const [statusCount, setStatusCount] = useState<Record<string, number>>({}); // Store the count of tickets per status

  useEffect(() => {
    // Fetch ticket data from the API
    axios
      .get("/api/tickets/get-all") // Replace with your actual API endpoint
      .then((response) => {
        const tickets = response.data.tickets;
        setTickets(tickets);

        // Aggregate tickets by status (e.g., New, In Progress, Open, etc.)
        const statusCount = tickets.reduce(
          (acc: Record<string, number>, ticket: Ticket) => {
            const status = ticket.status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        const totalTickets = tickets.length;
        setStatusCount(statusCount); // Save the actual count

        const labels = Object.keys(statusCount);
        const data: number[] = Object.values(statusCount);

        // Calculate the percentage for each status
        const percentageData = data.map((count) =>
          ((count / totalTickets) * 100).toFixed(2)
        );

        // Generate chart data for the pie chart
        setStatusChartData({
          labels,
          datasets: [
            {
              label: "Ticket Status Distribution",
              data: percentageData.map((val) => parseFloat(val)), // Convert percentages back to numbers
              backgroundColor: [
                "#FF5733",
                "#FFBF00",
                "#00C851",
                "#2980B9",
                "#8E44AD",
                "#F39C12",
              ], // Custom colors for each status
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
      {statusChartData ? (
        <div className="max-w-4xl mx-auto">
          <Pie
            data={statusChartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Ticket Status Distribution",
                  font: {
                    size: 20,
                    weight: "bold",
                  },
                },
                tooltip: {
                  callbacks: {
                    // Display both the percentage and the count in the tooltip
                    label: (tooltipItem) => {
                      const label = tooltipItem.label;
                      const percentage = tooltipItem.raw as number;
                      const count = statusCount[label]; // Get the count from the statusCount state
                      return `${label}: ${percentage.toFixed(
                        2
                      )}% (${count} tickets)`;
                    },
                  },
                  backgroundColor: "#f9fafb",
                  titleColor: "#111827",
                  bodyColor: "#6b7280",
                  borderColor: "#ddd",
                  borderWidth: 1,
                  padding: 10,
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

export default TicketStatusChart;
