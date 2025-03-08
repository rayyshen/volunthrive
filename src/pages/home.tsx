// pages/postings.tsx (modified to filter by user’s address)
import React, { useEffect, useState } from "react";
import { db } from "../firebase/initFirebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { UserProfile } from "../types/user";
import { Posting } from "../types/posting";

export default function PostingsPage() {
  const { currentUser } = useAuth();
  const [postings, setPostings] = useState<Posting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilteredPostings = async () => {
      setLoading(true);
      try {
        let userAddress = "";
        if (currentUser) {
          // Fetch the user’s profile doc
          const userDocSnap = await getDoc(doc(db, "users", currentUser.uid));
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data() as UserProfile;
            userAddress = userData.address || "";
          }
        }

        // If user has an address, we filter. Otherwise, we just fetch all.
        let q;
        if (userAddress) {
          q = query(collection(db, "postings"), where("location", "==", userAddress));
        } else {
          q = collection(db, "postings");
        }

        const snapshot = await getDocs(q);
        const results: Posting[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title,
            description: data.description,
            date: data.date,
            location: data.location,
            createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : undefined
          };
        });

        setPostings(results);
      } catch (error) {
        console.error("Error fetching postings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredPostings();
  }, [currentUser]);

  if (loading) {
    return <p>Loading postings...</p>;
  }

  if (postings.length === 0) {
    return <p>No postings found (for your location).</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Postings Near You</h1>
      {postings.map((p) => (
        <div key={p.id} className="border border-gray-300 p-4 mb-4 rounded">
          <h2 className="text-xl font-semibold">{p.title}</h2>
          <p className="text-gray-600">Date: {p.date}</p>
          <p className="text-gray-600">Location: {p.location}</p>
          <p className="mt-2">{p.description}</p>
        </div>
      ))}
    </div>
  );
}