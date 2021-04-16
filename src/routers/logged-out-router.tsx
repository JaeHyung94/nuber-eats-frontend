import React from "react";
import { useForm } from "react-hook-form";

interface Iform {
  email: string;
  password: string;
}

export const LoggedOutRouter = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Iform>();
  const onSubmit = () => {
    console.log(watch("email"));
  };
  const onInvalid = () => {
    console.log("Cannot Create Account");
  };

  return (
    <div>
      <h1>Logged Out</h1>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          <input
            {...register("email", {
              required: "Email is Required",
              validate: (email: string) => email.includes("@gmail.com"),
            })}
            name="email"
            type="email"
            // required
            placeholder="email"
          ></input>
          {errors.email?.message && (
            <span className="font-bold text-red-600">
              {errors.email?.message}
            </span>
          )}
          {errors.email?.type === "validate" && (
            <span className="font-bold text-red-600">
              Only Gmail is Available
            </span>
          )}
        </div>
        <div>
          <input
            {...register("password", {
              required: "Password is Required",
            })}
            name="password"
            type="password"
            required
            placeholder="password"
          ></input>
        </div>
        <button className="bg-indigo-500 text-white">Submit</button>
      </form>
    </div>
  );
};
