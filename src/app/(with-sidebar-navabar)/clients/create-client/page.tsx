"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const [formData, setFormData] = useState({
    client_id: "",
    client_name: "",
    client_fullname: "",
    client_type: "",
    email: "",
    contact: undefined,
    keam_code: "",
    status: "Active",
  });
  const [clientTypes, setClientTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const isFieldInvalid = (fieldName: keyof typeof formData) => {
    return touchedFields[fieldName] && !formData[fieldName];
  };
  const handleBlur = (fieldName: string) => {
    setTouchedFields({
      ...touchedFields,
      [fieldName]: true,
    });
  };

  const router = useRouter();

  useEffect(() => {
    const fetchClientTypes = async () => {
      try {
        const res = await fetch("/api/client-types/get-all");
        if (!res.ok) throw new Error("Failed to fetch client types");
        const data = await res.json();
        const clientNames = data.clientTypes.map(
          (client: { client_name: string }) => client.client_name
        );
        setClientTypes(clientNames);
      } catch (error: any) {
        return error.message;
      }
    };
    fetchClientTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/clients/create", formData);
      router.push("/clients");
    } catch (error: any) {
      console.log(error);
      alert(error.data);
    } finally {
      setLoading(false);
    }
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
      <form className="" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="client_id"
            className="block text-sm font-medium text-etuwaCustom-db"
          >
            Client-ID
          </label>
          <input
            type="text"
            id="client_id"
            name="client_id"
            value={formData.client_id}
            onChange={handleChange}
            placeholder=""
            onBlur={() => handleBlur("client_id")}
            className={`w-full px-3 py-2 mt-1 border ${
              isFieldInvalid("client_id") ? "border-2 border-red-500" : ""
            } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            disabled={loading}
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
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            placeholder=""
            onBlur={() => handleBlur("client_name")}
            className={`w-full px-3 py-2 mt-1 border ${
              isFieldInvalid("client_name") ? "border-2 border-red-500" : ""
            } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            disabled={loading}
          />
          {isFieldInvalid("client_name") && (
            <p className="text-red-500 text-xs mt-1">
              Client Alias is required.
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="client_name"
            className="block text-sm font-medium text-etuwaCustom-db"
          >
            Client Name
          </label>
          <input
            type="text"
            id="client_fullname"
            name="client_fullname"
            value={formData.client_fullname}
            onChange={handleChange}
            placeholder=""
            onBlur={() => handleBlur("client_fullname")}
            className={`w-full px-3 py-2 mt-1 border ${
              isFieldInvalid("client_fullname") ? "border-2 border-red-500" : ""
            } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            disabled={loading}
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
            Client-Type <span className="text-red-500">*</span>
          </label>
          <select
            id="client_type"
            name="client_type"
            value={formData.client_type}
            onChange={handleChange}
            onBlur={() => handleBlur("client_type")}
            className={`w-full px-3 py-2 mt-1 border ${
              isFieldInvalid("client_type") ? "border-2 border-red-500" : ""
            } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            disabled={loading}
            required
            autoComplete="off"
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
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder=""
            onBlur={() => handleBlur("email")}
            className={`w-full px-3 py-2 mt-1 border ${
              isFieldInvalid("email") ? "border-2 border-red-500" : ""
            } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            disabled={loading}
          />
          {isFieldInvalid("email") && (
            <p className="text-red-500 text-xs mt-1">Client ID is required.</p>
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
            type="number"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder=""
            onBlur={() => handleBlur("contact")}
            className={`w-full px-3 py-2 mt-1 border ${
              isFieldInvalid("contact") ? "border-2 border-red-500" : ""
            } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="keam_code"
            className="block text-sm font-medium text-etuwaCustom-db"
          >
            KEAM Code
          </label>
          <input
            type="text"
            id="keam_code"
            name="keam_code"
            value={formData.keam_code}
            onChange={handleChange}
            placeholder=""
            onBlur={() => handleBlur("keam_code")}
            className={`w-full px-3 py-2 mt-1 border ${
              isFieldInvalid("keam_code") ? "border-2 border-red-500" : ""
            } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            disabled={loading}
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
        <div className="col-span-2 flex items-center justify-center space-x-4 mt-6">
          <button
            type="reset"
            className="px-6 py-2 border border-etuwaCustom-db rounded-md bg-white-100 text-etuwaCustom-db hover:scale-95 transtion duration-300 font-medium"
            onClick={() =>
              setFormData({
                client_id: "",
                client_name: "",
                client_fullname: "",
                client_type: "",
                email: "",
                contact: undefined,
                keam_code: "",
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
  );
};

export default page;
