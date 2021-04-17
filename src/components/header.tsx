import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import nuberLogo from "../images/logo.svg";

export const Header: React.FC = () => {
  const { data } = useMe();
  console.log(data);
  return (
    <header className="py-4">
      <div className="container mx-auto flex justify-between items-center">
        <img src={nuberLogo} className="w-24" alt=""></img>
        <span className="text-xs">
          <Link to="/my-profile">
            <FontAwesomeIcon icon={faUser} className="text-lg" />
          </Link>
        </span>
      </div>
    </header>
  );
};
