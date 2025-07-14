import DeleteButton from "@/components/action-button/DeleteButton";
import TicketTransfer from "@/components/page-comps/ticket-comps/TicketTransfer";
import Link from "next/link";

async function fetchTicket(_id: string) {
  const res = await fetch(`http://localhost:3000/api/tickets/${_id}`, {
    next: { revalidate: 20 }, // Revalidate every 20 seconds
  });
  if (!res.ok) {
    throw new Error("Failed to fetch user data");
  }
  return res.json();
}

export default async function UserDetailsPage({
  params,
}: {
  params: { _id: string };
}) {
  const data = await fetchTicket(params._id);
  const ticket = data.ticket;

  if (!ticket) {
    return <div>ticket not found.</div>;
  }
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | React.ReactNode;
  }) => (
    <div className="flex p-5 space-y-6 text-etuwaCustom-db font-normal">
      {label}:<span className="ml-2 font-semibold">{value || "N/A"}</span>
    </div>
  );
  const Badge = ({ text, color }: { text: string; color: string }) => (
    <span
      className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${color}`}
    >
      {text}
    </span>
  );
  const priorityColor = {
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-500",
  };
  const calculateDaysActive = (issueDate: string): number => {
    // Convert the issue date from "DD/MM/YYYY" format to a Date object
    const [day, month, year] = issueDate.split("/").map(Number);
    const issueDateObj = new Date(year, month - 1, day); // Month is 0-based in JS

    // Get the current date (today)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ensure we only compare full days

    // Calculate the difference in milliseconds
    const diffInMs = today.getTime() - issueDateObj.getTime();

    // Convert milliseconds to days
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  };
  const daysActive = calculateDaysActive(formatDate(ticket.issue_date));
  return (
    <div className="flex w-full h-full flex-col">
      {/* Header Section */}
      <div className="flex p-4 items-center justify-between bg-white rounded-lg shadow-md m-1 bg-gradient-to-l from-white to-etuwaCustom-lb">
        <div className="flex flex-col">
          <div className="flex items-center space-x-5">
            <h1 className="m-1 text-xl font-bold text-etuwaCustom-db ">
              {ticket?.title}
            </h1>
            <Link
              href={`/tickets/${params._id}/test-cases`}
              className="px-6 py-2 bg-etuwaCustom-db text-white font-medium rounded-md hover:scale-95 transtion duration-300"
            >
              Update Test Case
            </Link>
          </div>
          <div className="flex items-center space-x-5">
            <div className="text-etuwaCustom-db font-medium">
              Assigned To:
              <Badge
                text={ticket?.assigned_to || "Unassigned"}
                color="bg-etuwaCustom-db"
              />
            </div>
            <div className="text-etuwaCustom-db font-medium">
              Created By:
              <Badge
                text={ticket?.created_by || "Unknown"}
                color="bg-etuwaCustom-db"
              />
            </div>
            <div className="text-etuwaCustom-db font-medium">
              Status:
              <Badge
                text={ticket?.status || "Unknown"}
                color="bg-etuwaCustom-db"
              />
            </div>
            <InfoRow
              label="Issue Date"
              value={
                ticket?.issue_date ? formatDate(ticket.issue_date) : "(Not Set)"
              }
            />
            <InfoRow
              label="Due Date"
              value={ticket?.dueDate ? formatDate(ticket.dueDate) : "(Not Set)"}
            />
            <div className="text-etuwaCustom-db font-medium">
              Priority:
              <Badge
                text={ticket?.priority || "Low"}
                color={
                  priorityColor[
                    ticket?.priority as keyof typeof priorityColor
                  ] || "bg-gray-500"
                }
              />
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/tickets/${params._id}/update`}
            className="w-24 h-10 text-center pt-2 m-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300 font-bold"
          >
            Update
          </Link>
          <DeleteButton
            classes="h-10 w-24 m-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 font-bold"
            _id={params._id}
            api={`/api/tickets/delete/${params._id}`}
            redirectLink="/tickets"
          >
            Delete
          </DeleteButton>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex flex-col p-3 shadow-md m-1 rounded-lg bg-gradient-to-l from-white to-etuwaCustom-lb">
        <div className="flex items-center justify-between">
          <h1 className="m-2 p-3 text-xl text-center font-bold text-etuwaCustom-db">
            Ticket Details
            {ticket.previous_assigned_user && (
              <span className="text-sm text-etuwaCustom-db font-normal pl-2">
                (This Ticket Was Transferred To You By
                <span className="font-semibold text-etuwaCustom-db ml-1">
                  {ticket.previous_assigned_user})
                </span>
              </span>
            )}
          </h1>
          <h1 className="m-2 p-3 text-xl text-center font-bold text-etuwaCustom-db">
            Days Active: {daysActive} days.
          </h1>
        </div>
        <div className="md:grid md:grid-cols-2 md:gap-1">
          <InfoRow label="Client" value={ticket?.client} />
          <InfoRow label="Mode of Ticket" value={ticket?.mode_of_ticket} />

          <InfoRow label="Tags" value={ticket?.tags} />
          <InfoRow label="Module" value={ticket?.module} />
          <InfoRow label="Issue Type" value={ticket?.issue_type} />
          <InfoRow label="Project" value={ticket?.project} />
          <InfoRow
            label="Completed Date"
            value={ticket?.completed_date || "Not Completed Yet"}
          />
          <InfoRow label="Coordinator" value={ticket?.coordinator} />
          <InfoRow label="Point of Contact" value={ticket?.point_of_contact} />
          <InfoRow
            label="Client Contact Number"
            value={ticket?.client_contact_number}
          />
          <InfoRow
            label="Link"
            value={
              ticket?.link ? (
                <Link
                  href={ticket.link}
                  className="text-blue-500 hover:underline"
                >
                  {ticket.link}
                </Link>
              ) : (
                "N/A"
              )
            }
          />
          <InfoRow label="Completion Time" value={ticket?.completion_time} />
          <InfoRow
            label="Expert Estimation"
            value={ticket?.expert_estimation}
          />
          <InfoRow
            label="Ticket Description"
            value={ticket?.ticket_description}
          />
          <InfoRow
            label="Resolution Points"
            value={ticket?.resolution_points}
          />
          <InfoRow label="Remarks" value={ticket?.remarks} />
        </div>
        <TicketTransfer _id={params._id} />
      </div>
    </div>
  );
}
