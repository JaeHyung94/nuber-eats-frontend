import React from "react";

interface IFormErrorProps {
  message: string;
}

export const FormError: React.FC<IFormErrorProps> = ({ message }) => {
  return (
    <span role="alert" className="font-medium text-red-500">
      {message}
    </span>
  );
};
