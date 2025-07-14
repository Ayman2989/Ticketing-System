import Question from "@/components/page-comps/faq comps/Question";
import Link from "next/link";
import React from "react";

const fetchFaqs = async () => {
  const res = await fetch("http://localhost:3000/api/faqs/get-all");
  const data = await res.json();
  return data;
};

const page = async () => {
  const faqs = await fetchFaqs();
  const FAQS = faqs.FAQS;

  return (
    <section className="max-w-7xl mx-auto py-20 px-4">
      {/* Title Section */}
      <h1 className="text-center text-3xl text-etuwaCustom-db uppercase tracking-widest font-bold mb-8">
        Frequently Asked Questions
      </h1>

      {/* FAQ & Support Section (Side by Side) */}
      <div className="flex gap-8 items-start justify-between">
        {/* FAQ Section (Main Content) */}
        <div className="flex-1 min-h-[400px]">
          <div className="grid grid-cols-1 gap-8">
            {FAQS.map((faq: any, index: string) => (
              <Question
                key={index}
                _id={faq._id}
                question={faq.question}
                answer={faq.answer}
                attachment={faq.attachment}
              />
            ))}
          </div>
        </div>

        {/* Need Support Section */}
        <div className="w-1/4 flex flex-col justify-center p-5 border-l-2 border-etuwaCustom-db h-full">
          <h1 className="text-center text-xl text-etuwaCustom-db uppercase tracking-widest font-semibold">
            Need Support?
          </h1>
          <p className="text-center text-sm text-etuwaCustom-db font-normal mt-4">
            We are here to help. If you have any questions or need assistance,
            please contact our support team.
          </p>
          <Link
            href="/contact-support"
            className=" text-center bg-etuwaCustom-db border-2 border-etuwaCustom-db hover:bg-white hover:text-etuwaCustom-db transition duration-300 text-white px-4 py-2 mt-8 rounded-md"
          >
            Contact Support
          </Link>
          <Link
            href="/faqs/create-faq"
            className="bg-etuwaCustom-db border-2 border-etuwaCustom-db hover:bg-white hover:text-etuwaCustom-db transition duration-300 text-white px-4 py-2 mt-4 rounded-md text-center"
          >
            New FAQ
          </Link>
        </div>
      </div>
    </section>
  );
};

export default page;
