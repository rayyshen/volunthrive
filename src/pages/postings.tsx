// pages/postings.tsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/initFirebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { UserProfile } from "../types/user";
import { Posting } from "../types/posting";
import { calculateMatchScore } from "../helpers/matchScore";

export default function PostingsPage() {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [postings, setPostings] = useState<Posting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // 1. Fetch user’s profile if logged in
        let profile: UserProfile | null = null;
        if (currentUser) {
          const userDocSnap = await getDoc(doc(db, "users", currentUser.uid));
          if (userDocSnap.exists()) {
            profile = userDocSnap.data() as UserProfile;
          }
        }
        setUserProfile(profile);

        // 2. Fetch all postings
        const snapshot = await getDocs(collection(db, "postings"));
        const rawPostings: Posting[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title,
            description: data.description,
            date: data.date,
            location: data.location,
            requiredInterests: data.requiredInterests || [],
            requiredSkills: data.requiredSkills || [],
            requiredAvailability: data.requiredAvailability || [],
            requiredLocation: data.requiredLocation || "",
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate().toISOString()
              : undefined,
          };
        });

        // 3. Calculate match scores and sort descending
        const postingsWithScores = await Promise.all(rawPostings.map(async (posting) => {
          const score = await calculateMatchScore(posting, profile);
          return { ...posting, score };
        }));

        postingsWithScores.sort((a, b) => b.score - a.score);
        console.log(postingsWithScores);

        // 4. Store sorted postings
        setPostings(postingsWithScores);
      } catch (error) {
        console.error("Error fetching or sorting postings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  if (loading) {
    return <p className="p-4">Loading postings...</p>;
  }

  if (postings.length === 0) {
    return <p className="p-4">No postings found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Volunteer Opportunities</h1>
      {postings.map((p) => (
        <div
          key={p.id}
          className="border border-gray-300 p-4 mb-4 rounded"
        >
          <h2 className="text-xl font-semibold">{p.title}</h2>
          <p className="text-gray-600">Date: {p.date}</p>
          {p.location && <p className="text-gray-600">Location: {p.location}</p>}
          <p className="mt-2">{p.description}</p>
        </div>
      ))}
    </div>
  );
}