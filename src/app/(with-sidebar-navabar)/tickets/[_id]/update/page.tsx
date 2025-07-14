"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as Tabs from "@radix-ui/react-tabs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const page = () => {
  interface TicketType {
    title: string;
    client: string;
    tags?: string;
    mode_of_ticket: string;
    status: string;
    module: string;
    issue_date: string;
    priority: string;
    issue_type: string;
    project: string;
    assigned_to: string;
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
    remarks?: string;
  }

  const { _id } = useParams(); // Extract the dynamic `id` from the URL
  const [ticket, setTicket] = useState<TicketType>();
  const [clients, setClients] = useState([]);
  const [modules, setModules] = useState([]);
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/tickets/${_id}`);
        const data = await response.json();
        if (data.ticket) {
          data.ticket.issue_date = new Date(data.ticket.issue_date)
            .toISOString()
            .split("T")[0];
          reset(data.ticket); // Update all form values at once
        }
        setTicket(data.ticket);
        console.log(data.ticket);
      } catch (error) {
        console.log(error);
      }
    };
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
    const fetchModules = async () => {
      try {
        const res = await fetch("/api/modules/get-all");
        if (!res.ok) throw new Error("Failed to fetch modules");
        const data = await res.json();
        const moduleNames = data.modules.map(
          (module: { module_name: string }) => module.module_name
        );
        setModules(moduleNames);
      } catch (error: any) {
        return error.message;
      }
    };
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects/get-all");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        const projectNames = data.projects.map(
          (project: { project_name: string }) => project.project_name
        );
        setProjects(projectNames);
      } catch (error: any) {
        return error.message;
      }
    };
    const fetchIssues = async () => {
      try {
        const res = await fetch("/api/issues/get-all");
        if (!res.ok) throw new Error("Failed to fetch issues");
        const data = await res.json();
        const issueNames = data.issues.map(
          (issue: { issue: string }) => issue.issue
        );
        setIssues(issueNames);
      } catch (error: any) {
        return error.message;
      }
    };
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users/get-all");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        const userNames = data.users.map(
          (user: { employee_name: string }) => user.employee_name
        );
        setUsers(userNames);
      } catch (error: any) {
        return error.message;
      }
    };
    fetchTicket();
    fetchClients();
    fetchIssues();
    fetchModules();
    fetchProjects();
    fetchUsers();
  }, []);
  const router = useRouter();
  const { register, handleSubmit, setValue, reset } = useForm<TicketType>({
    defaultValues: {
      title: "",
      client: "",
      tags: "",
      mode_of_ticket: "",
      status: "Open",
      module: "",
      issue_date: "",
      priority: "Low",
      issue_type: "",
      assigned_to: "",
      coordinator: "",
      point_of_contact: "",
      client_contact_number: 0,
      link: "",
      completion_time: "",
      expert_estimation: "",
      dueDate: "",
      completed_date: "",
      ticket_description: "",
      resolution_points: "",
      remarks: "",
    },
  });
  const [tabsActive, setTabsActive] = useState("general"); // Track the active tab
  const [loading, setLoading] = useState(false);

  const isAdditionalTabActive = tabsActive === "additional";
  const onSubmit: SubmitHandler<TicketType> = async (data) => {
    try {
      setLoading(true);
      const res = await axios.put(`/api/tickets/update/${_id}`, data);
      console.log("submitted");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    router.push("/tickets");
  };

  return (
    <>
      <Tabs.Root
        defaultValue="general"
        value={tabsActive}
        onValueChange={setTabsActive} // Update the active tab when it changes
        className="max-w-full p-4 text-etuwaCustom-db border rounded-md shadow-md bg-gradient-to-tl from-white to-etuwaCustom-lb"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-full p-4 ">
          <div className="flex items-center justify-between">
            <Tabs.List className="flex space-x-4 pb-2">
              <Tabs.Trigger
                value="general"
                className="px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:border-etuwaCustom-db hover:bg-white transition duration-300 rounded-lg"
              >
                General Info
              </Tabs.Trigger>
              <Tabs.Trigger
                value="additional"
                className="px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:border-etuwaCustom-db hover:bg-white transition duration-300 rounded-lg"
              >
                Additional Info
              </Tabs.Trigger>
            </Tabs.List>
            <div className="flex items-center justify-between space-x-2">
              <button
                type="submit"
                className="px-6 py-2 bg-etuwaCustom-db text-white font-medium rounded-md hover:scale-95 transtion duration-300"
              >
                {loading ? "Updating" : "Update"}
              </button>
              <button
                type="reset"
                className="px-6 py-2 border border-etuwaCustom-db rounded-md bg-white-100 text-etuwaCustom-db hover:scale-95 transtion duration-300 font-medium"
              >
                Reset
              </button>
            </div>
          </div>
          {/* General Info Tab */}
          <Tabs.Content value="general" className="mt-4">
            <div className="md:grid md:grid-cols-2 md:gap-6 ">
              <div className="m-2 ">
                <label htmlFor="title" className="block text-sm font-medium">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  className="w-full border  border-gray-300 focus:border-etuwaCustom  focus:outline-none  rounded-lg p-2"
                  {...register("title", { required: "Title is required" })}
                />
              </div>

              <div className="m-2">
                <label htmlFor="client" className="block text-sm font-medium">
                  Client
                </label>
                <select
                  id="client"
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("client", { required: "Client is required" })}
                >
                  <option value=""></option>
                  {clients.map((client) => (
                    <option key={client} value={client}>
                      {client}
                    </option>
                  ))}
                </select>
              </div>

              <div className="m-2">
                <label htmlFor="tags" className="block text-sm font-medium">
                  Tags
                </label>
                <input
                  id="tags"
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("tags", {
                    required: "Tags is required",
                  })}
                />
              </div>
              <div className="m-2">
                <label
                  htmlFor="mode_of_ticket"
                  className="block text-sm font-medium"
                >
                  Mode of Ticket
                </label>
                <select
                  id="mode_of_ticket"
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("mode_of_ticket")}
                >
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="Whatsapp-Group">Whatsapp-Group</option>
                  <option value="Whatsapp-Personal">Whatsapp-Personal</option>
                </select>
              </div>
              <div className="m-2">
                <label htmlFor="status" className="block text-sm font-medium">
                  Status
                </label>
                <select
                  id="status"
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("status")}
                >
                  <option value="New">New</option>
                  <option value="Pending">Pending</option>
                  <option value="Testing">Testing</option>
                  <option value="Dropped">Dropped</option>
                  <option value="Completed">Completed</option>
                  <option value="Not Required">Not Required</option>
                  <option value="No Issue">No Issue</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                </select>
              </div>
              <div className="m-2">
                <label htmlFor="module" className="block text-sm font-medium">
                  Module
                </label>
                <select
                  id="module"
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("module")}
                >
                  <option value=""></option>
                  {modules.map((module) => (
                    <option key={module} value={module}>
                      {module}
                    </option>
                  ))}
                </select>
              </div>
              <div className="m-2">
                <label
                  htmlFor="issue_date"
                  className="block text-sm font-medium"
                >
                  Issue Date
                </label>
                <input
                  id="issue_date"
                  type="date"
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("issue_date")}
                />
              </div>
              <div className="m-2">
                <label htmlFor="priority" className="block text-sm font-medium">
                  Priority
                </label>
                <select
                  id="priority"
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("priority")}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="m-2">
                <label
                  htmlFor="issue_type"
                  className="block text-sm font-medium"
                >
                  Issue Type
                </label>
                <select
                  id="issue_type"
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("issue_type", {
                    required: "Issue Type is required",
                  })}
                >
                  <option value=""></option>
                  {issues.map((issue) => (
                    <option key={issue} value={issue}>
                      {issue}
                    </option>
                  ))}
                </select>
              </div>
              <div className="m-2">
                <label htmlFor="project" className="block text-sm font-medium">
                  Project
                </label>
                <select
                  id="project"
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("project", {
                    required: "Project is required",
                  })}
                >
                  <option value=""></option>
                  {projects.map((project) => (
                    <option key={project} value={project}>
                      {project}
                    </option>
                  ))}
                </select>
              </div>
              <div className="m-2">
                <label
                  htmlFor="assigned_to"
                  className="block text-sm font-medium"
                >
                  Assigned To
                </label>
                <select
                  id="assigned_to"
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("assigned_to", {
                    required: "Assigned To is required",
                  })}
                >
                  <option value=""></option>
                  {users.map((user) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
              </div>
              <div className="m-2">
                <label
                  htmlFor="coordinator"
                  className="block text-sm font-medium"
                >
                  Coordinator
                </label>
                <select
                  id="coordinator"
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("coordinator")}
                >
                  <option value=""></option>
                  {users.map((user) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Tabs.Content>
          {/* Additional Info Tab */}{" "}
          <Tabs.Content value="additional" className="mt-4">
            <div className="md:grid md:grid-cols-2 md:gap-6 ">
              <div className="m-2">
                <label
                  htmlFor="point_of_contact"
                  className="block text-sm font-medium"
                >
                  Point of Contact
                </label>
                <input
                  id="point_of_contact"
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("point_of_contact", {
                    required: isAdditionalTabActive
                      ? "Point of Contact is required"
                      : false,
                  })}
                />
              </div>

              <div className="m-2">
                <label
                  htmlFor="client_contact_number"
                  className="block text-sm font-medium"
                >
                  Client Contact Number
                </label>
                <input
                  id="client_contact_number"
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("client_contact_number", {
                    required: isAdditionalTabActive
                      ? "Client Comngatct Numbert is required"
                      : false,
                  })}
                />
              </div>
              <div className="m-2">
                <label htmlFor="link" className="block text-sm font-medium">
                  Link
                </label>
                <input
                  id="link"
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("link", {
                    required: isAdditionalTabActive
                      ? "Link is required"
                      : false,
                  })}
                />
              </div>
              <div className="m-2">
                <label
                  htmlFor="completion_time"
                  className="block text-sm font-medium"
                >
                  Completion Time
                </label>
                <input
                  id="completion_time"
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("completion_time")}
                />
              </div>
              <div className="m-2">
                <label
                  htmlFor="expert_estimation"
                  className="block text-sm font-medium"
                >
                  Expert Estimation
                </label>
                <input
                  id="expert_estimation"
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("expert_estimation")}
                />
              </div>

              <div className="m-2">
                <label htmlFor="dueDate" className="block text-sm font-medium">
                  Due Date
                </label>
                <input
                  id="dueDate"
                  type="date"
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("dueDate")}
                />
              </div>

              <div className="m-2">
                <label
                  htmlFor="completed_date"
                  className="block text-sm font-medium"
                >
                  Completed Date
                </label>
                <input
                  id="completed_date"
                  type="date"
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("completed_date")}
                />
              </div>
            </div>
            <div className="mt-5">
              <div className="m-2">
                <label
                  htmlFor="ticket_description"
                  className="block text-sm font-medium"
                >
                  Ticket Description
                </label>
                <textarea
                  id="ticket_description"
                  rows={7}
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("ticket_description", {
                    required: isAdditionalTabActive
                      ? "Ticket dESCIRIPTIONI is required"
                      : false,
                  })}
                />
              </div>
              <div className="m-2">
                <label
                  htmlFor="resolution_points"
                  className="block text-sm font-medium"
                >
                  Resolution Points
                </label>
                <textarea
                  id="resolution_points"
                  rows={7}
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("resolution_points", {
                    required: isAdditionalTabActive
                      ? "resolution is required"
                      : false,
                  })}
                />
              </div>
              <div className="m-2">
                <label htmlFor="remarks" className="block text-sm font-medium">
                  Remarks
                </label>
                <textarea
                  id="remarks"
                  rows={7}
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...register("remarks", {
                    required: isAdditionalTabActive
                      ? "remarks is required"
                      : false,
                  })}
                />
              </div>
            </div>
          </Tabs.Content>
        </form>
      </Tabs.Root>
    </>
  );
};

export default page;
