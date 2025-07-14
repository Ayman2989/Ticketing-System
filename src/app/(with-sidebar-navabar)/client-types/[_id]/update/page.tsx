"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface ClientTypeProps {
  client_name: string;
  description: string;
  status: string;
}

const Page = () => {
  const { _id } = useParams();
  const router = useRouter();
  const [client, setClient] = useState<ClientTypeProps>({
    client_name: "",
    description: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const { register, handleSubmit, setValue, reset } = useForm<ClientTypeProps>({
    defaultValues: {
      client_name: "",
      description: "",
      status: "",
    },
  });
  useEffect(() => {
    const fetchClientType = async () => {
      try {
        const res = await fetch(`/api/client-types/${_id}`);
        const data = await res.json();
        if (data.clientType) {
          reset(data.clientType); // Update all form values at once
        }
        setClient(data.clientType);
        console.log(data.clientType);
      } catch (error) {
        console.error("Failed to fetch client:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClientType();
  }, []);

  const onSubmit: SubmitHandler<ClientTypeProps> = async (data) => {
    setLoading(true);
    try {
      const res = await axios.put(`/api/client-types/update/${_id}`, data);
      console.log("submitted");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      router.push("/client-types");
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
            htmlFor="client_name"
            className="block text-sm font-medium text-etuwaCustom-db"
          >
            Name
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
              Client Name is required.
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
