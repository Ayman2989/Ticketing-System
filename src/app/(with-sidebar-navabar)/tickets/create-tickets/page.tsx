"use client";

import { useContext, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as Tabs from "@radix-ui/react-tabs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserContext } from "../../../../../context";

interface TicketData {
  title: string;
  client: string;
  tags: string;
  mode_of_ticket: string;
  status: string;
  module: string;
  issue_date: string;
  priority: string;
  issue_type: string;
  project: string;
  assigned_to: string;
  coordinator: string;
  point_of_contact: string;
  client_contact_number: number;
  link: string;
  completion_time: string;
  expert_estimation: string;
  dueDate: string;
  completed_date: string;
  ticket_description: string;
  resolution_points: string;
  created_by?: string;
  remarks?: string;
}

const TabbedForm = () => {
  const router = useRouter();
  const { userInfo } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<TicketData>({
    shouldUnregister: false,
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
      created_by: userInfo?.employee_name || "",
      remarks: "",
    },
  });
  const [clients, setClients] = useState([]);
  const [modules, setModules] = useState([]);
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabsActive, setTabsActive] = useState("general"); // Track the active tab
  const isAdditionalTabActive = tabsActive === "additional";

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
    fetchClients();
    fetchModules();
    fetchProjects();
    fetchIssues();
    fetchUsers();
  }, []);

  const onSubmit: SubmitHandler<TicketData> = async (data) => {
    console.log(data); // Check if data is populated correctly
    try {
      setLoading(true);
      const res = await axios.post("/api/tickets/create", data);
      console.log(res);
      router.push("/tickets");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs.Root
      defaultValue="general"
      value={tabsActive}
      onValueChange={setTabsActive} // Update the active tab when it changes
      className="max-w-full p-4 text-etuwaCustom-db border rounded-md shadow-md bg-gradient-to-tl from-white to-etuwaCustom-lb"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-full p-4 ">
        {/* General Info Tab */}

        <div className="flex items-center justify-between">
          <Tabs.List className="flex space-x-4 pb-2 ">
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
          <div className="flex items-center space-x-2">
            <button
              type="submit"
              className="px-6 py-2 bg-etuwaCustom-db text-white font-medium rounded-md hover:scale-95 transtion duration-300"
            >
              {loading ? "Creating" : "Create"}
            </button>
            <button
              type="reset"
              className="px-6 py-2 border border-etuwaCustom-db rounded-md bg-white-100 text-etuwaCustom-db hover:scale-95 transtion duration-300 font-medium"
            >
              Reset
            </button>
          </div>
        </div>
        <Tabs.Content value="general" className="mt-4">
          <div className="md:grid md:grid-cols-2 md:gap-6 ">
            <div className="m-2 ">
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                type="text"
                className={`w-full border  ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } focus:border-etuwaCustom  focus:outline-none  rounded-lg p-2`}
                {...register("title", { required: "Title is required" })}
                onFocus={() => setFocus("title")}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div className="m-2">
              <label htmlFor="client" className="block text-sm font-medium">
                Client
              </label>
              <select
                id="client"
                className={`w-full border  ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } focus:border-etuwaCustom  focus:outline-none  rounded-lg p-2`}
                {...register("client", { required: "Client is required" })}
                onFocus={() => setFocus("client")}
              >
                <option value=""></option>
                {clients.map((client) => (
                  <option key={client} value={client}>
                    {client}
                  </option>
                ))}
              </select>
              {errors.client && (
                <p className="text-red-500 text-sm">{errors.client.message}</p>
              )}
            </div>
            <div className="m-2">
              <label htmlFor="created_by" className="block text-sm font-medium">
                Created By
              </label>
              <select
                id="created_by"
                className={`w-full border  ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } focus:border-etuwaCustom  focus:outline-none  rounded-lg p-2`}
                {...register("created_by", {
                  required: "Created By is required",
                })}
                onFocus={() => setFocus("created_by")}
              >
                <option value={userInfo.employee_name}>
                  {userInfo.employee_name}
                </option>
                {users
                  .filter((user) => user !== userInfo.employee_name)
                  .map((user) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
              </select>
              {errors.created_by && (
                <p className="text-red-500 text-sm">
                  {errors.created_by.message}
                </p>
              )}
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
                className={`w-full border  ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } focus:border-etuwaCustom  focus:outline-none  rounded-lg p-2`}
                {...register("mode_of_ticket", {
                  required: "Mode of Ticket is required",
                })}
                onFocus={() => setFocus("mode_of_ticket")}
              >
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
                <option value="Whatsapp-Group">Whatsapp-Group</option>
                <option value="Whatsapp-Personal">Whatsapp-Personal</option>
              </select>
              {errors.mode_of_ticket && (
                <p className="text-red-500 text-sm">
                  {errors.mode_of_ticket.message}
                </p>
              )}
            </div>
            <div className="m-2">
              <label htmlFor="status" className="block text-sm font-medium">
                Status
              </label>
              <select
                id="status"
                className={`w-full border  ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } focus:border-etuwaCustom  focus:outline-none  rounded-lg p-2`}
                {...register("status", {
                  required: "Status is required",
                })}
                onFocus={() => setFocus("status")}
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
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>
            <div className="m-2">
              <label htmlFor="module" className="block text-sm font-medium">
                Module
              </label>
              <select
                id="module"
                className={`w-full border  ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } focus:border-etuwaCustom  focus:outline-none  rounded-lg p-2`}
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
              <label htmlFor="issue_date" className="block text-sm font-medium">
                Issue Date
              </label>
              <input
                id="issue_date"
                type="date"
                className={`w-full border  ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } focus:border-etuwaCustom  focus:outline-none  rounded-lg p-2`}
                {...register("issue_date", {
                  required: "Issue of Date is required",
                })}
                onFocus={() => setFocus("issue_date")}
              />
              {errors.issue_date && (
                <p className="text-red-500 text-sm">
                  {errors.issue_date.message}
                </p>
              )}
            </div>
            <div className="m-2">
              <label htmlFor="priority" className="block text-sm font-medium">
                Priority
              </label>
              <select
                id="priority"
                className={`w-full border  ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } focus:border-etuwaCustom  focus:outline-none  rounded-lg p-2`}
                {...register("priority", {
                  required: "Priority is required",
                })}
                onFocus={() => setFocus("priority")}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.priority && (
                <p className="text-red-500 text-sm">
                  {errors.priority.message}
                </p>
              )}
            </div>
            <div className="m-2">
              <label htmlFor="issue_type" className="block text-sm font-medium">
                Issue Type
              </label>
              <select
                id="issue_type"
                className={`w-full border  ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } focus:border-etuwaCustom  focus:outline-none  rounded-lg p-2`}
                {...register("issue_type", {
                  required: "Issue Type is required",
                })}
                onFocus={() => setFocus("issue_type")}
              >
                <option value=""></option>
                {issues.map((issue) => (
                  <option key={issue} value={issue}>
                    {issue}
                  </option>
                ))}
              </select>
              {errors.issue_type && (
                <p className="text-red-500 text-sm">
                  {errors.issue_type.message}
                </p>
              )}
            </div>
            <div className="m-2">
              <label htmlFor="project" className="block text-sm font-medium">
                Project
              </label>
              <select
                id="project"
                className={`w-full border  ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } focus:border-etuwaCustom  focus:outline-none  rounded-lg p-2`}
                {...register("project", { required: "Project is required" })}
                onFocus={() => setFocus("project")}
              >
                <option value=""></option>
                {projects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
              {errors.project && (
                <p className="text-red-500 text-sm">{errors.project.message}</p>
              )}
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
                className={`w-full border  ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } focus:border-etuwaCustom  focus:outline-none  rounded-lg p-2`}
                {...register("assigned_to", {
                  required: "Assigned To is required",
                })}
                onFocus={() => setFocus("assigned_to")}
              >
                <option value=""></option>
                {users.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
              {errors.assigned_to && (
                <p className="text-red-500 text-sm">
                  {errors.assigned_to.message}
                </p>
              )}
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
                className={`w-full border  ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } focus:border-etuwaCustom  focus:outline-none  rounded-lg p-2`}
                {...register("coordinator", {
                  required: "Coordinator is required",
                })}
                onFocus={() => setFocus("coordinator")}
              >
                <option value=""></option>
                {users.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
              {errors.coordinator && (
                <p className="text-red-500 text-sm">
                  {errors.coordinator.message}
                </p>
              )}
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="additional" className="mt-4">
          {/* Additional Info Tab */}
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
              <label htmlFor="tags" className="block text-sm font-medium">
                Tags
              </label>
              <input
                id="tags"
                className={`w-full border  ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } focus:border-etuwaCustom  focus:outline-none  rounded-lg p-2`}
                {...register("tags", {
                  required: isAdditionalTabActive ? "Tags is required" : false,
                })}
                onFocus={() => setFocus("tags")}
              />
              {errors.tags && (
                <p className="text-red-500 text-sm">{errors.tags.message}</p>
              )}
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
                    ? "Client Contact Number is required"
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
                  required: isAdditionalTabActive ? "Link is required" : false,
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
                    ? "Ticket Description is required"
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
                    ? "Resolution POintsis required"
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
                    ? "Remarks is required"
                    : false,
                })}
              />
            </div>
          </div>
        </Tabs.Content>
      </form>
    </Tabs.Root>
  );
};

export default TabbedForm;
