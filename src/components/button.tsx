import React from "react";

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
}) => {
  return (
    <button
      role="button"
      className={`mt-3 focus:outline-none py-3 text-white font-medium ${
        !canClick
          ? "bg-gray-300 pointer-events-none"
          : "bg-lime-600 hover:bg-lime-800 transition-colors duration-150"
      }`}
    >
      {loading ? "Loading..." : actionText}
    </button>
  );
};
