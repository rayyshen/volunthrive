// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/initFirebase";
import { doc, setDoc } from "firebase/firestore";

interface AuthContextValue {
  currentUser: User | null;
  loading: boolean;
}

// We'll store user (if logged in) or null if not
const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Subscribe to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the context
export function useAuth() {
  return useContext(AuthContext);
}

const createInitialUserProfile = async (user: any, age: number) => {
  const initialProfile = {
    uid: user.uid,
    name: user.displayName || '',
    email: user.email || '',
    age: age,
    interests: [],
    skills: [],
    createdAt: new Date().toISOString(),
  };
  
  await setDoc(doc(db, "users", user.uid), initialProfile);
  return initialProfile;
};