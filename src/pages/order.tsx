import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { useMe } from "../hooks/useMe";
import { editOrder, editOrderVariables } from "../__api__/editOrder";
import { getOrder, getOrderVariables } from "../__api__/getOrder";
import { OrderStatus, UserRole } from "../__api__/globalTypes";
import { orderUpdates } from "../__api__/orderUpdates";

const GET_ORDER_QUERY = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        id
        status
        total
        deliver {
          email
        }
        customer {
          email
        }
        restaurant {
          name
        }
      }
    }
  }
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      id
      status
      total
      deliver {
        email
      }
      customer {
        email
      }
      restaurant {
        name
      }
    }
  }
`;

const EDIT_ORDER_MUTATION = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
}

export const Order = () => {
  const { id: orderId } = useParams<IParams>();
  const { data: userData } = useMe();
  const { data, subscribeToMore } = useQuery<getOrder, getOrderVariables>(
    GET_ORDER_QUERY,
    {
      variables: {
        input: {
          id: +orderId,
        },
      },
    }
  );
  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            id: +orderId,
          },
        },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: orderUpdates } }
        ) => {
          if (!data) {
            return prev;
          } else {
            return {
              getOrder: {
                ...prev.getOrder,
                order: {
                  ...data.orderUpdates,
                },
              },
            };
          }
        },
      });
    }
  }, [data, orderId, subscribeToMore]);
  //eslint-disable-next-line
  const [editOrder, { data: mutationData }] = useMutation<
    editOrder,
    editOrderVariables
  >(EDIT_ORDER_MUTATION);
  const onButtonClick = (newStatus: OrderStatus) => {
    editOrder({
      variables: {
        input: {
          id: +orderId,
          status: newStatus,
        },
      },
    });
  };

  return (
    <div>
      <Helmet>
        <title>Order | Nuber Eats</title>
      </Helmet>
      <div className="flex items-center justify-center mt-20">
        <div className="container w-1/3 border border-gray-700">
          <div className="py-3 text-center bg-gray-700 text-white font-medium text-xl">
            Order #{data?.getOrder.order?.id}
          </div>
          <div className="mx-3">
            <div className="py-4 text-center font-medium text-2xl">
              ${data?.getOrder.order?.total}
            </div>
            <div className="py-3 font-medium border-t border-b border-gray-700">
              Prepared By: {data?.getOrder.order?.restaurant?.name}
            </div>
            <div className="py-3 font-medium border-b border-gray-700">
              Deliver To: {data?.getOrder.order?.customer?.email}
            </div>
            <div className="py-3 font-medium">
              Driver:{" "}
              {data?.getOrder.order?.deliver
                ? data.getOrder.order.deliver.email
                : "Not yet"}
            </div>
          </div>
          {userData?.me.role === UserRole.Client && (
            <div className="text-center py-5 text-xl text-lime-600 border-t border-gray-700 mx-3">
              Status: {data?.getOrder.order?.status}
            </div>
          )}
          {userData?.me.role === UserRole.Owner && (
            <div
              className={`mx-3 ${
                data?.getOrder.order?.status === OrderStatus.Pending ||
                data?.getOrder.order?.status === OrderStatus.Cooking
                  ? "border-t border-gray-700"
                  : ""
              } `}
            >
              {data?.getOrder.order?.status === OrderStatus.Pending && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooking)}
                  className="btn mb-3 w-full"
                >
                  Accept Order
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.Cooking && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooked)}
                  className="btn mb-3 w-full"
                >
                  Cooking Finished
                </button>
              )}
              {data?.getOrder.order?.status !== OrderStatus.Pending &&
                data?.getOrder.order?.status !== OrderStatus.Cooking && (
                  <div className="text-center py-5 text-xl text-lime-600 border-t border-gray-700">
                    Status: {data?.getOrder.order?.status}
                  </div>
                )}
            </div>
          )}
          {userData?.me.role === UserRole.Delivery && (
            <div
              className={`mx-3 ${
                data?.getOrder.order?.status === OrderStatus.Cooked ||
                data?.getOrder.order?.status === OrderStatus.PickedUp
                  ? "border-t border-gray-700"
                  : ""
              } `}
            >
              {data?.getOrder.order?.status === OrderStatus.Cooked && (
                <button
                  onClick={() => onButtonClick(OrderStatus.PickedUp)}
                  className="btn mb-3 w-full"
                >
                  Pick Up
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.PickedUp && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Delivered)}
                  className="btn mb-3 w-full"
                >
                  Delivered
                </button>
              )}
              {data?.getOrder.order?.status !== OrderStatus.Cooked &&
                data?.getOrder.order?.status !== OrderStatus.PickedUp && (
                  <div className="text-center py-5 text-xl text-lime-600 border-t border-gray-700">
                    Status: {data?.getOrder.order?.status}
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
