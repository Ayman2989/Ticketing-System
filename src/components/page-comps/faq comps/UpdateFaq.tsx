"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface UpdateFaqProps {
  question: string;
  answer: string;
  image?: string;
  _id: string;
  onUpdateComplete?: () => void; // 👈 Add callback to make update form ediappear
}
const UpdateFaq: React.FC<UpdateFaqProps> = ({
  question,
  answer,
  _id,
  image,
  onUpdateComplete,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    question,
    answer,
    attachment: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});

  const isFieldInvalid = (fieldName: keyof typeof formData) => {
    return touchedFields[fieldName] && !formData[fieldName];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!formData.attachment) {
    //   alert("Please select an image to upload.");
    //   return;
    // }

    console.log("Form Data:", formData);
    console.log(formData.attachment);

    setLoading(true);

    // form.append("image", formData.attachment);
    const formDataToSend: {
      question: string;
      answer: string;
      attachment?: File;
    } = {
      question: formData.question,
      answer: formData.answer,
    };

    // Only include attachment if a new file is uploaded
    if (formData.attachment) {
      formDataToSend.attachment = formData.attachment;
    }

    try {
      const response = await axios.put(
        `/api/faqs/update/${_id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      router.push(`/faqs`); // Adjust redirection as needed
    } catch (error) {
      console.error("Error uploading faq", error);
    } finally {
      setLoading(false);
      onUpdateComplete?.(); // 👈 Call callback to make update form disappear
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields({
      ...touchedFields,
      [fieldName]: true,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };
  return (
    <div className="p-16 mx-auto bg-white rounded-lg shadow-md bg-gradient-to-tl from-white to-etuwaCustom-lb w-full">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="question"
            className="block text-sm font-medium text-etuwaCustom-db"
          >
            Question
          </label>
          <input
            type="text"
            id="question"
            name="question"
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
            onBlur={() => handleBlur("question")}
            className={`w-full px-3 py-2 mt-1 border ${
              isFieldInvalid("question") ? "border-2 border-red-500" : ""
            } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            disabled={loading} // Disable input when loading
          />
          {isFieldInvalid("question") && (
            <p className="text-red-500 text-xs mt-1">Question is required.</p>
          )}

          <label
            htmlFor="answer"
            className="block text-sm font-medium text-etuwaCustom-db"
          >
            Answer
          </label>
          <textarea
            id="answer"
            name="answer"
            value={formData.answer}
            onChange={(e) =>
              setFormData({ ...formData, answer: e.target.value })
            }
            onBlur={() => handleBlur("answer")}
            className={`w-full px-3 py-2 mt-1 border ${
              isFieldInvalid("answer") ? "border-2 border-red-500" : ""
            } rounded focus:outline-none focus:border-etuwaCustom-db transition duration-200`}
            disabled={loading} // Disable input when loading
          />
          {isFieldInvalid("answer") && (
            <p className="text-red-500 text-xs mt-1">Answer is required.</p>
          )}
          <img src={image} alt="Attachment" className="w-full h-auto mt-4" />

          <label
            htmlFor="attachment"
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

        <button
          type="submit"
          disabled={loading} // Disable button when loading
          className="px-6 py-2 bg-etuwaCustom-db text-white font-medium rounded-md hover:scale-95 transition duration-300"
        >
          {loading ? "Updating" : "Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdateFaq;
