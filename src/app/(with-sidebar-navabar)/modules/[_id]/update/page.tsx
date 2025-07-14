"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface ModuleProps {
  module_name: string;
  status: string;
}

const Page = () => {
  const { _id } = useParams();
  const router = useRouter();
  const [module, setModule] = useState<ModuleProps>({
    module_name: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const { register, handleSubmit, setValue, reset } = useForm<ModuleProps>({
    defaultValues: {
      module_name: "",
      status: "Active",
    },
  });
  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await fetch(`/api/modules/${_id}`);
        const data = await res.json();
        if (data.module) {
          reset(data.module); // Update all form values at once
        }
        setModule(data.module);
        console.log(data.module);
      } catch (error) {
        console.error("Failed to fetch module:", error);
      }
    };
    fetchModule();
  }, []);

  const onSubmit: SubmitHandler<ModuleProps> = async (data) => {
    setLoading(true);
    try {
      const res = await axios.put(`/api/modules/update/${_id}`, data);
      console.log("submitted");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      router.push("/modules");
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields({ ...touchedFields, [fieldName]: true });
  };

  const isFieldInvalid = (fieldName: keyof typeof module) => {
    return touchedFields[fieldName] && !module[fieldName];
  };

  return (
    <div className=" p-16 mx-auto bg-white rounded-lg shadow-md bg-gradient-to-tl from-white to-etuwaCustom-lb">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="module_name"
            className="block text-sm font-medium text-etuwaCustom-db"
          >
            Name
          </label>
          <input
            type="text"
            id="module_name"
            {...register("module_name", { required: "this is required" })}
            onBlur={() => handleBlur("module_name")}
            className={`w-full px-3 py-2 mt-1 border ${
              isFieldInvalid("module_name") ? "border-2 border-red-500" : ""
            } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
          />
          {isFieldInvalid("module_name") && (
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
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default Page;
