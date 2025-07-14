"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface Clienttype {
  client_id: string;
  client_name: string;
  client_fullname: string;
  client_type: string;
  email: string;
  contact: undefined;
  keam_code: string;
  status: "Active";
}

const Page = () => {
  const { _id } = useParams();
  const router = useRouter();
  const [clientTypes, setClientTypes] = useState([]);
  const [client, setClient] = useState<Clienttype>({
    client_id: "",
    client_name: "",
    client_fullname: "",
    client_type: "",
    email: "",
    contact: undefined,
    keam_code: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(true);
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const { register, handleSubmit, setValue, reset } = useForm<Clienttype>({
    defaultValues: {
      client_id: "",
      client_name: "",
      client_fullname: "",

      client_type: "",
      email: "",
      contact: undefined,
      keam_code: "",
      status: "Active",
    },
  });
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetch(`/api/clients/${_id}`);
        const data = await res.json();
        if (data.client) {
          reset(data.client); // Update all form values at once
        }
        setClient(data.client);
        console.log(data.client);
      } catch (error) {
        console.error("Failed to fetch client:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchClientTypes = async () => {
      try {
        const res = await fetch(`/api/client-types/get-all`);
        const data = await res.json();
        const clientNames = data.clientTypes.map(
          (client: { client_name: string }) => client.client_name
        );
        setClientTypes(clientNames);
      } catch (error) {
        console.log(error);
      }
    };

    fetchClientTypes();
    fetchClient();
  }, []);

  const onSubmit: SubmitHandler<Clienttype> = async (data) => {
    setLoading(true);
    try {
      const res = await axios.put(`/api/clients/update/${_id}`, data);
      console.log("submitted");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
      router.push("/clients");
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields({ ...touchedFields, [fieldName]: true });
  };

  const isFieldInvalid = (fieldName: keyof typeof client) => {
    return touchedFields[fieldName] && !client[fieldName];
  };

  return (
    <div className=" p-16 mx-auto bg-white rounded-lg shadow-md bg-gradient-to-tl from-white to-etuwaCustom-lb">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="client_id"
            className="block text-sm font-medium text-etuwaCustom-db"
          >
            Client ID
          </label>
          <input
            type="text"
            id="client_id"
            {...register("client_id", { required: "this is required" })}
            onBlur={() => handleBlur("client_id")}
            className={`w-full px-3 py-2 mt-1 border ${
              isFieldInvalid("client_id") ? "border-2 border-red-500" : ""
            } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
          />
          {isFieldInvalid("client_id") && (
            <p className="text-red-500 text-xs mt-1">Client ID is required.</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="client_name"
            className="block text-sm font-medium text-etuwaCustom-db"
          >
            Client Alias
          </label>
          <input
            type="text"
            id="client_name"
            {...register("client_name", { required: "this is required" })}
            onBlur={() => handleBlur("client_name")}
            className={`w-full px-3 py-2 mt-1 border ${
              isFieldInvalid("client_name") ? "border-2 border-red-500" : ""
            } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
          />
          {isFieldInvalid("client_name") && (
            <p className="text-red-500 text-xs mt-1">
              Client Alias is required.
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="client_fullname"
            className="block text-sm font-medium text-etuwaCustom-db"
          >
            Client Name
          </label>
          <input
            type="text"
            id="client_fullname"
            {...register("client_fullname", { required: "this is required" })}
            onBlur={() => handleBlur("client_fullname")}
            className={`w-full px-3 py-2 mt-1 border ${
              isFieldInvalid("client_fullname") ? "border-2 border-red-500" : ""
            } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
          />
          {isFieldInvalid("client_fullname") && (
            <p className="text-red-500 text-xs mt-1">
              Client Name is required.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="client_type"
            className="block text-sm font-medium text-etuwaCustom-db"
          >
            Client Type
          </label>
          <select
            id="client_type"
            className="w-full border focus:border-etuwaCustom-db0 rounded-md p-2"
            {...register("client_type", {
              required: "Client Type is required",
            })}
          >
            <option value=""></option>
            {clientTypes.map((clientType) => (
              <option key={clientType} value={clientType}>
                {clientType}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-etuwaCustom-db"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            {...register("email", { required: "this is required" })}
            onBlur={() => handleBlur("email")}
            className={`w-full px-3 py-2 mt-1 border ${
              isFieldInvalid("client_name") ? "border-2 border-red-500" : ""
            } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
          />
          {isFieldInvalid("email") && (
            <p className="text-red-500 text-xs mt-1">Email is required.</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="contact"
            className="block text-sm font-medium text-etuwaCustom-db"
          >
            Contact
          </label>
          <input
            type="text"
            id="contact"
            {...register("contact", { required: "this is required" })}
            onBlur={() => handleBlur("contact")}
            className={`w-full px-3 py-2 mt-1 border ${
              isFieldInvalid("contact") ? "border-2 border-red-500" : ""
            } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
          />
          {isFieldInvalid("contact") && (
            <p className="text-red-500 text-xs mt-1">Contact is required.</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="keam_code"
            className="block text-sm font-medium text-etuwaCustom-db"
          >
            Keam Code
          </label>
          <textarea
            id="description"
            {...register("keam_code", { required: "this is required" })}
            onBlur={() => handleBlur("keam_code")}
            className={`w-full px-3 py-2 mt-1 border ${
              isFieldInvalid("keam_code") ? "border-2 border-red-500" : ""
            } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
          />
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-etuwaCustom-db text-white font-medium rounded-md hover:scale-95 transtion duration-300"
        >
          {loading ? "Updating" : "Update"}
        </button>
      </form>
    </div>
  );
};

export default Page;
