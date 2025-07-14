"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Modal from "../modal/Modal";

interface DeleteButtonProps {
  _id: string;
  api: string;
  redirectLink: string;
  children: React.ReactNode;
  classes: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Accept onClick prop
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  _id,
  api,
  redirectLink,
  children,
  classes,
  onClick,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const handleDelete = async (_id: string) => {
    try {
      const res = await axios.delete(`/api/faqs/delete/${_id}`);
      router.push(redirectLink);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation(); // 👈 Stop event bubbling
          handleDelete(_id);
        }}
        className={classes}
      >
        {children}
      </button>
      {/* {isModalOpen && (
        <Modal
          onConfirm={() => handleDelete(_id)}
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          title="Confirm Deletion"
          message="Are you sure you want to delete this ticket? This action cannot be undone."
        />
      )} */}
    </>
  );
};

export default DeleteButton;
