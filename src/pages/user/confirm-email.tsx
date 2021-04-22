import { useApolloClient, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory } from "react-router";
import { useMe } from "../../hooks/useMe";
import { verifyEmail, verifyEmailVariables } from "../../__api__/verifyEmail";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($verifyEmailInput: VerifyEmailInput!) {
    verifyEmail(input: $verifyEmailInput) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const client = useApolloClient();
  const { data: userData } = useMe();
  const history = useHistory();

  const onCompleted = (data: verifyEmail) => {
    const {
      verifyEmail: { ok },
    } = data;

    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
      history.push("/");
    } else {
      history.replace("/");
    }
  };

  const onError = () => {
    return history.replace("/");
  };

  const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(
    VERIFY_EMAIL_MUTATION,
    {
      onCompleted,
      onError,
    }
  );

  useEffect(() => {
    const code = window.location.href.split("code=")[1];
    if (!code || code === "") {
      return history.replace("/");
    }
    verifyEmail({
      variables: {
        verifyEmailInput: {
          code,
        },
      },
    });
  });

  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title>Confirm Email | Nuber Eats</title>
      </Helmet>
      <h2 className="text-lg mb-2 font-medium">Confirming Email</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait, Don't close this page
      </h4>
    </div>
  );
};
