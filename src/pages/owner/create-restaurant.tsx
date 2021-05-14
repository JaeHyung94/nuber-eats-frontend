import { useApolloClient, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../__api__/createRestaurant";
import { CreateRestaurantInput } from "../../__api__/globalTypes";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($createRestaurantInput: CreateRestaurantInput!) {
    createRestaurant(input: $createRestaurantInput) {
      ok
      error
      restaurantId
    }
  }
`;

export const CreateRestaurant = () => {
  const client = useApolloClient();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState("");
  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      const { name, categoryName, address } = getValues();
      setUploading(false);
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult.myRestaurants,
            restaurants: [
              {
                address,
                category: {
                  name: categoryName,
                  __typename: "Category",
                },
                coverImage: imageUrl,
                id: restaurantId,
                isPromoted: false,
                name,
                __typename: "Restaurant",
              },
              ...queryResult.myRestaurants.restaurants,
            ],
          },
        },
      });
      history.push("/");
    }
  };

  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
    //이렇게 하면 매번 API를 불러야 하고, DB에 부담이 생김. Cache를 가지고 만드는 것이 나음.
    // refetchQueries: [{ query: MY_RESTAURANTS_QUERY }],
  });

  const {
    register,
    getValues,
    formState,
    handleSubmit,
  } = useForm<CreateRestaurantInput>({
    mode: "onChange",
  });

  const [uploading, setUploading] = useState(false);

  const onSubmit = async () => {
    try {
      setUploading(true);
      const { coverImage, name, categoryName, address } = getValues();
      const actualFile = coverImage[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url } = await (
        await fetch("http://localhost:4000/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json();
      setImageUrl(url);
      createRestaurantMutation({
        variables: {
          createRestaurantInput: {
            name,
            categoryName,
            address,
            coverImage: url,
          },
        },
      });
    } catch (error) {
      console.log(ErrorEvent);
    }
  };

  return (
    <div className="h-full flex flex-col items-center mt-8">
      <Helmet>
        <title>Create Restaurant | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm px-4 md:px-11 flex flex-col items-center">
        <div>Create Restaurant</div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-5"
        >
          <input
            {...register("name", {
              required: "Restaurant Name is Required",
            })}
            name="name"
            type="text"
            placeholder="Restaurant Name"
            className="input"
          ></input>
          <input
            {...register("address", {
              required: "Address is Required",
            })}
            name="address"
            type="text"
            placeholder="Address"
            className="input"
          ></input>
          <input
            {...register("categoryName", {
              required: "Category Name is Required",
            })}
            name="categoryName"
            type="text"
            placeholder="Category Name"
            className="input"
          ></input>
          <input
            {...register("coverImage", { required: "Cover Image is Required" })}
            name="coverImage"
            type="file"
            accept="/image/*"
            placeholder="Cover Image"
            className="input"
          ></input>
          <Button
            canClick={formState.isValid}
            loading={uploading}
            actionText="Create Restaurant"
          ></Button>
          {data?.createRestaurant.error && (
            <FormError message={data.createRestaurant.error}></FormError>
          )}
        </form>
      </div>
    </div>
  );
};
