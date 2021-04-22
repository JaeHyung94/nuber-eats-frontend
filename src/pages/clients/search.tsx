import { useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import {
  searchRestaurant,
  searchRestaurantVariables,
} from "../../__api__/searchRestaurant";
import { Restaurant } from "../../components/restaurant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useHistory, useLocation } from "react-router";
import { Helmet } from "react-helmet-async";

const SEARCH_RESTAURANT_QUERY = gql`
  query searchRestaurant($searchRestaurantInput: SearchRestaurantInput!) {
    searchRestaurant(input: $searchRestaurantInput) {
      ok
      totalPages
      totalResults
      restaurants {
        id
        name
        coverImage
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

export const Search = () => {
  const [page, setPage] = useState(1);
  const location = useLocation();
  const history = useHistory();
  const [callQuery, { loading, data }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT_QUERY);
  const searchQuery = location.search.split("?searchQuery=")[1];

  useEffect(() => {
    if (!searchQuery) {
      return history.replace("/");
    }

    callQuery({
      variables: {
        searchRestaurantInput: {
          page,
          query: searchQuery,
        },
      },
    });
  }, [history, location, callQuery, page, searchQuery]);

  const pageUp = () => {
    setPage(page + 1);
  };

  const pageDown = () => {
    setPage(page - 1);
  };

  return (
    <div>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      {!loading && (
        <div className="container mx-auto mt-5">
          <div className="mb-5">
            <div></div>
            <div className="font-medium text-2xl capitalize mb-2">
              Searching For: {searchQuery}
            </div>
            <div>{data?.searchRestaurant.totalResults} results</div>
          </div>
          <div className="grid px-3 md:px-0 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.searchRestaurant.restaurants?.map((restaurant, key) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id}
                coverImage={restaurant.coverImage}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              ></Restaurant>
            ))}
          </div>
          <div className="grid grid-cols-3 px-3 md:px-0 text-center max-w-md items-center mx-auto my-10">
            {page > 1 ? (
              <button
                onClick={pageDown}
                className="focus:outline-none font-medium text-2xl"
              >
                <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
              </button>
            ) : (
              <div></div>
            )}
            <div className="font-medium">
              Page {page} of {data?.searchRestaurant.totalPages}
            </div>
            {page !== data?.searchRestaurant.totalPages ? (
              <button
                onClick={pageUp}
                className="focus:outline-none font-medium text-2xl"
              >
                <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
