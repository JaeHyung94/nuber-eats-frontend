import { useQuery } from "@apollo/client";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { Restaurant } from "../../components/restaurant";
import { category, categoryVariables } from "../../__api__/category";

const SEARCH_CATEGORY_QUERY = gql`
  query category($categoryInput: CategoryInput!) {
    category(input: $categoryInput) {
      ok
      error
      totalPages
      totalResults
      category {
        id
        name
        coverImage
        slug
        restaurantCount
      }
      restaurants {
        id
        name
        coverImage
        address
        isPromoted
      }
    }
  }
`;

interface ICategoryParams {
  slug: string;
}

export const CategorySearch = () => {
  const [page, setPage] = useState(1);
  const { slug } = useParams<ICategoryParams>();
  const { loading, data } = useQuery<category, categoryVariables>(
    SEARCH_CATEGORY_QUERY,
    {
      variables: {
        categoryInput: {
          page,
          slug,
        },
      },
    }
  );

  const pageUp = () => {
    setPage(page + 1);
  };
  const pageDown = () => {
    setPage(page - 1);
  };

  return (
    <div>
      <Helmet>
        <title>Category | Nuber Eats</title>
      </Helmet>
      {!loading && (
        <div className="container mx-auto mt-5">
          <div className="mb-5">
            <div></div>
            <div className="font-medium text-2xl capitalize mb-2">
              Category: {slug}
            </div>
            <div>{data?.category.totalResults} results</div>
          </div>
          <div className="grid px-3 md:px-0 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.category.restaurants?.map((restaurant, key) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id}
                coverImage={restaurant.coverImage}
                name={restaurant.name}
                categoryName={data.category.category?.slug}
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
              Page {page} of {data?.category.totalPages}
            </div>
            {page !== data?.category.totalPages ? (
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
