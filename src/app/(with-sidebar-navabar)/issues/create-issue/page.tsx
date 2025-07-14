"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    issue: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const isFieldInvalid = (fieldName: keyof typeof formData) => {
    return touchedFields[fieldName] && !formData[fieldName];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/issues/create", formData);
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    router.push("/issues");
  };
  const handleBlur = (fieldName: string) => {
    setTouchedFields({
      ...touchedFields,
      [fieldName]: true,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className=" p-16 mx-auto bg-white rounded-lg shadow-md bg-gradient-to-tl from-white to-etuwaCustom-lb">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="issue"
            className="block text-sm font-medium text-etuwaCustom-db"
          >
            Name
          </label>
          <input
            type="text"
            id="issue"
            name="issue"
            value={formData.issue}
            onChange={handleChange}
            placeholder=""
            onBlur={() => handleBlur("issue")}
            className={`w-full px-3 py-2 mt-1 border ${
              isFieldInvalid("issue") ? "border-2 border-red-500" : ""
            } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            disabled={loading} // Disable input when loading
          />
          {isFieldInvalid("issue") && (
            <p className="text-red-500 text-xs mt-1">Issue is required.</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-etuwaCustom-db"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            onBlur={() => handleBlur("status")}
            className={`w-full px-3 py-2 mt-1 border ${
              isFieldInvalid("status") ? "border-2 border-red-500" : ""
            } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            disabled={loading}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading} // Disable input when loading
          className="px-6 py-2 bg-etuwaCustom-db text-white font-medium rounded-md hover:scale-95 transtion duration-300"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default page;
