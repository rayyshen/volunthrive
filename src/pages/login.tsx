// pages/login.tsx
import React, { useState } from "react";
import type { FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/initFirebase";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in:", userCredential.user.uid);

      // Redirect after login
      router.push("/home");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <header className="bg-teal-900 text-white w-full h-16">
        <div className="w-11/12 max-w-6xl mx-auto h-full flex items-center">
          <Link href="/" className="flex items-center text-white">
            <Image 
              src="/logo2.png" // Path is relative to the public folder
              alt="VolunThrive Logo"
              width={60} 
              height={60}
              className="mr-2"
            />
            <span className="text-xl font-bold">VolunThrive</span>
          </Link>
        </div>
      </header>

      {/* Login Form Container */}
      <div className="flex-1 flex justify-center items-center p-6 bg-gray-50">
        <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
          <h1 className="text-center text-2xl text-gray-800 font-semibold mb-6">Volunteer Login</h1>

          {/* Login Options */}
          <div className="flex justify-center mb-6 pb-4 border-b border-gray-100">
            <div className="font-semibold text-gray-800 px-4 py-2 relative">
              I'm a Volunteer
              <div className="absolute bottom-[-16px] left-0 w-full h-0.5 bg-green-500"></div>
            </div>
          </div>

          {/* Google Sign-in Option */}
          <div className="mb-6">
            <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md bg-white text-gray-700">
              <div className="mr-2 w-5 h-5 flex items-center justify-center rounded-full">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              Continue with Google
            </button>
          </div>

          <div className="relative text-center my-6">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200"></div>
            <span className="relative bg-white px-2 text-sm text-gray-500">OR</span>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full p-3 border border-gray-300 rounded-md text-base"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-md text-base"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md text-base transition-colors"
            >
              Volunteer Login
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              New to VolunThrive?{" "}
              <Link href="/signup" className="text-green-600 font-semibold">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;