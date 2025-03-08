// components/SignupButton.tsx
import React from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/initFirebase";
import { useRouter } from "next/router";

interface SignupButtonProps {
  email: string;
  password: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const SignupButton: React.FC<SignupButtonProps> = ({
  email,
  password,
  onSuccess,
  onError,
}) => {
  const router = useRouter();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect or default action
        router.push("/profileSetup");
      }
    } catch (error: any) {
      console.error("Signup failed:", error);
      onError?.(error);
    }
  };

  return <button onClick={handleSignup}>Sign Up</button>;
};

export default SignupButton;