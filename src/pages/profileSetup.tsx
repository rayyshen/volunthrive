// pages/profileSetup.tsx
import React, { useEffect, useState, FormEvent } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/initFirebase";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { UserProfile } from "../types/user";

const ProfileSetup: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState<number | undefined>(undefined);
  const [skills, setSkills] = useState<string>("");
  const [interests, setInterests] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          setName(data.name || "");
          setAge(data.age);
          if (data.skills) setSkills(data.skills.join(","));
          if (data.interests) setInterests(data.interests.join(","));
        }
      }
    };

    if (!loading) {
      if (!currentUser) {
        // Not logged in, redirect
        router.push("/login");
      } else {
        fetchUserData();
      }
    }
  }, [currentUser, loading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const userProfile: Partial<UserProfile> = {
        name,
        age,
        skills: skills.split(",").map((s) => s.trim()),
        interests: interests.split(",").map((i) => i.trim()),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(
        doc(db, "users", currentUser.uid),
        userProfile,
        { merge: true }
      );

      console.log("Profile updated");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Complete Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Age:</label>
        <input 
          type="number"
          value={age || ""}
          onChange={(e) => setAge(Number(e.target.value))}
        />

        <label>Skills (comma-separated):</label>
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <label>Interests (comma-separated):</label>
        <input
          type="text"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
        />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default ProfileSetup;