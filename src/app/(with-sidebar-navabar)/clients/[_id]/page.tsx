import DeleteButton from "@/components/action-button/DeleteButton";
import Link from "next/link";

async function fetchClient(_id: string) {
  const res = await fetch(`http://localhost:3000/api/clients/${_id}`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });
  if (!res.ok) {
    throw new Error("Failed to fetch client data");
  }
  return res.json();
}

export default async function ClientDetailsPage({
  params,
}: {
  params: { _id: string };
}) {
  const data = await fetchClient(params._id);
  const client = data.client;

  if (!client) {
    return <div>Client not found.</div>;
  }
  const clientData = [
    { header: "Client ID", data: client.client_id },
    { header: "Client Alias", data: client.client_name },
    { header: "Client Name", data: client.client_fullname },
    { header: "Email", data: client.email },
    { header: "Contact Number", data: client.contact },
    { header: "Client Type", data: client.client_type },
    { header: "Keam Code", data: client.keam_code },
    { header: "Status", data: client.status },
  ];

  return (
    <div className="flex w-full h-full flex-col">
      <div className="flex p-4 justify-between bg-white rounded-lg shadow-md m-1 bg-gradient-to-l from-white to-etuwaCustom-lb">
        <div className="flex flex-col justify-evenly ">
          <h1 className="m-1 text-xl font-bold text-etuwaCustom-db">
            {client.client_name}
          </h1>
          <div className="flex items-center justify-start text-etuwaCustom-db ">
            <h1 className="m-1">Client Type</h1>
            <span className="m-1">{client.client_type}</span>
          </div>
        </div>
        <div>
          <Link
            href={`/clients/${params._id}/update`}
            className="w-36 m-2 px-4 py-3 border border-green-500 text-green-500 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300 font-bold"
          >
            Update
          </Link>
          <DeleteButton
            classes="w-24 m-2 px-5 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 font-bold"
            _id={params._id}
            api={`/api/clients/delete/${params._id}`}
            redirectLink="/clients"
          >
            Delete
          </DeleteButton>
        </div>
      </div>

      <div className="flex flex-col p-10 shadow-md m-1 rounded-lg bg-gradient-to-l from-white to-etuwaCustom-lb">
        <h1 className="m-2 p-3 text-xl font-bold text-etuwaCustom-db">
          Client Basic Details
        </h1>
        <div className="flex flex-col">
          {clientData.map(({ header, data }) => {
            return (
              <div className="flex p-5 items-center text-etuwaCustom-db font-normal ">
                <div className="w-40">{header}:</div>
                <span className="ml-2 font-semibold">{data}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
