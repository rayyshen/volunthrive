import { signOut } from "firebase/auth";
import { auth } from "./firebase/initFirebase.ts";

function SignOutButton() {
  const handleSignOut = async () => {
    await signOut(auth);
    console.log("Signed out");
  };

  return (
    <button onClick={handleSignOut}>Sign Out</button>
  );
}

export default SignOutButton;