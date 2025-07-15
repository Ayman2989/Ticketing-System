import DeleteButton from "@/components/action-button/DeleteButton";
import axios from "axios";
import Link from "next/link";
import { redirect } from "next/navigation";

async function fetchClientType(_id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/client-types/${_id}`,
    {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch client-type data");
  }
  return res.json();
}

export default async function ClientTypeDetailsPage({
  params,
}: {
  params: { _id: string };
}) {
  const data = await fetchClientType(params._id);
  const clientType = data.clientType;
  console.log(clientType._id);

  if (!clientType) {
    return <div>Client not found.</div>;
  }
  const handleDelete = async (_id: string) => {
    try {
      const res = await axios.delete(`/api/client-types/delete/${_id}`);
      redirect("/client-types");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full h-full flex-col">
      <div className="flex p-4 justify-between bg-white rounded-lg shadow-md m-1 bg-gradient-to-l from-white to-etuwaCustom-lb">
        <div className="flex flex-col justify-evenly">
          <h1 className="m-1 text-xl font-bold text-etuwaCustom-db">
            {clientType.client_name}
          </h1>
        </div>
        <div>
          <Link
            href={`/client-types/${params._id}/update`}
            className="w-48 m-2 px-5 py-3 border border-green-500 text-green-500 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300 font-bold"
          >
            Update
          </Link>
          <DeleteButton
            classes="w-24 m-2 px-5 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 font-bold"
            _id={params._id}
            api={`/api/client-types/delete/${params._id}`}
            redirectLink="/client-types"
          >
            Delete
          </DeleteButton>
        </div>
      </div>

      <div className="flex flex-col p-10 shadow-md m-1 rounded-lg bg-gradient-to-l from-white to-etuwaCustom-lb">
        <h1 className="m-2 p-3 text-xl font-bold text-etuwaCustom-db">
          Client Basic Details
        </h1>
        <div className="flex flex-col  ">
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal ">
            <div className="w-40">Description:</div>
            <span className="ml-2 font-semibold">{clientType.description}</span>
          </div>
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal ">
            <div className="w-40">Status:</div>
            <span className="ml-2 font-semibold">{clientType.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
