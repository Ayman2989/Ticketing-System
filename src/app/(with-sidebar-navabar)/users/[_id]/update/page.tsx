"use client";

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { redirect, useParams, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { UserContext } from "../../../../../../context";

const RegistrationPage = () => {
  const { _id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { setUserInfo } = useContext(UserContext);
  const [user, setUser] = useState<{
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

  const { register, handleSubmit, setValue, reset } = useForm<{
    employee_id: string;
    employee_name: string;
    email: string;
    password: string;
    role: string;
    contact_number: number | undefined;
    designation: string;
    status: string;
  }>({
    defaultValues: {
      employee_id: "",
      employee_name: "",
      email: "",
      password: "",
      role: "",
      contact_number: undefined,
      designation: "",
      status: "Active",
    },
  });
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/users/${_id}`);
        const data = await res.json();
        if (data.user) {
          reset(data.user); // Update all form values at once
        }
        setUser(data.user);
        console.log(data.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, []);

  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});

  const handleBlur = (fieldName: string) => {
    setTouchedFields({
      ...touchedFields,
      [fieldName]: true,
    });
  };

  const isFieldInvalid = (fieldName: keyof typeof user) => {
    return touchedFields[fieldName] && !user[fieldName];
  };
  const onSubmit: SubmitHandler<{
    employee_id: string;
    employee_name: string;
    email: string;
    password: string;
    role: string;
    contact_number: number | undefined;
    designation: string;
    status: string;
  }> = async (data) => {
    setLoading(true);
    try {
      const res = await axios.put(`/api/users/update/${_id}`, data);
      console.log("submitted");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      router.push("/users");
    }
  };

  return (
    <div className="p-7  flex items-center justify-center px-4 ">
      <div className="w-full bg-gradient-to-tl from-white to-etuwaCustom-lb shadow-lg rounded-lg p-8">
        <form
          autoComplete="new-password"
          onSubmit={handleSubmit(onSubmit)}
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
              {...register("employee_id", { required: "this if requrerede" })}
              onBlur={() => handleBlur("employee_id")}
              className={` mt-1 block w-full border ${
                isFieldInvalid("employee_id") ? "border-2 border-red-500" : ""
              } rounded-md shadow-sm px-3 py-2 focus:outline-none  focus:border-etuwaCustom-db transition duration-200`}
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
              {...register("employee_name", { required: "this is requred" })}
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
              {...register("email", { required: "This field is required" })}
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
              {...register("role", { required: "This field is required" })}
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
              {...register("designation", { required: "this is requiered" })}
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
              {...register("password", { required: "This field is required" })}
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
              {...register("contact_number", {
                required: "This field is required",
              })}
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
              {...register("status", { required: "This field is required" })}
              onBlur={() => handleBlur("status")}
              className={`mt-1 block w-full border ${
                isFieldInvalid("status") ? "border-2 border-red-500" : ""
              } rounded-md shadow-sm px-3 py-2 focus:outline-none  focus:border-etuwaCustom-db transition duration-200`}
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
                setUser({
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
              {loading ? "Saving" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
