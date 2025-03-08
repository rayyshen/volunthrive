import React, { useEffect, useState } from "react";
import { db } from "../firebase/initFirebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { NextPage } from "next";
import { Posting } from "../types/posting";

const PostingsPage: NextPage = () => {
  const [postings, setPostings] = useState<Posting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostings = async () => {
      try {
        // Optionally, order by creation date if you want newest first or oldest first
        const q = query(collection(db, "postings"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const fetchedPostings: Posting[] = [];
        snapshot.forEach((doc) => {
          // doc.data() is the stored object
          const data = doc.data();
          fetchedPostings.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            date: data.date,
            location: data.location,
            // If you used serverTimestamp, we can store it as a string or null if not set
            createdAt: data.createdAt?.toDate 
              ? data.createdAt.toDate().toISOString() 
              : undefined,
          });
        });

        setPostings(fetchedPostings);
      } catch (error) {
        console.error("Error fetching postings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostings();
  }, []);

  if (loading) {
    return <p className="p-4">Loading postings...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Postings</h1>
      {postings.length === 0 ? (
        <p>No postings found.</p>
      ) : (
        postings.map((posting) => (
          <div
            key={posting.id}
            className="border border-gray-300 p-4 mb-4 rounded"
          >
            <h2 className="text-xl font-semibold">{posting.title}</h2>
            <p className="text-sm text-gray-600">Date: {posting.date}</p>
            {posting.location && (
              <p className="text-sm text-gray-600">
                Location: {posting.location}
              </p>
            )}
            <p className="mt-2">{posting.description}</p>
            {posting.createdAt && (
              <p className="text-xs text-gray-500 mt-2">
                Posted on {new Date(posting.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PostingsPage;