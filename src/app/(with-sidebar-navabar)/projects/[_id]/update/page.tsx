"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface ProjectProps {
  project_name: string;
  status: string;
}

const Page = () => {
  const { _id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectProps>({
    project_name: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const { register, handleSubmit, setValue, reset } = useForm<ProjectProps>({
    defaultValues: {
      project_name: "",
      status: "Active",
    },
  });
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${_id}`);
        const data = await res.json();
        if (data.project) {
          reset(data.project); // Update all form values at once
        }
        setProject(data.project);
        console.log(data.project);
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, []);

  const onSubmit: SubmitHandler<ProjectProps> = async (data) => {
    setLoading(true);
    try {
      const res = await axios.put(`/api/projects/update/${_id}`, data);
      console.log("submitted");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      router.push("/projects");
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields({ ...touchedFields, [fieldName]: true });
  };

  const isFieldInvalid = (fieldName: keyof typeof project) => {
    return touchedFields[fieldName] && !project[fieldName];
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
            id="project-name"
            {...register("project_name", { required: "this is required" })}
            onBlur={() => handleBlur("project_name")}
            className={`w-full px-3 py-2 mt-1 border ${
              isFieldInvalid("project_name") ? "border-2 border-red-500" : ""
            } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
          />
          {isFieldInvalid("project_name") && (
            <p className="text-red-500 text-xs mt-1">
              Project Name is required.
            </p>
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
