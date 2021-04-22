import React from "react";
import { Link } from "react-router-dom";

interface IRestaurantProps {
  id: number;
  coverImage: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  id,
  coverImage,
  name,
  categoryName,
}) => (
  <Link to={`/restaurant/${id}`}>
    <div className="flex flex-col transform scale-100 hover:scale-105 transition-all duration-500">
      <div
        key={id}
        className="bg-center py-32 bg-cover mb-3"
        style={{ backgroundImage: `Url(${coverImage})` }}
      ></div>
      <h3 className="text-md font-medium">{name}</h3>
      <span className="border-t-2 mt-2 py-2 text-xs opacity-50 border-gray-300">
        {categoryName}
      </span>
    </div>
  </Link>
);
