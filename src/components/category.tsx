import React from "react";

interface ICategoryProps {
  id: number;
  coverImage: string;
  slug: string;
}

export const Category: React.FC<ICategoryProps> = ({
  id,
  coverImage,
  slug,
}) => (
  <div className="flex flex-col group justify-center items-center cursor-pointer">
    <div
      key={id}
      className="w-16 h-16 rounded-full bg-cover group-hover:opacity-60"
      style={{ backgroundImage: `url(${coverImage})` }}
    ></div>
    <span className="text-sm font-medium mt-1">{slug}</span>
  </div>
);
