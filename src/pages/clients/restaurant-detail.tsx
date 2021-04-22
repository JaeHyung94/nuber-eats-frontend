import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
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
      }
    }
  }
`;

interface IRestaurantParams {
  id: string;
}

export const RestaurantDetail = () => {
  const { id } = useParams<IRestaurantParams>();
  const { loading, data } = useQuery<restaurant, restaurantVariables>(
    RESTAURANT_DETAIL_QUERY,
    {
      variables: {
        restaurantInput: {
          restaurantId: +id,
        },
      },
    }
  );

  return (
    <div>
      {!loading && (
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
      )}
    </div>
  );
};
