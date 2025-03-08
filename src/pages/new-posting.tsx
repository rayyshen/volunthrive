import React, { useState, FormEvent } from "react";
import { db } from "../firebase/initFirebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import type { NextPage } from "next";

const NewPostingPage: NextPage = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "postings"), {
        title,
        description,
        date,
        location,
        // Or store a Firestore server timestamp here
        createdAt: serverTimestamp(),
      });

      // Optionally redirect user to /postings or show a success message
      router.push("/postings");
    } catch (error) {
      console.error("Error creating new posting:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Create a New Posting</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Title:
          <input
            className="border border-gray-300 p-2 w-full"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label className="block mb-2">
          Description:
          <textarea
            className="border border-gray-300 p-2 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label className="block mb-2">
          Date:
          <input
            className="border border-gray-300 p-2 w-full"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <label className="block mb-2">
          Location:
          <input
            className="border border-gray-300 p-2 w-full"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
        >
          Create Posting
        </button>
      </form>
    </div>
  );
};

export default NewPostingPage;