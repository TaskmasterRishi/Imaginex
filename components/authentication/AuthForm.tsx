"use client";
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import { Button } from "../ui/button";
import SignUpForm from "./SignUpForm";
const AuthForm = () => {
  const [mode, setMode] = useState("login");

  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "reset"
            ? "Reset Password"
            : mode === "login"
            ? "Login"
            : "Sign Up"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "reset"
            ? "Enter your email below to reset your password"
            : mode === "login"
            ? "Enter your email below to login to your account"
            : "Create an account with your email and password"}
        </p>
      </div>
      {mode === "login" && (
        <>
          <LoginForm />
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="link"
              className="p-0 hover:cursor-pointer"
              onClick={() => setMode("signup")}
            >
              Need an account? Sign Up
            </Button>

            <Button
              variant="link"
              className="p-0 hover:cursor-pointer"
              onClick={() => setMode("reset")}
            >
              Forgot Password?
            </Button>
          </div>
        </>
      )}
      {mode === "signup" && <>
        <SignUpForm />
        <div className="flex items-center justify-between gap-2">
            <Button
              variant="link"
              className="p-0 hover:cursor-pointer"
              onClick={() => setMode("login")}
            >
              Already have an account? Login
            </Button>

            <Button
              variant="link"
              className="p-0 hover:cursor-pointer"
              onClick={() => setMode("reset")}
            >
              Forgot Password?
            </Button>
          </div>
      </>
      }
      {mode === "reset" && <span>Reset Password Form</span>}
    </div>
  );
};

export default AuthForm;
