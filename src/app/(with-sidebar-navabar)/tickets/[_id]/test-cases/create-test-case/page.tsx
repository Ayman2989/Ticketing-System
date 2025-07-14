"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { title } from "process";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../../../../context";

const ImageUploadPage = ({ params }: { params: { _id: string } }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Failed",
    attachment: null as File | null,
    tested_by: "",
    serial_no: "",
    scenario: "",
    precondition: "",
    steps: "",
    data: "",
    expected_result: "",
    actual_result: "",
    defect_id: "",
    bug_severity: "",
    bug_priority: "",
    comments: "",
  });
  const [loading, setLoading] = useState(false);
  const { userInfo } = useContext(UserContext);
  const [users, setUsers] = useState<string[]>([]);
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});

  const isFieldInvalid = (fieldName: keyof typeof formData) => {
    return touchedFields[fieldName] && !formData[fieldName];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const realFormData = new FormData();
    for (const key in formData) {
      if (formData[key as keyof typeof formData] !== null) {
        realFormData.append(key, formData[key as keyof typeof formData] as any);
      }
    }

    try {
      const response = await axios.post(
        `/api/tickets/${params._id}/test-cases/create`,
        realFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      console.log(realFormData);

      router.push(`/tickets/${params._id}/test-cases`);
    } catch (error) {
      console.error("Error uploading test case:", error);
    } finally {
      setLoading(false);
    }
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

    // Handle file input safely
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files?.[0] || null;
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
      return;
    }

    // Handle other input types (text, textarea, select)
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  useEffect(() => {
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
    fetchUsers();
  }, []);

  return (
    <div className="p-16 mx-auto bg-white rounded-lg shadow-md bg-gradient-to-tl from-white to-etuwaCustom-lb">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={() => handleBlur("title")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("title") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              disabled={loading} // Disable input when loading
            />
            {isFieldInvalid("title") && (
              <p className="text-red-500 text-xs mt-1">Title is required.</p>
            )}
          </div>
          <div>
            <label
              htmlFor="tested_by"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Tested By
            </label>
            <select
              name="tested_by"
              id="tested_by"
              value={formData.tested_by}
              onChange={handleChange}
              onBlur={() => handleBlur("tested_by")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("tested_by") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              disabled={loading}
            >
              <option value="">Select a tester</option>
              {users.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>

            {isFieldInvalid("tested_by") && (
              <p className="text-red-500 text-xs mt-1">
                Tested By is required.
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="serial_no"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Serial No
            </label>
            <input
              type="text"
              id="serial_no"
              name="serial_no"
              value={formData.serial_no}
              onChange={handleChange}
              onBlur={() => handleBlur("serial_no")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("serial_no") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              disabled={loading} // Disable input when loading
            />
            {isFieldInvalid("serial_no") && (
              <p className="text-red-500 text-xs mt-1">
                Serial No is required.
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={() => handleBlur("description")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("description") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              disabled={loading} // Disable input when loading
            />
            {isFieldInvalid("description") && (
              <p className="text-red-500 text-xs mt-1">
                Description is required.
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="scenario"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Scenario
            </label>
            <input
              type="text"
              id="scenario"
              name="scenario"
              value={formData.scenario}
              onChange={handleChange}
              onBlur={() => handleBlur("scenario")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("scenario") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              disabled={loading} // Disable input when loading
            />
            {isFieldInvalid("scenario") && (
              <p className="text-red-500 text-xs mt-1">Scenario is required.</p>
            )}
          </div>
          <div>
            <label
              htmlFor="precondition"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Precondition
            </label>
            <textarea
              id="precondition"
              name="precondition"
              value={formData.precondition}
              onChange={handleChange}
              onBlur={() => handleBlur("precondition")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("precondition") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              disabled={loading} // Disable input when loading
            />
            {isFieldInvalid("precondition") && (
              <p className="text-red-500 text-xs mt-1">
                Precondition is required.
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="steps"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Steps
            </label>
            <textarea
              id="steps"
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              onBlur={() => handleBlur("steps")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("steps") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              disabled={loading} // Disable input when loading
            />
            {isFieldInvalid("steps") && (
              <p className="text-red-500 text-xs mt-1">Steps is required.</p>
            )}
          </div>
          <div>
            <label
              htmlFor="data"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Data
            </label>
            <textarea
              id="data"
              name="data"
              value={formData.data}
              onChange={handleChange}
              onBlur={() => handleBlur("data")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("data") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              disabled={loading} // Disable input when loading
            />
            {isFieldInvalid("data") && (
              <p className="text-red-500 text-xs mt-1">Data is required.</p>
            )}
          </div>
          <div>
            <label
              htmlFor="expected_result"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Expected Result
            </label>
            <textarea
              id="expected_result"
              name="expected_result"
              value={formData.expected_result}
              onChange={handleChange}
              onBlur={() => handleBlur("expected_result")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("expected_result")
                  ? "border-2 border-red-500"
                  : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              disabled={loading} // Disable input when loading
            />
            {isFieldInvalid("expected_result") && (
              <p className="text-red-500 text-xs mt-1">
                Expected Result is required.
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="actual_result"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Actual Result
            </label>
            <textarea
              id="actual_result"
              name="actual_result"
              value={formData.actual_result}
              onChange={handleChange}
              onBlur={() => handleBlur("actual_result")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("actual_result") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              disabled={loading} // Disable input when loading
            />
            {isFieldInvalid("actual_result") && (
              <p className="text-red-500 text-xs mt-1">
                Actual Result is required.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="defect_id"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Defect ID
            </label>
            <input
              type="text"
              id="defect_id"
              name="defect_id"
              value={formData.defect_id}
              onChange={handleChange}
              onBlur={() => handleBlur("defect_id")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("defect_id") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              disabled={loading} // Disable input when loading
            />
            {isFieldInvalid("defect_id") && (
              <p className="text-red-500 text-xs mt-1">
                Defect ID is required.
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="bug_severity"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Bug Severity
            </label>
            <input
              type="text"
              id="bug_severity"
              name="bug_severity"
              value={formData.bug_severity}
              onChange={handleChange}
              onBlur={() => handleBlur("bug_severity")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("bug_severity") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              disabled={loading} // Disable input when loading
            />
            {isFieldInvalid("bug_severity") && (
              <p className="text-red-500 text-xs mt-1">
                Bug Severity is required.
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="bug_priority"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Bug Priority
            </label>
            <input
              type="text"
              id="bug_priority"
              name="bug_priority"
              value={formData.bug_priority}
              onChange={handleChange}
              onBlur={() => handleBlur("bug_priority")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("bug_priority") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              disabled={loading} // Disable input when loading
            />
            {isFieldInvalid("bug_priority") && (
              <p className="text-red-500 text-xs mt-1">
                Bug Priority is required.
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="comments"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Comments
            </label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              onBlur={() => handleBlur("comments")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("comments") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              disabled={loading} // Disable input when loading
            />
            {isFieldInvalid("comments") && (
              <p className="text-red-500 text-xs mt-1">Comments is required.</p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={() => handleBlur("description")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("description") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              disabled={loading} // Disable input when loading
            />
            {isFieldInvalid("description") && (
              <p className="text-red-500 text-xs mt-1">
                Description is required.
              </p>
            )}
          </div>
          <div>
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
              className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200"
              disabled={loading} // Disable input when loading
            >
              <option value="Failed">Failed</option>
              <option value="Passed">Passed</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="attachment"
              name="attachment"
              accept="image/*"
              onChange={handleChange}
              className={`w-full px-3 py-2 mt-1 border  rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              disabled={loading} // Disable input when loading
              required={false}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading} // Disable button when loading
          className="px-6 py-2 bg-etuwaCustom-db text-white font-medium rounded-md hover:scale-95 transition duration-300"
        >
          {loading ? "Submitting" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ImageUploadPage;
