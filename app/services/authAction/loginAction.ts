"use client";

import { signIn } from "next-auth/react";

import { LoginFormInputs } from "@/app/utils/validate/auth-validate";

export const login = async (data: LoginFormInputs) => {
  const { username, password, is_remembered } = data;
  try {
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
      is_remembered: String(is_remembered),
    });

    if (result?.error) {
      return { success: false, message: result.error };
    }

    if (result?.ok) {
      console.log(result, "this is result form login action");
      return { success: true, message: "Login successful" };
    }

    return { success: false, message: "An unexpected error occurred" };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
};
