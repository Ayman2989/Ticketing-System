"use client";

import { useState } from "react";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";

const RegistrationPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<{
    employee_id: string;
    employee_name: string;
    email: string;
    password: string;
    role: string;
    contact_number: number | undefined;
    designation: string;
    status: string;
  }>({
    employee_id: "",
    employee_name: "",
    email: "",
    password: "",
    role: "",
    contact_number: undefined,
    designation: "",
    status: "Active",
  });

  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields({
      ...touchedFields,
      [fieldName]: true,
    });
  };

  const isFieldInvalid = (fieldName: keyof typeof formData) => {
    return touchedFields[fieldName] && !formData[fieldName];
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/users/register", formData);
      console.log("Submitted Data: ", formData);
      router.push("/users");
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-7  flex items-center justify-center px-4 ">
      <div className="w-full bg-gradient-to-tl from-white to-etuwaCustom-lb shadow-lg rounded-lg p-8">
        <form
          autoComplete="new-password"
          onSubmit={handleSubmit}
          className="md:grid md:grid-cols-2 md:gap-6"
        >
          {/* Employee ID */}
          <div className="w-full">
            <label
              htmlFor="employee_id"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Employee ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="employee_id"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              onBlur={() => handleBlur("employee_id")}
              className={` mt-1 block w-full border ${
                isFieldInvalid("employee_id") ? "border-2 border-red-500" : ""
              } rounded-md shadow-sm px-3 py-2 focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              placeholder=""
              required
              autoComplete="off"
            />
            {isFieldInvalid("employee_id") && (
              <p className="text-red-500 text-xs mt-1">
                Employee ID is required.
              </p>
            )}
          </div>

          {/* Employee Name */}
          <div className="w-full">
            <label
              htmlFor="employee_name"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Employee Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="employee_name"
              name="employee_name"
              value={formData.employee_name}
              onChange={handleChange}
              onBlur={() => handleBlur("employee_name")}
              className={`mt-1 block w-full border ${
                isFieldInvalid("employee_name") ? "border-2 border-red-500" : ""
              } rounded-md shadow-sm px-3 py-2 focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              placeholder=""
              required
              autoComplete="off"
            />
            {isFieldInvalid("employee_name") && (
              <p className="text-red-500 text-xs mt-1">
                Employee Name is required.
              </p>
            )}
          </div>

          {/* Email */}
          <div className="w-full">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              className={`mt-1 block w-full border ${
                isFieldInvalid("email") ? "border-2 border-red-500" : ""
              } rounded-md shadow-sm px-3 py-2 focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              placeholder=""
              required
              autoComplete="new-password"
            />
            {isFieldInvalid("email") && (
              <p className="text-red-500 text-xs mt-1">Email is required.</p>
            )}
          </div>

          {/* Role */}
          <div className="w-full">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Role <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              onBlur={() => handleBlur("role")}
              className={`mt-1 block w-full border ${
                isFieldInvalid("role") ? "border-2 border-red-500" : ""
              } rounded-md shadow-sm px-3 py-2 focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              required
              autoComplete="off"
            >
              <option value=""></option>
              <option value="Admin">Admin</option>
              <option value="Developer">Developer</option>
              <option value="Tester">Tester</option>
              <option value="Manager">Manager</option>
              <option value="Client">Client</option>
              <option value="Support">Support</option>
            </select>
            {isFieldInvalid("role") && (
              <p className="text-red-500 text-xs mt-1">Role is required.</p>
            )}
          </div>

          {/* Designation */}
          <div className="w-full">
            <label
              htmlFor="designation"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              onBlur={() => handleBlur("designation")}
              className={`mt-1 block w-full border ${
                isFieldInvalid("designation") ? "border-2 border-red-500" : ""
              } rounded-md shadow-sm px-3 py-2 focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              placeholder=""
              required
              autoComplete="off"
            />
            {isFieldInvalid("designation") && (
              <p className="text-red-500 text-xs mt-1">
                Designation is required.
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
              className={`mt-1 block w-full border ${
                isFieldInvalid("password") ? "border-2 border-red-500" : ""
              } rounded-md shadow-sm px-3 py-2 focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              placeholder=""
              required
              autoComplete="new-password"
            />
            {isFieldInvalid("password") && (
              <p className="text-red-500 text-xs mt-1">Password is required.</p>
            )}
          </div>

          {/* Contact Number */}
          <div className="w-full">
            <label
              htmlFor="contact_number"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="contact_number"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              onBlur={() => handleBlur("contact_number")}
              className={`mt-1 block w-full border ${
                isFieldInvalid("contact_number")
                  ? "border-2 border-red-500"
                  : ""
              } rounded-md shadow-sm px-3 py-2 focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              placeholder=""
              required
              autoComplete="off"
            />
            {isFieldInvalid("contact_number") && (
              <p className="text-red-500 text-xs mt-1">
                Contact Number is required.
              </p>
            )}
          </div>

          {/* Status */}
          <div className="w-full">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-etuwaCustom-db"
            >
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              onBlur={() => handleBlur("status")}
              className={`mt-1 block w-full border ${
                isFieldInvalid("status") ? "border-2 border-red-500" : ""
              } rounded-md shadow-sm px-3 py-2 focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
              required
              autoComplete="off"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {isFieldInvalid("status") && (
              <p className="text-red-500 text-xs mt-1">Status is required.</p>
            )}
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex items-center justify-center space-x-4 mt-6">
            <button
              type="reset"
              className="px-6 py-2 border border-etuwaCustom-db rounded-md bg-white-100 text-etuwaCustom-db hover:scale-95 transtion duration-300 font-medium"
              onClick={() =>
                setFormData({
                  employee_id: "",
                  employee_name: "",
                  email: "",
                  designation: "",
                  role: "",
                  contact_number: undefined,
                  password: "",
                  status: "Active",
                })
              }
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-etuwaCustom-db text-white font-medium rounded-md hover:scale-95 transtion duration-300"
            >
              {loading ? "Creating" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
