import { ApolloError, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import nuberLogo from "../images/logo.svg";
import {
  LoginMutation,
  LoginMutationVariables,
} from "../__api__/LoginMutation";

const LOGIN_MUTATION = gql`
  mutation LoginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error
      token
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const { register, getValues, formState, handleSubmit } = useForm<ILoginForm>({
    mode: "onChange",
  });

  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, error, token },
    } = data;
    if (ok) {
      console.log(token);
    } else {
      console.log(error);
    }
  };
  const onError = (error: ApolloError) => {};

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
    onError,
  });

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };

  return (
    <div className="h-full flex flex-col items-center mt-8 md:mt-24">
      <div className="w-full max-w-screen-sm px-4 flex flex-col items-center">
        <img src={nuberLogo} alt="" className="w-48 mb-10"></img>
        <h4 className="w-full text-2xl mb-4">돌아오신 것을 환영합니다</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-5"
        >
          <h5 className="w-full">이메일 주소로 로그인 하세요.</h5>
          <input
            {...register("email", {
              required: "Email is Required",
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
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText={"Log In"}
          ></Button>
          {loginMutationResult?.login.error && (
            <FormError message={loginMutationResult.login.error} />
          )}
        </form>
        <div className="font-medium">
          Uber는 처음이신가요?{" "}
          <Link to="/create-account" className="text-lime-600 hover:underline">
            계정 만들기
          </Link>
        </div>
      </div>
    </div>
  );
};
