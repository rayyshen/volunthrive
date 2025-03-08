// components/LoginButton.tsx
import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/initFirebase";
import { useRouter } from "next/router";

interface LoginButtonProps {
  email: string;
  password: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  email,
  password,
  onSuccess,
  onError,
}) => {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect or default action
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      onError?.(error);
    }
  };

  return <button onClick={handleLogin}>Log In</button>;
};

export default LoginButton;