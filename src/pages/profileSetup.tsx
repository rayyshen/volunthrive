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
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [address, setAddress] = useState("");  // NEW state for address

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
          if (data.address) setAddress(data.address);
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
        address,  // store address
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", currentUser.uid), userProfile, { merge: true });
      console.log("Profile updated");
      router.push("/home");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label>Name:</label>
          <input 
            type="text"
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Age:</label>
          <input
            type="number"
            className="border p-2 w-full"
            value={age || ""}
            onChange={(e) => setAge(Number(e.target.value))}
          />
        </div>

        <div>
          <label>Skills (comma-separated):</label>
          <input 
            type="text"
            className="border p-2 w-full"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>

        <div>
          <label>Interests (comma-separated):</label>
          <input 
            type="text"
            className="border p-2 w-full"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>

        <div>
          <label>Address / Location:</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;