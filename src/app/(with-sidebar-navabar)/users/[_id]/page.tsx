import DeleteButton from "@/components/action-button/DeleteButton";
import Link from "next/link";

async function fetchUser(_id: string) {
  const res = await fetch(`http://localhost:3000/api/users/${_id}`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
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
  const data = await fetchUser(params._id);
  const user = data.user;

  if (!user) {
    return <div>User not found.</div>;
  }

  const userData = [
    { header: "Employee ID", data: user.employee_id },
    { header: "Employee Name", data: user.employee_name },
    { header: "Email", data: user.email },
    { header: "Contact Number", data: user.contact_number },
    { header: "Designition", data: user.designation },
    { header: "Status", data: user.status },
  ];

  return (
    <div className="flex w-full h-full flex-col">
      <div className="flex p-4 justify-between rounded-lg shadow-md m-1 bg-gradient-to-l from-white to-etuwaCustom-lb">
        <div className="flex flex-col justify-evenly ">
          <h1 className="m-1 text-xl font-bold text-etuwaCustom-db">
            {user.employee_name}
          </h1>
          <div className="flex items-center justify-start text-etuwaCustom-db ">
            <h1 className="m-1">Role:</h1>
            <span className="m-1">{user.role}</span>
          </div>
        </div>
        <div>
          <Link
            prefetch={true}
            href={`/users/${params._id}/update`}
            className="w-32 m-2 px-4 py-3 border border-green-500 text-green-500 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300 font-bold"
          >
            Update
          </Link>
          <DeleteButton
            classes="w-24 m-2 px-5 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 font-bold"
            _id={params._id}
            api={`/api/users/delete/${params._id}`}
            redirectLink="/users"
          >
            Delete
          </DeleteButton>
        </div>
      </div>

      <div className="flex flex-col p-10 shadow-md m-1 rounded-lg bg-gradient-to-l from-white to-etuwaCustom-lb">
        <h1 className="m-2 p-3 text-xl font-bold text-etuwaCustom-db">
          User Basic Details
        </h1>
        <div className="flex flex-col">
          {userData.map(({ header, data }) => {
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
