import Link from "next/link";
import React from "react";

interface ActionButtonProps {
  color: string;
  href: string;
  children?: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  color,
  href,
  children,
}) => {
  return (
    <Link className={`${color} text-white px-2 py-1 rounded`} href={href}>
      {children}
    </Link>
  );
};

export default ActionButton;
