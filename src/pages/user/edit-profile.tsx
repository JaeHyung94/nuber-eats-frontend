import { useApolloClient, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { useMe } from "../../hooks/useMe";
import { editProfile, editProfileVariables } from "../../__api__/editProfile";
import { EditProfileInput } from "../../__api__/globalTypes";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($editProfileInput: EditProfileInput!) {
    editProfile(input: $editProfileInput) {
      ok
      error
    }
  }
`;

export const EditProfile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const history = useHistory();

  const {
    register,
    handleSubmit,
    getValues,
    formState,
  } = useForm<EditProfileInput>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
    },
  });

  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables: {
        editProfileInput: {
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };

  const onCompleted = (data: editProfile) => {
    const {
      editProfile: { ok },
    } = data;

    if (ok && userData) {
      const {
        me: { email: oldEmail, id },
      } = userData;
      const { email: newEmail } = getValues();

      if (oldEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditUser on User {
              email
              verified
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }
    }

    history.push("/");
  };

  const [editProfile, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });

  return (
    <div className="max-w-screen-sm mx-auto mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title>Edit Profile | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        className="grid gap-3 mt-5 w-full mb-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h5 className="w-full">이메일 또는 비밀번호를 변경하세요.</h5>
        <input
          {...register("email", {
            pattern: {
              value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "이메일 형식으로 입력해야 합니다.",
            },
          })}
          name="email"
          type="email"
          placeholder="Email"
          className="input"
        ></input>
        {formState.errors.email?.message && (
          <FormError message={formState.errors.email.message}></FormError>
        )}
        <input
          {...register("password", {
            minLength: 2,
          })}
          name="password"
          type="password"
          placeholder="Password"
          className="input"
        ></input>
        {formState.errors.password?.message && (
          <FormError
            message={"Password must be more than 2 characters"}
          ></FormError>
        )}
        <Button
          canClick={formState.isValid}
          loading={loading}
          actionText={"Update Profile"}
        ></Button>
      </form>
    </div>
  );
};
