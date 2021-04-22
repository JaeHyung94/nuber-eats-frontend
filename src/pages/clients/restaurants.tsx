import { useQuery } from "@apollo/client";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Category } from "../../components/category";
import { Restaurant } from "../../components/restaurant";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__api__/restaurantsPageQuery";

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($restaurantsInput: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImage
        slug
        restaurantCount
      }
    }

    restaurants(input: $restaurantsInput) {
      ok
      error
      totalPages
      totalResults
      results {
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

interface ISearchProps {
  searchQuery: string;
}

export const Restaurants = () => {
  const [page, setPage] = useState(1);

  const pageUp = () => {
    setPage(page + 1);
  };

  const pageDown = () => {
    setPage(page - 1);
  };

  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      restaurantsInput: {
        page,
      },
    },
  });

  const { register, handleSubmit, getValues } = useForm<ISearchProps>();
  const history = useHistory();

  const onSearchSubmit = () => {
    const { searchQuery } = getValues();
    history.push({
      pathname: "/search",
      search: `?searchQuery=${searchQuery}`,
    });
  };

  return (
    <div>
      <Helmet>
        <title>Home | Nuber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 w-full py-24 flex items-center justify-center"
      >
        <input
          {...register("searchQuery", { required: true })}
          name="searchQuery"
          type="Search"
          placeholder="Search Restaurants..."
          className="input w-3/4 md:w-1/2 rounded-sm border-0"
        ></input>
      </form>
      {!loading && (
        <div className="container mx-auto mt-5">
          {/* //flex justify-around max-w-sm mx-auto mb-10 */}
          <div className="w-full md:w-1/2 lg:w-1/3 mx-auto grid grid-cols-4 px-3 md:px-0 gap-x-3 mb-5">
            {data?.allCategories.categories?.map((category, key) => (
              <Link to={`/category/${category.slug}`} key={category.id}>
                <Category
                  id={category.id}
                  coverImage={category.coverImage ? category.coverImage : ""}
                  slug={category.slug}
                ></Category>
              </Link>
            ))}
          </div>
          <div className="grid px-3 md:px-0 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.restaurants.results?.map((restaurant, key) => (
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
              Page {page} of {data?.restaurants.totalPages}
            </div>
            {page !== data?.restaurants.totalPages ? (
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
