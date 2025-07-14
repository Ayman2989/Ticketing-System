import DeleteButton from "@/components/action-button/DeleteButton";
import Link from "next/link";
import React from "react";

async function fetchTestCase(_id: string, test_case_id: string) {
  const res = await fetch(
    `http://localhost:3000/api/tickets/${_id}/test-cases/${test_case_id}`,
    {
      next: { revalidate: 20 }, // Revalidate every 60 seconds
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch project data");
  }
  return res.json();
}

const page = async ({
  params,
}: {
  params: { _id: string; test_case_id: string };
}) => {
  const data = await fetchTestCase(params._id, params.test_case_id);
  const testCase = await data.testCase;

  return (
    <div className="flex w-full h-full flex-col">
      <div className="flex p-4 justify-between bg-white rounded-lg shadow-md m-1 bg-gradient-to-l from-white to-etuwaCustom-lb">
        <div className="flex flex-col justify-evenly">
          <h1 className="m-1 text-xl font-bold text-etuwaCustom-db">
            {testCase.title}
          </h1>
          <div className="flex items-center justify-start text-etuwaCustom-db space-x-3 ">
            <h1>Status: </h1>

            {testCase.status === "pass" ? (
              <span className="bg-green-500 text-sm text-white px-5 font-semibold py-1 rounded-xl">
                Pass
              </span>
            ) : (
              <span className="bg-red-500 text-sm text-white px-5 font-semibold py-1 rounded-xl">
                Fail
              </span>
            )}
          </div>
        </div>
        <div className="flex">
          <Link
            href={`/tickets/${params._id}/test-cases/${params.test_case_id}/update`}
            className="w-auto m-2 px-5 py-3 border border-green-500 text-green-500 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300 font-bold"
          >
            Update
          </Link>
          <DeleteButton
            classes="w-24 m-2 px-5 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 font-bold"
            _id={params.test_case_id}
            api={`/api/tickets/${params._id}/test-cases/delete/${params.test_case_id}`}
            redirectLink={`/tickets/${params._id}`}
          >
            Delete
          </DeleteButton>
        </div>
      </div>

      <div className="flex flex-col p-10 shadow-md m-1 rounded-lg bg-gradient-to-l from-white to-etuwaCustom-lb">
        <h1 className="m-2 p-3 text-xl font-bold text-etuwaCustom-db">
          Project Basic Details
        </h1>
        <div className="flex flex-col  ">
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal ">
            <div className="w-40">Description</div>
            <span className="ml-2 font-semibold">{testCase.description}</span>
          </div>
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal ">
            <div className="w-40">Serial No</div>
            <span className="ml-2 font-semibold">{testCase.serial_no}</span>
          </div>
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal ">
            <div className="w-40">Scenario</div>
            <span className="ml-2 font-semibold">{testCase.scenario}</span>
          </div>
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal ">
            <div className="w-40">Precondition</div>
            <span className="ml-2 font-semibold">{testCase.precondition}</span>
          </div>
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal ">
            <div className="w-40">Steps</div>
            <span className="ml-2 font-semibold">{testCase.steps}</span>
          </div>
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal ">
            <div className="w-40">Data</div>
            <span className="ml-2 font-semibold">{testCase.data}</span>
          </div>
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal ">
            <div className="w-40">Expected Result</div>
            <span className="ml-2 font-semibold">
              {testCase.expected_result}
            </span>
          </div>
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal ">
            <div className="w-40">Actual Result</div>
            <span className="ml-2 font-semibold">{testCase.actual_result}</span>
          </div>
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal ">
            <div className="w-40">Defect ID</div>
            <span className="ml-2 font-semibold">{testCase.defect_id}</span>
          </div>
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal ">
            <div className="w-40">Bug Severity</div>
            <span className="ml-2 font-semibold">{testCase.bug_severity}</span>
          </div>
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal ">
            <div className="w-40">Bug Priority</div>
            <span className="ml-2 font-semibold">{testCase.bug_priority}</span>
          </div>
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal ">
            <div className="w-40">Comments</div>
            <span className="ml-2 font-semibold">{testCase.comments}</span>
          </div>
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal ">
            <div className="w-40">Tested By</div>
            <span className="ml-2 font-semibold">{testCase.tested_by}</span>
          </div>
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal ">
            <div className="w-40">Attachment</div>
            <img
              src={testCase.attachment}
              alt={testCase.title}
              className="w-3/6"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
