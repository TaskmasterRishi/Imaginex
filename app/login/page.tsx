import React from "react";
import Image from "next/image";
import Logo  from "@/components/Logo";
import AuthForm from "@/components/authentication/AuthForm";
const AuthenticationPage = () => {
  return (
    <main className="h-screen grid grid-cols-1 lg:grid-cols-2 relative">
      {/* Left part - hidden on mobile */}
      <div className="hidden lg:block relative h-full w-full bg-muted bg-cover bg-center text-center text-foreground">
        <Image
          src="/abstract1.png"
          alt="Login Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/0 to-black/50" />
        <div className="absolute top-0 w-full flex justify-center pt-4 lg:pt-10">
          <div className="relative z-10 w-full max-w-md flex flex-col items-center p-4 lg:p-10 m-4 lg:m-10 bg-black/10 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-sm border border-gray-600 gap-2 lg:gap-4">
            <Logo variant="light" />
            <h1 className="text-xl lg:text-2xl font-bold text-gray-300">
              Welcome to Imaginex
            </h1>
          </div>
        </div>

        <div className="absolute bottom-0 w-full flex justify-center pb-4 lg:pb-10">
          <div className="relative z-20 w-full max-w-2xl p-4 lg:p-10 bg-black/10 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-sm border border-gray-600">
            <blockquote className="space-y-2 text-center">
              <p className="text-sm lg:text-lg text-gray-300">
                &ldquo;Imaginex has completely transformed my creative workflow. I
                can generate stunning, professional-grade images in minutes,
                saving me both time and money. It&apos;s like having a full design
                studio at my fingertips.&rdquo;
              </p>
              <footer className="text-xs lg:text-sm text-gray-400">- John Doe</footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right part - login form */}
      <div className="relative h-full flex flex-col items-center justify-center p-4 lg:p-8 w-full">
        {/* Show logo on top in mobile view */}
        <div className="lg:hidden mb-8">
          <Logo variant="dark" />
        </div>
        <div className="max-w-xl w-full lg:w-[350px] mx-auto">
          <AuthForm />
        </div>
      </div>
    </main>
  );
};

export default AuthenticationPage;
