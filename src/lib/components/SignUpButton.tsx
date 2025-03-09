// components/SignupButton.tsx
import React from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/initFirebase";
import { useRouter } from "next/router";

interface SignupButtonProps {
  email: string;
  password: string;
  onSuccess?: () => void;
}

const SignupButton: React.FC<SignupButtonProps> = ({
  email,
  password,
  onSuccess,
}) => {
  const router = useRouter();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect or default action
        router.push("/");
      }
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return <button onClick={handleSignup}>Sign Up</button>;
};

export default SignupButton;