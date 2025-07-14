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
  priority: string; // Added the priority field
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}

const TicketPriorityChart = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [priorityChartData, setPriorityChartData] = useState<ChartData | null>(
    null
  );
  const [priorityCount, setPriorityCount] = useState<Record<string, number>>(
    {}
  ); // Store count of tickets per priority

  useEffect(() => {
    // Fetch ticket data from the API
    axios
      .get("/api/tickets/get-all") // Replace with your actual API endpoint
      .then((response) => {
        const tickets = response.data.tickets;
        setTickets(tickets);

        // Aggregate tickets by priority (High, Medium, Low)
        const priorityCount = tickets.reduce(
          (acc: Record<string, number>, ticket: Ticket) => {
            const priority = ticket.priority;
            acc[priority] = (acc[priority] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        const totalTickets = tickets.length;
        setPriorityCount(priorityCount); // Save the actual count

        const labels = Object.keys(priorityCount);
        const data: number[] = Object.values(priorityCount);

        // Calculate the percentage for each priority
        const percentageData = data.map((count) =>
          ((count / totalTickets) * 100).toFixed(2)
        );

        // Generate chart data for the pie chart
        setPriorityChartData({
          labels,
          datasets: [
            {
              label: "Ticket Priority Distribution",
              data: percentageData.map((val) => parseFloat(val)), // Convert percentages back to numbers
              backgroundColor: ["#FF5733", "#FFBF00", "#00C851"], // Custom colors for each priority
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
      {priorityChartData ? (
        <div className="max-w-4xl mx-auto">
          <Pie
            data={priorityChartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Ticket Priority Distribution",
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
                      const count = priorityCount[label]; // Get the count from the priorityCount state
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

export default TicketPriorityChart;
