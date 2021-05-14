import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import { Button } from "../../components/button";
import { createDish, createDishVariables } from "../../__api__/createDish";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
}
interface IForm {
  name: string;
  price: string;
  description: string;
  [key: string]: string;
}

export const CreateDish = () => {
  const { id } = useParams<IParams>();
  const history = useHistory();

  const [createDishMutation, { loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +id,
          },
        },
      },
    ],
  });

  const {
    register,
    getValues,
    formState,
    handleSubmit,
    setValue,
  } = useForm<IForm>({
    mode: "onChange",
  });

  const onSubmit = async () => {
    const { name, price, coverImage, description, ...rest } = getValues();
    const optionObject = optionNumber.map((theId) => ({
      name: rest[`${theId}-optionName`],
      extra: +rest[`${theId}-optionExtra`],
    }));

    createDishMutation({
      variables: {
        input: {
          name,
          description,
          price: +price,
          restaurantId: +id,
          options: optionObject,
        },
      },
    });
    history.goBack();
  };
  const [optionNumber, setOptionNumber] = useState<number[]>([]);
  //eslint-disable-next-line
  const [choiceNumber, setChoiceNumber] = useState<number[]>([]);
  const onAddOptionsClick = () => {
    setOptionNumber((current) => [Date.now(), ...current]);
  };
  const onDeleteOptionClick = (idToDel: number) => {
    setOptionNumber((current) => current.filter((id) => id !== idToDel));
    setValue(`${idToDel}-optionName`, "");
    setValue(`${idToDel}-optionExtra`, "");
  };

  return (
    <div className="h-full flex flex-col items-center justify-center mt-8">
      <Helmet>
        <title>Create Dish | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm px-4 md:px-11 flex flex-col items-center justify-center">
        <h2 className="font-semibold text-2xl mb-3">Create Dish</h2>
        <form
          className="grid gap-3 mt-5 w-full mb-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            {...register("name", {
              required: "Dish Name is Required",
            })}
            name="name"
            placeholder="Dish Name"
            type="text"
            className="input"
          ></input>
          <input
            {...register("description", {
              required: "Dish Description is Required",
            })}
            name="description"
            placeholder="Dish Description"
            type="text"
            className="input"
          ></input>
          <input
            {...register("price", {
              required: "Price is Required",
            })}
            name="price"
            min={0}
            placeholder="Price"
            type="number"
            className="input"
          ></input>
          <div className="my-5">
            <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
            <span
              onClick={onAddOptionsClick}
              className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5"
            >
              Add Dish Options
            </span>
          </div>
          {optionNumber.length !== 0 &&
            optionNumber.map((id) => (
              <div key={id} className="mb-3">
                <div className="flex justify-between items-center">
                  <input
                    {...register(`${id}-optionName`)}
                    name={`${id}-optionName`}
                    className="px-4 py-2 focus:outline-none focus:border-gray-600 border border-gray-200 mr-3"
                    type="text"
                    placeholder="Option Name"
                  />
                  <input
                    {...register(`${id}-optionExtra`)}
                    name={`${id}-optionExtra`}
                    className="px-4 py-2 focus:outline-none focus:border-gray-600 border border-gray-200"
                    type="number"
                    min={0}
                    placeholder="Option Extra Charge"
                  />
                  <div
                    className="cursor-pointer text-white bg-red-400 ml-3 py-2 px-2 border border-red-400"
                    onClick={() => onDeleteOptionClick(id)}
                  >
                    Delete Option
                  </div>
                </div>
                {/* <div className="mt-5 ml-3">
                  <span
                    onClick={onAddChoicesClick}
                    className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5"
                  >
                    Add Choices
                  </span>
                  {choiceNumber.length !== 0 &&
                    choiceNumber.map((choiceId) => (
                      <div key={choiceId}>
                        <div className="flex justify-between items-center mt-3">
                          <input
                            {...register(`${id}-${choiceId}-choiceName`)}
                            name={`${id}-${choiceId}-choiceName`}
                            type="text"
                            className="px-4 py-2 mr-2 focus:outline-none focus:border-gray-600 border border-gray-200"
                            placeholder="Choice Name"
                          />
                          <input
                            {...register(`${id}-${choiceId}-choiceExtra`)}
                            name={`${id}-${choiceId}-choiceExtra`}
                            type="number"
                            min={0}
                            className="px-4 py-2 mr-2 focus:outline-none focus:border-gray-600 border border-gray-200"
                            placeholder="Choice Extra Charge"
                          />
                          <div
                            onClick={() => onDeleteChoicesClick(choiceId)}
                            className="cursor-pointer text-white bg-red-400 py-2 px-2 border border-red-400"
                          >
                            Delete Choice
                          </div>
                        </div>
                      </div>
                    ))}
                </div> */}
              </div>
            ))}
          <Button
            loading={loading}
            canClick={formState.isValid}
            actionText={"Create Dish"}
          ></Button>
        </form>
      </div>
    </div>
  );
};
