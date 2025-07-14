"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Contact() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    try {
      const response = await fetch("/api/contact-support/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      if (data.success) {
        alert("Message sent successfully!");
      }
      router.push(`/faqs`); // Adjust redirection as needed
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center ">
      <h1 className="text-center text-3xl text-etuwaCustom-db uppercase tracking-widest font-bold mb-8">
        Contact Support
      </h1>
      <p className="text-center text-md text-etuwaCustom-db font-normal mt-4">
        We are here to help. If you have any questions or need assistance,
        please contact our support team.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
      >
        <div className="mb-4 flex flex-col w-500">
          <label htmlFor="form-name" className="text-etuwaCustom-db">
            Name
          </label>
          <input
            id="form-name"
            autoComplete="name"
            maxLength={50}
            name="name"
            type="text"
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            value={formData.name}
            className={`w-full max-w-md px-3 py-2 mt-1 border-2 rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
          />

          <label htmlFor="form-email" className="text-etuwaCustom-db">
            {" "}
            Email:
          </label>
          <input
            id="form-email"
            required
            autoComplete="email"
            maxLength={80}
            name="email"
            type="email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            value={formData.email}
            className={`w-full max-w-md px-3 py-2 mt-1 border-2 rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
          />

          <label htmlFor="form-message" className="text-etuwaCustom-db">
            {" "}
            Message:{" "}
          </label>
          <textarea
            id="form-message"
            required
            name="message"
            rows={5}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            value={formData.message}
            className={`w-full max-w-md border-2 px-3 py-2 mt-1 rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
          />
        </div>
        <button
          className="px-6 py-2 bg-etuwaCustom-db text-white font-medium rounded-md hover:scale-95 transition duration-300"
          type="submit"
        >
          Send
        </button>
      </form>
    </main>
  );
}
