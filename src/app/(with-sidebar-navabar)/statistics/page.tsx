"use client";

import React, { useState } from "react";
import TicketPerClientGraph from "../../../components/page-comps/statistic-comps/TicketPerClientGraph";
import TicketPriorityChart from "../../../components/page-comps/statistic-comps/TicketPriorityChart";
import TicketStatusChart from "@/components/page-comps/statistic-comps/TicketStatusChart";
import TicketIncreaseChart from "@/components/page-comps/statistic-comps/TicketIncreaseGraph";
import CompletedTicketsByUserGraph from "../../../components/page-comps/statistic-comps/CompletedTicketsByUserGraph";

const StatisticsPage = () => {
  // State to toggle visibility of each graph
  const [visibleGraphs, setVisibleGraphs] = useState({
    ticketPerClient: false,
    ticketPriority: false,
    ticketStatus: false,
    ticketIncrease: false,
    completedTicketsByUser: false,
  });

  // Toggle function for each graph
  const toggleGraphVisibility = (graph: any) => {
    setVisibleGraphs((prevState: any) => ({
      ...prevState,
      [graph]: !prevState[graph],
    }));
  };

  return (
    <div className="p-6  ">
      <h1 className="text-3xl font-semibold text-center mb-8 text-etuwaCustom-db">
        Ticket Statistics
      </h1>

      {/* Toggle Buttons */}
      <div className="flex justify-around mb-4 font-medium">
        <button
          className="bg-gradient-to-r  from-etuwaCustom-b to-etuwaCustom-db text-white py-2 px-4 rounded-lg mr-2 hover:scale-95 transition duration-300"
          onClick={() => toggleGraphVisibility("ticketPerClient")}
        >
          Tickes Per Client
        </button>
        <button
          className="bg-gradient-to-r  from-etuwaCustom-b to-etuwaCustom-db text-white py-2 px-4 rounded-lg mr-2 hover:scale-95 transition duration-300"
          onClick={() => toggleGraphVisibility("ticketPriority")}
        >
          Tickets Priority Chart
        </button>
        <button
          className="bg-gradient-to-r  from-etuwaCustom-b to-etuwaCustom-db text-white py-2 px-4 rounded-lg mr-2 hover:scale-95 transition duration-300"
          onClick={() => toggleGraphVisibility("ticketStatus")}
        >
          Tickets Status Chart
        </button>
        <button
          className="bg-gradient-to-r  from-etuwaCustom-b to-etuwaCustom-db text-white py-2 px-4 rounded-lg mr-2 hover:scale-95 transition duration-300"
          onClick={() => toggleGraphVisibility("ticketIncrease")}
        >
          Ticket Increase Graph
        </button>
        <button
          className="bg-gradient-to-r  from-etuwaCustom-b to-etuwaCustom-db text-white py-2 px-4 rounded-lg hover:scale-95 transition duration-300"
          onClick={() => toggleGraphVisibility("completedTicketsByUser")}
        >
          Completed Tickets by User Graph
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-5">
        {visibleGraphs.ticketPerClient && (
          <div className="bg-etuwaCustom-wb shadow-md rounded-lg p-4 overflow-auto">
            <TicketPerClientGraph />
          </div>
        )}

        {visibleGraphs.ticketIncrease && (
          <div className="bg-etuwaCustom-wbbg-etuwaCustom-wbbg-etuwaCustom-wb shadow-md rounded-lg p-4 min-h-[300px] overflow-auto">
            <TicketIncreaseChart />
          </div>
        )}

        {visibleGraphs.completedTicketsByUser && (
          <div className="bg-etuwaCustom-wbbg-etuwaCustom-wb shadow-md rounded-lg p-4 min-h-[300px] overflow-auto">
            <CompletedTicketsByUserGraph />
          </div>
        )}

        {visibleGraphs.ticketPriority && (
          <div className="bg-etuwaCustom-wb shadow-md rounded-lg p-4 min-h-[300px] overflow-auto">
            <TicketPriorityChart />
          </div>
        )}

        {visibleGraphs.ticketStatus && (
          <div className="bg-etuwaCustom-wb rounded-lg p-4 min-h-[300px] overflow-auto">
            <TicketStatusChart />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsPage;
