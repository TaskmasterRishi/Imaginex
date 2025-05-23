"use client";
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import { Button } from "../ui/button";
import SignUpForm from "./SignUpForm";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ResetPassword from "./ResetPassword";
const AuthForm = () => {
  const [mode, setMode] = useState("login");

  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={`header-${mode}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
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
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {mode === "login" && (
            <>
              <LoginForm />
              <div className="flex flex-col md:flex-row items-center justify-between">
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
          {mode === "signup" && (
            <>
              <SignUpForm />
              <div className="flex flex-col items-center justify-center">
                <Button
                  variant="link"
                  className="p-0 hover:cursor-pointer"
                  onClick={() => setMode("login")}
                >
                  Already have an account? Login
                </Button>
                <p className="text-muted-foreground text-center text-sm">
                  By signing up, you agree to our <Link href="#" className="hover:text-primary underline underline-offset-4">Terms of Service</Link> and <Link href="#" className="hover:text-primary underline underline-offset-4">Privacy Policy</Link>.
                </p>
              </div>
            </>
          )}
          {mode === "reset" && <>
            <ResetPassword />
            <div className="flex flex-col items-center justify-center">
                <Button
                  variant="link"
                  className="p-0 hover:cursor-pointer"
                  onClick={() => setMode("login")}
                >
                  Back to Login
                </Button>
              </div>
            </>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthForm;
