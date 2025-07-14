"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const page = ({
  params,
}: {
  params: { _id: string; test_case_id: string };
}) => {
  const router = useRouter();

  interface TestCaseProps {
    title: string;
    status: string;
    description: string;
    attachment?: File | null;
    tested_by?: string;
    serial_no?: string;
    scenario?: string;
    precondition?: string;
    steps?: string;
    data?: string;
    expected_result?: string;
    actual_result?: string;
    defect_id?: string;
    bug_severity?: string;
    bug_priority?: string;
    comments?: string;
  }
  const [testCase, setTestCase] = useState<TestCaseProps>({
    title: "",
    status: "Failed",
    description: "",
    attachment: null,
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
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const { register, handleSubmit, setValue, reset, watch } =
    useForm<TestCaseProps>({
      defaultValues: {
        title: "",
        status: "Failed",
        description: "",
        attachment: null,
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
      },
    });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [users, setUsers] = useState<string[]>([]);
  useEffect(() => {
    const fetchTestCase = async () => {
      try {
        const res = await fetch(
          `/api/tickets/${params._id}/test-cases/${params.test_case_id}`
        );
        const data = await res.json();
        if (data.testCase) {
          reset(data.testCase); // Update all form values at once
        }
        setTestCase(data.testCase);
        console.log(data.testCase);
      } catch (error) {
        console.error("Failed to fetch testacsee:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestCase();
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
  const onSubmit: SubmitHandler<TestCaseProps> = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title || "");
      formData.append("status", data.status || "Failed");
      formData.append("description", data.description || "");
      if (data.attachment) {
        formData.append("attachment", data.attachment);
      } else if (selectedFile) {
        formData.append("attachment", selectedFile);
      }
      formData.append("tested_by", data.tested_by || "");
      formData.append("serial_no", data.serial_no || "");
      formData.append("scenario", data.scenario || "");
      formData.append("precondition", data.precondition || "");
      formData.append("steps", data.steps || "");
      formData.append("data", data.data || "");
      formData.append("expected_result", data.expected_result || "");
      formData.append("actual_result", data.actual_result || "");
      formData.append("defect_id", data.defect_id || "");
      formData.append("bug_severity", data.bug_severity || "");
      formData.append("bug_priority", data.bug_priority || "");
      formData.append("comments", data.comments || "");

      if (selectedFile) {
        formData.append("attachment", selectedFile);
      }

      await axios.put(
        `/api/tickets/${params._id}/test-cases/update/${params.test_case_id}`,
        formData
      );

      console.log("Submitted successfully");
      router.push(`/tickets/${params._id}`);
    } catch (error) {
      console.error("Failed to update:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleBlur = (fieldName: string) => {
    setTouchedFields({ ...touchedFields, [fieldName]: true });
  };

  const isFieldInvalid = (fieldName: keyof TestCaseProps) => {
    return touchedFields[fieldName] && !watch(fieldName);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <>
      <div className=" p-16 mx-auto bg-white rounded-lg shadow-md bg-gradient-to-tl from-white to-etuwaCustom-lb">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              {...register("title", { required: "this is required" })}
              onBlur={() => handleBlur("title")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("title") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            />
            {isFieldInvalid("title") && (
              <p className="text-red-500 text-xs mt-1">Title is required.</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="tested_by"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Tested By
            </label>
            <select
              id="tested_by"
              {...register("tested_by", { required: "Tester is required" })}
              onBlur={() => handleBlur("tested_by")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("tested_by") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            >
              {users.map((user, index) => (
                <option key={index} value={user}>
                  {user}
                </option>
              ))}
            </select>
            {isFieldInvalid("tested_by") && (
              <p className="text-red-500 text-xs mt-1">Tester is required.</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="serial_no"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Serial No
            </label>
            <input
              type="text"
              id="serial_no"
              {...register("serial_no", { required: "this is required" })}
              onBlur={() => handleBlur("serial_no")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("serial_no") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            />
            {isFieldInvalid("serial_no") && (
              <p className="text-red-500 text-xs mt-1">
                Serial No is required.
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register("description", { required: "this is required" })}
              onBlur={() => handleBlur("description")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("description") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            />
            {isFieldInvalid("description") && (
              <p className="text-red-500 text-xs mt-1">
                Description is required.
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="scenario"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Scenario
            </label>
            <input
              type="text"
              id="scenario"
              {...register("scenario")}
              onBlur={() => handleBlur("scenario")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("scenario") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            />
          </div>
          {isFieldInvalid("scenario") && (
            <p className="text-red-500 text-xs mt-1">Scenario is required.</p>
          )}
          <div className="mb-4">
            <label
              htmlFor="precondition"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Precondition
            </label>
            <textarea
              id="precondition"
              {...register("precondition")}
              onBlur={() => handleBlur("precondition")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("precondition") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            />
          </div>
          {isFieldInvalid("precondition") && (
            <p className="text-red-500 text-xs mt-1">
              Precondition is required.
            </p>
          )}
          <div className="mb-4">
            <label
              htmlFor="steps"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Steps
            </label>
            <textarea
              id="steps"
              {...register("steps")}
              onBlur={() => handleBlur("steps")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("steps") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            />
          </div>
          {isFieldInvalid("steps") && (
            <p className="text-red-500 text-xs mt-1">Steps is required.</p>
          )}
          <div className="mb-4">
            <label
              htmlFor="data"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Data
            </label>
            <textarea
              id="data"
              {...register("data")}
              onBlur={() => handleBlur("data")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("data") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            />
          </div>
          {isFieldInvalid("data") && (
            <p className="text-red-500 text-xs mt-1">Data is required.</p>
          )}
          <div className="mb-4">
            <label
              htmlFor="expected_result"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Expected Result
            </label>
            <textarea
              id="expected_result"
              {...register("expected_result")}
              onBlur={() => handleBlur("expected_result")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("expected_result")
                  ? "border-2 border-red-500"
                  : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            />
          </div>
          {isFieldInvalid("expected_result") && (
            <p className="text-red-500 text-xs mt-1">
              Expected Result is required.
            </p>
          )}
          <div className="mb-4">
            <label
              htmlFor="actual_result"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Actual Result
            </label>
            <textarea
              id="actual_result"
              {...register("actual_result")}
              onBlur={() => handleBlur("actual_result")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("actual_result") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            />
          </div>
          {isFieldInvalid("actual_result") && (
            <p className="text-red-500 text-xs mt-1">
              Actual Result is required.
            </p>
          )}

          <div className="mb-4">
            <label
              htmlFor="bug_severity"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Bug Severity
            </label>
            <input
              type="text"
              id="bug_severity"
              {...register("bug_severity")}
              onBlur={() => handleBlur("bug_severity")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("bug_severity") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            />
          </div>
          {isFieldInvalid("bug_severity") && (
            <p className="text-red-500 text-xs mt-1">
              Bug Severity is required.
            </p>
          )}

          <div className="mb-4">
            <label
              htmlFor="defect_id"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Defect ID
            </label>
            <input
              type="text"
              id="defect_id"
              {...register("defect_id")}
              onBlur={() => handleBlur("defect_id")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("defect_id") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            />
            {isFieldInvalid("defect_id") && (
              <p className="text-red-500 text-xs mt-1">
                Defect ID is required.
              </p>
            )}
            <div className="mb-4">
              <label
                htmlFor="bug_priority"
                className="block text-sm font-medium text-etuwaCustom-db"
              >
                Bug Priority
              </label>
              <input
                type="text"
                id="bug_priority"
                {...register("bug_priority")}
                onBlur={() => handleBlur("bug_priority")}
                className={`w-full px-3 py-2 mt-1 border ${
                  isFieldInvalid("bug_priority")
                    ? "border-2 border-red-500"
                    : ""
                } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              />
            </div>
            {isFieldInvalid("bug_priority") && (
              <p className="text-red-500 text-xs mt-1">
                Bug Priority is required.
              </p>
            )}
            <div className="mb-4">
              <label
                htmlFor="comments"
                className="block text-sm font-medium text-etuwaCustom-db"
              >
                Comments
              </label>
              <textarea
                id="comments"
                {...register("comments")}
                onBlur={() => handleBlur("comments")}
                className={`w-full px-3 py-2 mt-1 border ${
                  isFieldInvalid("comments") ? "border-2 border-red-500" : ""
                } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              />
            </div>
            {isFieldInvalid("comments") && (
              <p className="text-red-500 text-xs mt-1">Comments is required.</p>
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
              {...register("status")}
              onBlur={() => handleBlur("status")}
              className={`w-full px-3 py-2 mt-1 border ${
                isFieldInvalid("status") ? "border-2 border-red-500" : ""
              } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            >
              <option value="Failed">Failed</option>
              <option value="Passed">Passed</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="attachment"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Upload Attachment
            </label>
            <input
              type="file"
              id="attachment"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-etuwaCustom-db text-white font-medium rounded-md hover:scale-95 transtion duration-300"
          >
            {loading ? "Loading..." : "Update Test Case"}
          </button>
        </form>
      </div>
    </>
  );
};

export default page;
