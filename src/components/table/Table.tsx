"use client";
import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";

interface TableProps {
  clientOptions: string[];
  staffOptions: string[];
  columns: any[];
  data: any[];
  entries: number;
  setTickets: (arg: any) => void;
  filters: {
    titleSearchTerm: string;
    clientSearchTerm: string;
    assignedStaffSearchTerm: string;
    cordinatorSearchTerm?: string; // Optional if not used
    issueDateSearchTerm?: Date | null; // Optional if not used
    statusSearchTerm: string;
    modeOfTicketSearchTerm: string;
  };
  handlers: {
    handleTitleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClientSearch: (e: React.ChangeEvent<any>) => void;
    handleAssignedStaffSearch: (e: React.ChangeEvent<any>) => void;
    handleCordinatorSearch: (e: React.ChangeEvent<any>) => void;
    handleStatusSearch: (e: React.ChangeEvent<any>) => void;
    handleModeOfTicketSearch: (e: React.ChangeEvent<any>) => void;
    handleIssueDateSearch: (date: Date | null) => void; // Optional if not used
  };
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  entries,
  setTickets,
  filters,
  handlers,
  clientOptions,
  staffOptions,
}) => {
  const router = useRouter();

  const [pagination, setPagination] = useState({
    pageIndex: 0, // Zero-based page index
    pageSize: entries, // Number of rows per page
  });
  useEffect(() => {
    setPagination((curr) => ({
      ...curr, // Preserve other properties of the state
      pageSize: entries, // Update pageSize based on entries
    }));
  }, [entries]);

  const currentData = React.useMemo(
    () =>
      data.slice(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize
      ),
    [data, pagination]
  );

  const table = useReactTable({
    data: currentData, // Only pass the current page's data
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true, // Enable manual pagination
    pageCount: Math.ceil(data.length / pagination.pageSize),
  });
  const handleDelete = async (selectedTicketId: string) => {
    if (!selectedTicketId) return; // Ensure a ticket ID is selected.

    try {
      const res = await axios.delete(`/api/tickets/delete/${selectedTicketId}`);
      // setSelectedTicketId(null);
      // setIsModalOpen(false); // Close the modal after deletion.
      router.push(`/tickets`);
      setTickets((prev: any) =>
        prev.filter((ticket: any) => ticket._id !== selectedTicketId)
      ); // Update state after deletion
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
      {/* Table */}
      <table className="w-full table-auto border-collapse shadow-lg">
        <thead className=" bg-gradient-to-r  from-etuwaCustom-b to-etuwaCustom-db  text-white">
          {table.getHeaderGroups().map((headerGroup, index) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const column = columns.find(
                  (col) => col.accessorKey === header.column.id
                );
                console.log(header.column);

                return (
                  <th
                    key={header.id}
                    className={` px-4 py-2 text-left font-semibold ${
                      column?.hidden?.sm ? "hidden sm:table-cell" : ""
                    } ${column?.hidden?.md ? "hidden lg:table-cell" : ""} ${
                      column?.hidden?.xl ? "hidden xl:table-cell" : ""
                    } `}
                  >
                    {header.column.id === "title" ? (
                      <input
                        type="text"
                        value={filters.titleSearchTerm}
                        onChange={handlers.handleTitleSearch}
                        placeholder={`${header.column.columnDef.header}`}
                        className="w-full bg-transparent placeholder-white text-white border-none focus:outline-none focus:ring-0"
                      />
                    ) : header.column.id === "issue_date" ? (
                      <div className="flex items-center w-max">
                        <DatePicker
                          selected={filters.issueDateSearchTerm}
                          onChange={handlers.handleIssueDateSearch}
                          selectsStart
                          placeholderText="Date"
                          className="w-[6.5rem] bg-transparent placeholder-white text-white border-none focus:outline-none focus:ring-0 text-sm"
                          dateFormat="dd/MM/yyyy"
                        />
                        <button
                          onClick={() => handlers.handleIssueDateSearch(null)}
                          className="text-white text-sm"
                          title="Clear"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <select
                        value={
                          header.column.id === "client"
                            ? filters.clientSearchTerm
                            : header.column.id === "assigned_to"
                            ? filters.assignedStaffSearchTerm
                            : header.column.id === "coordinator"
                            ? filters.cordinatorSearchTerm
                            : header.column.id === "status"
                            ? filters.statusSearchTerm
                            : filters.modeOfTicketSearchTerm
                        }
                        onChange={
                          header.column.id === "client"
                            ? handlers.handleClientSearch
                            : header.column.id === "assigned_to"
                            ? handlers.handleAssignedStaffSearch
                            : header.column.id === "coordinator"
                            ? handlers.handleCordinatorSearch
                            : header.column.id === "status"
                            ? handlers.handleStatusSearch
                            : handlers.handleModeOfTicketSearch
                        }
                        className="w-full bg-transparent text-white border-none focus:outline-none focus:ring-0"
                      >
                        <option value="">{`${header.column.columnDef.header}`}</option>
                        {header.column.id === "client" &&
                          clientOptions.map((client) => (
                            <option
                              key={client}
                              value={client}
                              className="text-etuwaCustom-db"
                            >
                              {client}
                            </option>
                          ))}
                        {header.column.id === "assigned_to" &&
                          staffOptions.map((staff) => (
                            <option
                              key={staff}
                              value={staff}
                              className="text-etuwaCustom-db"
                            >
                              {staff}
                            </option>
                          ))}
                        {header.column.id === "coordinator" &&
                          staffOptions.map((staff) => (
                            <option
                              key={staff}
                              value={staff}
                              className="text-etuwaCustom-db"
                            >
                              {staff}
                            </option>
                          ))}

                        {header.column.id === "status" &&
                          [
                            "New",
                            "Pending",
                            "Testing",
                            "Dropped",
                            "Completed",
                            "Not Required",
                            "No Issue",
                            "Not Started",
                            "In Progress",
                          ].map((status) => (
                            <option
                              key={status}
                              value={status}
                              className="text-etuwaCustom-db"
                            >
                              {status}
                            </option>
                          ))}
                        {header.column.id === "mode_of_ticket" &&
                          [
                            "Email",
                            "Phone",
                            "Whatsapp-Personal",
                            "Whatsapp-Group",
                          ].map((mode) => (
                            <option
                              key={mode}
                              value={mode}
                              className="text-etuwaCustom-db"
                            >
                              {mode}
                            </option>
                          ))}
                      </select>
                    )}
                  </th>
                );
              })}
              {index === 0 && ( // Ensure the header row gets the Actions header only once
                <th className="px-4 py-2 text-center font-semibold">Actions</th>
              )}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            // Get the priority for the current row
            const priority = row.original.priority;

            // Define the hover color based on priority
            const hoverClass =
              priority === "High"
                ? "hover:bg-red-200"
                : priority === "Medium"
                ? "hover:bg-yellow-200"
                : "hover:bg-green-200";

            return (
              <tr
                key={row.id}
                className={` border-b transition duration-200 ${hoverClass} hover:scale-102 text-etuwaCustom-db font-medium`}
              >
                {row.getVisibleCells().map((cell) => {
                  const column = columns.find(
                    (col) => col.accessorKey === cell.column.id
                  );
                  return (
                    <td
                      key={cell.id}
                      className={` cursor-pointer px-4 py-2 ${
                        column?.hidden?.sm ? "hidden sm:table-cell" : ""
                      } ${column?.hidden?.md ? "hidden lg:table-cell" : ""} ${
                        column?.hidden?.xl ? "hidden xl:table-cell" : ""
                      }`}
                    >
                      <div
                        className="truncate max-w-[400px]" // Adjust max width as needed
                        title={String(cell.getValue())}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </td>
                  );
                })}
                <td className="px-4 py-2">
                  <div className="space-x-2 flex items-center justify-center">
                    <Link
                      prefetch
                      className="bg-violet-500 text-white px-2 py-1 rounded"
                      href={`/tickets/${row.original._id}`}
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
                      prefetch
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      href={`/tickets/${row.original._id}/update`}
                      replace
                    >
                      <svg
                        className="h-5 w-5 text-gray-100"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        handleDelete(row.original._id);
                      }}
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
                        <line x1="4" y1="7" x2="20" y2="7" />{" "}
                        <line x1="10" y1="11" x2="10" y2="17" />{" "}
                        <line x1="14" y1="11" x2="14" y2="17" />{" "}
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />{" "}
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              pageIndex: Math.max(prev.pageIndex - 1, 0),
            }))
          }
          disabled={pagination.pageIndex === 0}
          className="bg-etuwaCustom-db text-white px-3 py-1 rounded disabled:opacity-75"
        >
          Previous
        </button>
        <span className="text-etuwaCustom-db">
          Page {pagination.pageIndex + 1} of{" "}
          {Math.ceil(data.length / pagination.pageSize)}
        </span>
        <button
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              pageIndex: Math.min(
                prev.pageIndex + 1,
                Math.ceil(data.length / pagination.pageSize) - 1
              ),
            }))
          }
          disabled={
            pagination.pageIndex ===
            Math.ceil(data.length / pagination.pageSize) - 1
          }
          className="bg-etuwaCustom-db text-white px-3 py-1 rounded disabled:opacity-75"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
