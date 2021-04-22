import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import nuberLogo from "../images/logo.svg";

export const Header: React.FC = () => {
  const { data } = useMe();
  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 px-2 py-3 text-center text-sm text-white">
          <span>Please Verify Your Email</span>
        </div>
      )}
      <header className="container mx-auto py-4">
        <div className="mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={nuberLogo} className="w-32" alt=""></img>
          </Link>
          <span className="text-base">
            <Link to="/logout">
              <span>Log out</span>
            </Link>
            <Link to="/edit-profile">
              <FontAwesomeIcon icon={faUser} className="text-xl ml-5" />
            </Link>
          </span>
        </div>
      </header>
    </>
  );
};
