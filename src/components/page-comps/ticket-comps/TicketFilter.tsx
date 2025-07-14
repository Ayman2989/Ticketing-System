import { useState } from "react";

const TicketFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    title: "",
    projectName: "",
    clientName: "",
    status: "",
    issueType: "",
    priority: "",
  });

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  //   // Apply filters
  //   const applyFilters = () => {
  //     onFilter(filters);
  //   };

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md transition-all ease-in-out duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        Filter
      </button>

      {/* Filter Panel with Smooth Animation */}
      <div
        className={`absolute top-12 left-0 bg-white shadow-md p-4 w-80 border rounded-md transition-all ease-in-out duration-500 transform ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <input
          type="text"
          name="title"
          placeholder="Filter by Title"
          value={filters.title}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-2 transition-all ease-in-out duration-300"
        />
        <input
          type="text"
          name="projectName"
          placeholder="Filter by Project Name"
          value={filters.projectName}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-2 transition-all ease-in-out duration-300"
        />
        <input
          type="text"
          name="clientName"
          placeholder="Filter by Client Name"
          value={filters.clientName}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-2 transition-all ease-in-out duration-300"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-2 transition-all ease-in-out duration-300"
        >
          <option value="">Filter by Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="in-progress">In Progress</option>
        </select>
        <select
          name="issueType"
          value={filters.issueType}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-2 transition-all ease-in-out duration-300"
        >
          <option value="">Filter by Issue Type</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
          <option value="task">Task</option>
        </select>

        {/* Apply Button */}
        <button
          //   onClick={applyFilters}
          className="bg-green-500 text-white px-4 py-2 rounded-md w-full transition-all ease-in-out duration-300"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default TicketFilter;
