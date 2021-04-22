import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center">
    <Helmet>
      <title>Not Found | Nuber Eats</title>
    </Helmet>
    <h2 className="font-bold text-4xl mb-8">Page Not Found</h2>
    <h4 className="font-light text-xl mb-5">
      The page you are looking for does not exists
    </h4>
    <Link to="/" className="font-light text-lg hover:underline text-lime-600">
      Go Back Home &rarr;
    </Link>
  </div>
);
