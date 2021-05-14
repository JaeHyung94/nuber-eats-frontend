import React from "react";
import { restaurant_restaurant_restaurant_menu_options } from "../__api__/restaurant";

interface IDishProps {
  id?: number;
  description: string;
  name: string;
  price: number;
  isCustomer?: boolean;
  orderStarted?: boolean;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
  options?: restaurant_restaurant_restaurant_menu_options[] | null;
  isSelected?: boolean;
}

export const Dish: React.FC<IDishProps> = ({
  id = 0,
  description,
  name,
  price,
  isCustomer = false,
  orderStarted = false,
  addItemToOrder,
  removeFromOrder,
  options,
  isSelected,
  children: dishOptions,
}) => {
  const onClick = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        addItemToOrder(id);
      }
      if (isSelected && removeFromOrder) {
        removeFromOrder(id);
      }
    }
  };
  return (
    <div
      className={`px-8 py-4 border hover:border-gray-800 transition-all ${
        isSelected ? "border-gray-800" : "hover:border-gray-800"
      }`}
    >
      <div className="mb-5">
        <h3 className="text-lg font-medium flex items-center">
          {name}{" "}
          {orderStarted && (
            <button
              onClick={onClick}
              className={`ml-3 py-1 px-3 focus:outline-none text-sm  text-white ${
                isSelected ? "bg-red-500" : " bg-lime-600"
              }`}
            >
              {isSelected ? "Remove" : "Pick"}
            </button>
          )}
        </h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <div>${price}</div>
      {isCustomer && options && options.length !== 0 && (
        <div>
          <h5 className="my-3 font-medium">Dish Options</h5>
          <div className="grid gap-2 justify-start">{dishOptions}</div>
        </div>
      )}
    </div>
  );
};
