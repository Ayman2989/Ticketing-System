import { Suspense } from "react";

const fetchReports = async (_id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/reports/${_id}`,
    {
      cache: "no-store", // Disable caching
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch reports");
  }

  const data = await res.json();
  return data.report;
};

// Loading Placeholder Component
const LoadingSkeleton = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="flex flex-col items-center">
      <p className="text-lg font-semibold text-etuwaCustom-b mb-4">
        Loading Report Details...
      </p>

      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  </div>
);

const ReportDetails = async ({ _id }: { _id: string }) => {
  const report = await fetchReports(_id);

  return (
    <div className="flex w-full h-full flex-col">
      {/* Report Details */}
      <div className="flex flex-col p-10 shadow-md m-1 rounded-lg bg-gradient-to-l from-white to-etuwaCustom-lb">
        <h1 className="m-2 p-3 text-xl font-bold text-etuwaCustom-db">
          Report Basic Details
        </h1>
        <div className="flex flex-col">
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal">
            <div className="w-40">User ID:</div>
            <span className="ml-2 font-semibold">{report.userId}</span>
          </div>
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal">
            <div className="w-40">Active Time:</div>
            <span className="ml-2 font-semibold">{report.activeTime}</span>
          </div>
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal">
            <div className="w-40">Idle Time:</div>
            <span className="ml-2 font-semibold">{report.idleTime}</span>
          </div>
          <div className="flex p-5 items-center text-etuwaCustom-db font-normal">
            <div className="w-40">Date:</div>
            <span className="ml-2 font-semibold">{report.date}</span>
          </div>
        </div>

        {/* Attachments Section */}
        {report.attachment.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-3 text-etuwaCustom-db">
              Attachments
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {report.attachment.map((buffer: string, index: number) => (
                <img
                  key={index}
                  src={`${buffer}`}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-auto object-cover rounded-lg shadow-md hover:opacity-75 cursor-pointer"
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-6 text-etuwaCustom-db">No attachments available.</p>
        )}
      </div>
    </div>
  );
};

export default function ReportDetailsPage({
  params,
}: {
  params: { _id: string };
}) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ReportDetails _id={params._id} />
    </Suspense>
  );
}
