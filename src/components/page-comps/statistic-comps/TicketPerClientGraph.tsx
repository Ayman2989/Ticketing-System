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
  client: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}

const TicketPerClientGraph = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    // Fetch ticket data from the API
    axios
      .get("/api/tickets/get-all") // Replace with your actual API endpoint
      .then((response) => {
        const tickets = response.data.tickets;
        setTickets(tickets);

        // Aggregate tickets per client
        const clientTicketCount = tickets.reduce(
          (acc: Record<string, number>, ticket: Ticket) => {
            acc[ticket.client] = (acc[ticket.client] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        const labels = Object.keys(clientTicketCount);
        const data: number[] = Object.values(clientTicketCount);

        // Generate chart data
        setChartData({
          labels,
          datasets: [
            {
              label: "",
              data: data,
              backgroundColor: labels.map(() => getRandomColor()), // Random colors for each bar
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
      });
  }, []);

  // Helper function to generate random colors
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="p-6">
      {chartData ? (
        <div className="max-w-4xl mx-auto">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Tickets per Client",
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
                },
                legend: {
                  display: false, // Disable the legend
                },
              },
              scales: {
                x: {
                  grid: {
                    color: "#f3f4f6",
                  },
                  ticks: {
                    color: "#4b5568",
                  },
                },
                y: {
                  beginAtZero: true,
                  grid: {
                    color: "#f3f4f6",
                  },
                  ticks: {
                    color: "#4b5563",
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <p className="text-center text-etuwaCustom-db">Loading chart data...</p>
      )}
    </div>
  );
};

export default TicketPerClientGraph;
