"use client";

import DeleteButton from "@/components/action-button/DeleteButton";
import Link from "next/link";
import React, { useState } from "react";
import UpdateFaq from "./UpdateFaq";

interface QuestionProps {
  question: string;
  answer: string;
  attachment?: string; // Optional in case there's no attachment
  _id: string;
}

const Question: React.FC<QuestionProps> = ({
  question,
  answer,
  attachment,
  _id,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  return (
    <>
      {showUpdate ? (
        <UpdateFaq
          question={question}
          answer={answer}
          image={attachment}
          _id={_id}
          onUpdateComplete={() => setShowUpdate(false)} // 👈 Pass callback
        />
      ) : (
        <div
          className="border-t-2 border-etuwaCustom-db bg-etuwaCustom-wb cursor-pointer"
          onClick={() => setShowAnswer(!showAnswer)}
        >
          <div className="flex items-center justify-between pt-3 pl-2">
            <h2
              className="cursor-pointer text-etuwaCustom-db text-xl font-semibold pt-2"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              {question}
            </h2>
            <button>
              {showAnswer ? (
                <svg
                  className={`h-6 w-6 text-etuwaCustom-db transition-transform duration-300 ${
                    showAnswer ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <line x1="9" y1="12" x2="15" y2="12" />
                </svg>
              ) : (
                <svg
                  className={`h-6 w-6 text-etuwaCustom-db transition-transform duration-300 ${
                    showAnswer ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              )}
            </button>
          </div>

          {showAnswer && (
            <div className=" text-black font-medium text-base p-4 lg:p-6">
              <p className="whitespace-normal break-words">{answer}</p>
              {attachment && (
                <img
                  src={attachment}
                  alt="Attachment"
                  className="w-full h-auto mt-4"
                />
              )}
              <div className="flex justify-center mt-5">
                <button
                  onClick={() => setShowUpdate(!showUpdate)}
                  className="w-auto m-2 px-5 py-3 border border-green-500 text-green-500 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300 font-bold"
                >
                  Update
                </button>
                <DeleteButton
                  classes="w-24 m-2 px-5 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 font-bold"
                  _id={_id}
                  api={`/api/faqs/delete/${_id}`}
                  redirectLink="/faqs"
                  onClick={(e) => e.stopPropagation()} // 👈 Prevent event bubbling
                >
                  Delete
                </DeleteButton>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Question;
