"use client";
import Table from "@/components/table/Table";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import Modal from "@/components/modal/Modal";
import { UserContext } from "../../../../context";
import { ticketColumns } from "@/data/data";
import TicketFilter from "@/components/page-comps/ticket-comps/TicketFilter";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function page() {
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [entries, setEntries] = useState<number>(10);
  const { userInfo } = useContext(UserContext);
  const [titleSearchTerm, setTitleSearchTerm] = useState<string>(""); // State for title search
  const [clientSearchTerm, setClientSearchTerm] = useState<string>(""); // State for client search
  const [assignedStaffSearchTerm, setAssignedStaffSearchTerm] =
    useState<string>(""); // State for client search
  const [cordinatorSearchTerm, setCoordinatorSearchTerm] = useState<string>(""); // State for coordinator search
  const [issueDateSearchTerm, setIssueDateSearchTerm] = useState<Date | null>(
    null
  );

  const [statusSearchTerm, setStatusSearchTerm] = useState<string>(""); // State for status search
  const [modeOfTicketSearchTerm, setModeOfTicketSearchTerm] =
    useState<string>(""); // State for mode of ticket search
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

  type Ticket = {
    _id: string;
    title: string;
    client?: string;
    tags?: string;
    mode_of_ticket?: string;
    status?: string;
    module?: string;
    issue_date?: string;
    priority?: string;
    issue_type?: string;
    project?: string;
    assigned_to?: string;
    coordinator?: string;
    point_of_contact?: string;
    client_contact_number?: number;
    link?: string;
    completion_time?: string;
    expert_estimation?: string;
    dueDate?: string;
    completed_date?: string;
    ticket_description?: string;
    resolution_points?: string;
  };
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    title: "",
    projectName: "",
    clientName: "",
    status: "",
    issueType: "",
    priority: "",
  });
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const filterByDateRange = (ticket: Ticket) => {
    if (!startDate || !endDate) return true; // If no date range is selected, show all tickets

    const ticketDate = new Date(ticket.issue_date || "");
    return ticketDate >= startDate && ticketDate <= endDate;
  };

  const formatDate = (isoDate: string | Date): string => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const handlePriorityChange = (priority: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  };
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/clients/get-all");
        if (!res.ok) throw new Error("Failed to fetch clients");
        const data = await res.json();
        const clientNames = data.clients.map(
          (client: { client_name: string }) => client.client_name
        );
        setClients(clientNames);
      } catch (error: any) {
        return error.message;
      }
    };
    const fetchStaffs = async () => {
      try {
        const res = await fetch("/api/users/get-all");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        const userNames = data.users.map(
          (user: { employee_name: string }) => user.employee_name
        );
        setStaffs(userNames);
      } catch (error: any) {
        return error.message;
      }
    };
    fetchClients();
    fetchStaffs();
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/tickets/get-all");
        if (!res.ok) throw new Error("Failed to fetch tickets");

        const data = await res.json();

        // ✅ Sort by newest issue_date first
        const sortedTickets = data.tickets.sort(
          (a: Ticket, b: Ticket) =>
            new Date(b.issue_date ?? "").getTime() -
            new Date(a.issue_date ?? "").getTime()
        );

        // ✅ Format after sorting
        const formattedTickets = sortedTickets.map((ticket: Ticket) => ({
          ...ticket,
          issue_date: formatDate(ticket.issue_date ?? ""),
        }));

        const filteredTickets =
          userInfo.role !== "Admin"
            ? formattedTickets.filter(
                (ticket: Ticket) =>
                  ticket.assigned_to === userInfo.employee_name
              )
            : formattedTickets;

        setTickets(filteredTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, [userInfo]); // Add userInfo as a dependency

  const handleTitleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleSearchTerm(e.target.value);
  };

  const handleClientSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setClientSearchTerm(e.target.value);
  };
  const handleAssignedStaffSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setAssignedStaffSearchTerm(e.target.value);
  };
  const handleStatusSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setStatusSearchTerm(e.target.value);
  };
  const handleModeOfTicketSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setModeOfTicketSearchTerm(e.target.value);
  };
  const handleCordinatorSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCoordinatorSearchTerm(e.target.value);
  };
  const handleIssueDateSearch = (date: Date | null) => {
    setIssueDateSearchTerm(date);
  };
  const filteredTickets = tickets.filter((ticket) => {
    const matchesTitle = ticket.title
      .toLowerCase()
      .includes(titleSearchTerm.toLowerCase());
    const matchesClient = ticket.client
      ?.toLowerCase()
      .includes(clientSearchTerm.toLowerCase());
    const matchesAssigned = ticket.assigned_to
      ?.toLowerCase()
      .includes(assignedStaffSearchTerm.toLowerCase());
    const matchesCoordinator = ticket.coordinator
      ?.toLowerCase()
      .includes(cordinatorSearchTerm.toLowerCase());
    const matchesIssueDate = issueDateSearchTerm
      ? ticket.issue_date === formatDate(issueDateSearchTerm)
      : true;
    const matchesStatus = ticket.status
      ?.toLowerCase()
      .includes(statusSearchTerm.toLowerCase());
    const matchesMode = ticket.mode_of_ticket
      ?.toLowerCase()
      .includes(modeOfTicketSearchTerm.toLowerCase());
    const matchesDateRange = filterByDateRange(ticket);

    const matchesPriority =
      selectedPriorities.length === 0 ||
      selectedPriorities.length === 3 ||
      selectedPriorities.includes(ticket.priority || "");

    return (
      matchesTitle &&
      matchesClient &&
      matchesAssigned &&
      matchesStatus &&
      matchesMode &&
      matchesDateRange &&
      matchesPriority &&
      matchesCoordinator &&
      matchesIssueDate
    );
  });

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date && endDate && date > endDate) {
      setEndDate(null); // Reset end date if it's earlier than the start date
    }
  };
  const filterTicketsDueToday = () => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

    return tickets.filter((ticket) => {
      const formattedDueDate = ticket.dueDate
        ? formatDate(ticket.dueDate)
        : null;
      return (
        formattedDueDate && formattedDueDate.split("T")[0] === formatDate(today)
      );
    });
  };
  const dueTodayTickets = filterTicketsDueToday();
  const [clients, setClients] = useState<string[]>([]);
  const [staffs, setStaffs] = useState<string[]>([]);

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Define table column headers
    const columns = [
      "Title",
      "Client",
      "Status",
      "Assigned To",
      "Issue Date",
      "Priority",
    ];

    // Prepare rows using filteredTickets
    const rows = filteredTickets.map((ticket) => [
      ticket.title,
      ticket.client || "",
      ticket.status || "",
      ticket.assigned_to || "",
      ticket.issue_date || "",
      ticket.priority || "",
    ]);

    // Generate the table
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20,
    });

    doc.save("tickets.pdf");
  };

  return (
    <div className="pl-1">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl text-etuwaCustom-db font-bold mb-4 pl-2 mt-4 p-2">
          Tickets
        </h1>
        <div className="flex items-center justify-between space-x-4 mb-4">
          <div className="relative z-50 flex items-center space-x-4">
            <button
              className=" bg-gradient-to-r from-etuwaCustom-b to-etuwaCustom-db font-normal text-white px-4 py-2 rounded-md transition-all ease-in-out duration-300"
              onClick={exportToPDF}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                className="h-5 w-5"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"></path>
                <rect x="6" y="14" width="12" height="8" rx="1"></rect>
              </svg>
            </button>
          </div>
          <div className=" flex items-center font-medium text-etuwaCustom-db ">
            <select
              className="bg-etuwaCustom-wb"
              value={entries}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
              ) => setEntries(parseInt(e.target.value))}
            >
              <option className="bg-etuwaCustom-wb" value={10}>
                10
              </option>
              <option className="bg-etuwaCustom-wb" value={25}>
                25
              </option>
              <option className="bg-etuwaCustom-wb" value={50}>
                50
              </option>
              <option className="bg-etuwaCustom-wb" value={100}>
                100
              </option>
            </select>
            <h1>Entries Per Page</h1>
          </div>
        </div>
      </div>

      {dueTodayTickets.length > 0 && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-4">
          <h2 className="text-lg font-semibold">Due Today Tickets</h2>
          <p className="text-sm">
            You have {dueTodayTickets.length} ticket(s) due today.
          </p>
          {dueTodayTickets.map((ticket, index) => (
            <div
              key={index}
              className="text-etuwaCustom-db font-medium mb:flex mb:items-center mb:justify-between sm:grid sm:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] sm:gap-4 p-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-102 bg-gradient-to-br from-etuwaCustom-wb to-etuwaCustom-lb relative overflow-hidden m-1"
            >
              <Link href={`/tickets/${ticket._id}`} className="pl-3">
                <li key={ticket._id}>
                  {ticket.title} - {ticket.client}
                </li>
              </Link>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between mb-2">
        <Link
          prefetch
          href="/tickets/create-tickets"
          className="px-3 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300 font-bold"
        >
          New Ticket
        </Link>

        <div className="flex items-center justify-center gap-4 mb-2">
          <label className="relative flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-5 h-5"
              checked={selectedPriorities.includes("High")}
              onChange={() => handlePriorityChange("High")}
            />
            <span className="text-sm font-bold text-red-600">
              High Priority
            </span>
          </label>

          <label className="relative flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-5 h-5"
              checked={selectedPriorities.includes("Medium")}
              onChange={() => handlePriorityChange("Medium")}
            />
            <span className="text-sm font-bold text-yellow-600">
              Medium Priority
            </span>
          </label>

          <label className="relative flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-5 h-5"
              checked={selectedPriorities.includes("Low")}
              onChange={() => handlePriorityChange("Low")}
            />
            <span className="text-sm font-bold text-green-600">
              Low Priority
            </span>
          </label>
        </div>
      </div>

      {/* <div className="flex items-center flex-row-reverse justify-between"> */}
      {/* <div className="mb-4">
          <span className="font-semibold text-etuwaCustom-db">
            Filter By Date Range:{" "}
          </span>
          <div className="flex space-x-4">
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
              className="px-3 py-2 border-etuwaCustom-db border-2 rounded-lg outline-none"
              dateFormat="dd/MM/yyyy"
            />
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || undefined} // minDate is now the start date to ensure end date is always after start date
              placeholderText="End Date"
              className="px-3 py-2 border-etuwaCustom-db border-2 rounded-lg outline-none"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div> */}
      {/* </div> */}
      <div>
        <Table
          clientOptions={clients}
          staffOptions={staffs}
          columns={ticketColumns}
          filters={{
            titleSearchTerm,
            clientSearchTerm,
            assignedStaffSearchTerm,
            statusSearchTerm,
            modeOfTicketSearchTerm,
            cordinatorSearchTerm,
            issueDateSearchTerm,
          }}
          handlers={{
            handleTitleSearch,
            handleClientSearch,
            handleAssignedStaffSearch,
            handleStatusSearch,
            handleModeOfTicketSearch,
            handleCordinatorSearch,
            handleIssueDateSearch,
          }}
          data={filteredTickets}
          entries={entries}
          setTickets={setTickets}
        />
      </div>
    </div>
  );
}

export default page;
