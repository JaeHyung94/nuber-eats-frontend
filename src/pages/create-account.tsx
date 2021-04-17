import { ApolloError, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import nuberLogo from "../images/logo.svg";
import { CreateAccountInput, UserRole } from "../__api__/globalTypes";
import {
  createAccountMutation,
  createAccountMutationVariables,
} from "../__api__/createAccountMutation";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

export const CreateAccount = () => {
  const {
    register,
    getValues,
    formState,
    handleSubmit,
  } = useForm<CreateAccountInput>({
    mode: "onChange",
    defaultValues: {
      role: UserRole.Client,
    },
  });
  const history = useHistory();
  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok, error },
    } = data;

    if (ok) {
      alert("계정이 생성되었습니다! 로그인 해주세요!");
      history.push("/login");
    } else {
      console.log(error);
    }
  };
  const onError = (error: ApolloError) => {};

  const [
    createAccountMutation,
    { loading, data: createAccountMutationResults },
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
      onError,
    }
  );

  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: {
            email,
            password,
            role,
          },
        },
      });
    }
  };

  return (
    <div className="h-full flex flex-col items-center mt-8 md:mt-24">
      <Helmet>
        <title>Create Account | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm px-4 md:px-11 flex flex-col items-center">
        <img src={nuberLogo} alt="" className="w-48 mb-12"></img>
        <h4 className="w-full text-3xl mb-4">시작하기</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-5"
        >
          <h5 className="w-full">
            이메일 주소와 비밀번호, 계정타입을 입력하세요.(필수)
          </h5>
          <input
            {...register("email", {
              required: "Email is Required",
              pattern: {
                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "이메일 형식으로 입력해야 합니다.",
              },
            })}
            name="email"
            type="email"
            placeholder="Email"
            // required
            className="input"
          ></input>
          {formState.errors.email?.message && (
            <FormError message={formState.errors.email.message}></FormError>
          )}
          <input
            {...register("password", {
              required: "Password is Required",
              minLength: 2,
            })}
            name="password"
            type="password"
            placeholder="Password"
            // required
            className="input"
          ></input>
          {formState.errors.password?.type === "minLength" && (
            <FormError
              message={"Password must be more than 2 characters"}
            ></FormError>
          )}
          {formState.errors.password?.message && (
            <FormError message={formState.errors.password.message}></FormError>
          )}
          <select
            {...register("role", { required: "User Role is Required" })}
            name="role"
            className="input"
          >
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText={"Create Account"}
          ></Button>
          {createAccountMutationResults?.createAccount.error && (
            <FormError
              message={createAccountMutationResults.createAccount.error}
            ></FormError>
          )}
        </form>
        <div className="font-medium">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="text-lime-600 hover:underline">
            로그인 하기
          </Link>
        </div>
      </div>
    </div>
  );
};
