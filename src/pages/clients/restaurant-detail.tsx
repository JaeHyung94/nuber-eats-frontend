import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Dish } from "../../components/dish";
import { DishOption } from "../../components/dish-option";
import { createOrder, createOrderVariables } from "../../__api__/createOrder";
import { CreateOrderItemInput } from "../../__api__/globalTypes";
import { restaurant, restaurantVariables } from "../../__api__/restaurant";

const RESTAURANT_DETAIL_QUERY = gql`
  query restaurant($restaurantInput: RestaurantInput!) {
    restaurant(input: $restaurantInput) {
      ok
      error
      restaurant {
        id
        name
        coverImage
        address
        category {
          id
          name
          slug
        }
        isPromoted
        menu {
          id
          name
          price
          photo
          description
          options {
            name
            extra
            choices {
              name
              extra
            }
          }
        }
      }
    }
  }
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
`;

interface IRestaurantParams {
  id: string;
}

export const RestaurantDetail = () => {
  const { id: restaurantId } = useParams<IRestaurantParams>();
  const { loading, data } = useQuery<restaurant, restaurantVariables>(
    RESTAURANT_DETAIL_QUERY,
    {
      variables: {
        restaurantInput: {
          restaurantId: +restaurantId,
        },
      },
    }
  );
  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const triggerStartOrder = () => {
    setOrderStarted(true);
  };
  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };
  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };
  const addItemToOrder = (dishId: number) => {
    if (isSelected(dishId)) {
      return;
    } else {
      setOrderItems((current) => [{ dishId, options: [] }, ...current]);
    }
  };
  const removeFromOrder = (dishId: number) => {
    setOrderItems((current) =>
      current.filter((dish) => dish.dishId !== dishId)
    );
  };
  const addOptionToItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    } else {
      const oldItem = getItem(dishId);
      if (oldItem) {
        const hasOption = Boolean(
          oldItem.options?.find((aOption) => aOption.name === optionName)
        );
        if (!hasOption) {
          removeFromOrder(dishId);
          setOrderItems((current) => [
            { dishId, options: [{ name: optionName }, ...oldItem.options!] },
            ...current,
          ]);
        }
      }
    }
  };
  const getOptionFromItem = (
    item: CreateOrderItemInput,
    optionName: string
  ) => {
    return item.options?.find((option) => option.name === optionName);
  };
  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    } else {
      return false;
    }
  };
  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    } else {
      const oldItem = getItem(dishId);
      if (oldItem) {
        removeFromOrder(dishId);
        setOrderItems((current) => [
          {
            dishId,
            options: oldItem.options?.filter(
              (option) => option.name !== optionName
            ),
          },
          ...current,
        ]);
      }
    }
  };
  const triggerCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };
  const history = useHistory();
  const onCompleted = (data: createOrder) => {
    const {
      createOrder: { ok, orderId },
    } = data;
    if (ok) {
      history.push(`/order/${orderId}`);
    }
  };
  const [createOrderMutation, { loading: placingOrder }] = useMutation<
    createOrder,
    createOrderVariables
  >(CREATE_ORDER_MUTATION, {
    onCompleted,
  });
  const triggerConfirmOrder = () => {
    if (placingOrder) {
      return;
    }
    if (orderItems.length === 0) {
      alert("Can't place empty order");
    } else {
      const ok = window.confirm("You are about to place an order");
      if (ok) {
        createOrderMutation({
          variables: {
            input: {
              restaurantId: +restaurantId,
              items: orderItems,
            },
          },
        });
      }
    }
  };
  return (
    <div>
      {!loading && (
        <div>
          <div
            className="bg-gray-800 py-28 bg-center bg-cover"
            style={{
              backgroundImage: `url(${data?.restaurant.restaurant?.coverImage})`,
            }}
          >
            <div className="bg-white w-1/4 py-8 pl-20">
              <h4 className="text-2xl font-medium mb-3">
                {data?.restaurant.restaurant?.name}
              </h4>
              <span className="text-sm font-light hover:underline mb-2">
                <Link
                  to={`/category/${data?.restaurant.restaurant?.category?.slug}`}
                >
                  {data?.restaurant.restaurant?.category?.name}
                </Link>
              </span>
              <h5 className="text-sm font-light">
                {data?.restaurant.restaurant?.address}
              </h5>
            </div>
          </div>
          <div className="container flex flex-col items-end mx-auto mt-5">
            {!orderStarted && (
              <button onClick={triggerStartOrder} className="btn px-10">
                Start Order
              </button>
            )}
            {orderStarted && (
              <div className="flex items-center">
                <button
                  onClick={triggerConfirmOrder}
                  className="btn px-10 mr-3"
                >
                  Confirm Order
                </button>
                <button
                  onClick={triggerCancelOrder}
                  className="mt-3 focus:outline-none py-3 text-white font-medium transition-colors duration-150 px-10 bg-black hover:bg-black"
                >
                  Cancel Order
                </button>
              </div>
            )}
            <div className="w-full grid px-3 md:px-0 md:grid-cols-3 gap-x-5 gap-y-1 mt-5">
              {data?.restaurant.restaurant?.menu.map((dish) => (
                <Dish
                  isSelected={isSelected(dish.id)}
                  id={dish.id}
                  orderStarted={orderStarted}
                  key={dish.id}
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                  isCustomer={true}
                  options={dish.options}
                  addItemToOrder={addItemToOrder}
                  removeFromOrder={removeFromOrder}
                >
                  {dish.options?.map((option, index) => (
                    <DishOption
                      key={index}
                      isSelected={isOptionSelected(dish.id, option.name)}
                      name={option.name}
                      extra={option.extra}
                      addOptionToItem={addOptionToItem}
                      removeOptionFromItem={removeOptionFromItem}
                      dishId={dish.id}
                    ></DishOption>
                  ))}
                </Dish>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
