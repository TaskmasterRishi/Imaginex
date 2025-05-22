import React from "react";
import Image from "next/image";
import Logo from "@/components/Logo";
import AuthForm from "@/components/authentication/AuthForm";
const AuthenticationPage = () => {
  return (
    <main className="h-screen grid grid-cols-2 relative">
      <div className="relative h-full w-full bg-muted flex flex-col items-center justify-between text-center text-foreground">
        <Image
          src="/abstract1.png"
          alt="Login Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/0 to-black/50" />
        <div className="relative z-10 w-full max-w-md flex flex-col items-center p-10 m-10 bg-black/10 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-sm border border-gray-600 gap-4">
          <Logo />
          <h1 className="text-2xl font-bold text-gray-300">
            Welcome to Imaginex
          </h1>
        </div>

        <div className="relative z-20 w-full max-w-2xl p-10 mb-10 bg-black/10 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-sm border border-gray-600">
          <blockquote className="space-y-2 text-center">
            <p className="text-lg text-gray-300">
              &ldquo;Imaginex has completely transformed my creative workflow. I
              can generate stunning, professional-grade images in minutes,
              saving me both time and money. It's like having a full design
              studio at my fingertips.&rdquo;
            </p>
            <footer className="text-sm text-gray-400">- John Doe</footer>
          </blockquote>
        </div>
      </div>

      {/* login form */}
      <div className="relative h-full flex flex-col items-center justify-center p-8 w-full">
        <div className="max-w-xl w-[350px] mx-auto">
          <AuthForm />
        </div>
      </div>
    </main>
  );
};

export default AuthenticationPage;
