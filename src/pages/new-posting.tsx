// pages/new-posting.tsx
import React, { useState, FormEvent } from "react";
import { db } from "../firebase/initFirebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import type { NextPage } from "next";

// Predefined Options
const INTEREST_OPTIONS = [
  "teaching",
  "environment",
  "healthcare",
  "animalWelfare",
  "foodBank",
  "disaster",
  "arts",
  "senior",
  "youth",
  "tech"
];


const SKILL_OPTIONS = [
  "communication",
  "programming",
  "teaching",
  "languages",
  "healthcare",
  "marketing",
  "management",
  "art",
  "construction",
  "cooking"
];

const AVAILABILITY_OPTIONS = [
  "weekends",
  "evenings",
  "flexible",
  "fullTime",
  "remote",
  "occasional"
];

// Single-select location examples:
const LOCATION_OPTIONS = [
  "",
  "New York, NY",
  "San Francisco, CA",
  "Miami, FL",
  "Chicago, IL",
  "Houston, TX",
];

const NewPostingPage: NextPage = () => {
  const router = useRouter();

  // Basic posting fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [displayLocation, setDisplayLocation] = useState("");

  // Criteria (arrays or single string)
  const [requiredInterests, setRequiredInterests] = useState<string[]>([]);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [requiredAvailability, setRequiredAvailability] = useState<string[]>([]);
  const [requiredLocation, setRequiredLocation] = useState("");

  // Handle changes for multi-select
  const handleInterestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setRequiredInterests(selected);
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setRequiredSkills(selected);
  };

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setRequiredAvailability(selected);
  };

  // Single-select for location
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRequiredLocation(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "postings"), {
        title,
        description,
        date,
        location: displayLocation, // just a display field

        // The new criteria fields:
        requiredInterests,
        requiredSkills,
        requiredAvailability,
        requiredLocation,

        createdAt: serverTimestamp(),
      });

      router.push("/postings");
    } catch (error) {
      console.error("Error creating new posting:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Create a New Posting</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block mb-1">Title:</label>
          <input
            className="border border-gray-300 p-2 w-full"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1">Description:</label>
          <textarea
            className="border border-gray-300 p-2 w-full"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1">Date:</label>
          <input
            className="border border-gray-300 p-2 w-full"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Display location */}
        <div>
          <label className="block mb-1">General Display Location:</label>
          <input
            className="border border-gray-300 p-2 w-full"
            type="text"
            placeholder="e.g. New York, NY"
            value={displayLocation}
            onChange={(e) => setDisplayLocation(e.target.value)}
          />
        </div>

        <hr className="my-2" />
        <p className="text-sm text-gray-600">
          Specify requirements (choose from the dropdowns):
        </p>

        {/* Required Interests (multi) */}
        <div>
          <label className="block mb-1">Required Interests:</label>
          <select
            multiple
            className="border border-gray-300 p-2 w-full"
            value={requiredInterests}  // manage selection
            onChange={handleInterestsChange}
          >
            {INTEREST_OPTIONS.map((interest) => (
              <option key={interest} value={interest}>
                {interest}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            Use Ctrl/Cmd + click to select multiple
          </p>
        </div>

        {/* Required Skills (multi) */}
        <div>
          <label className="block mb-1">Required Skills:</label>
          <select
            multiple
            className="border border-gray-300 p-2 w-full"
            value={requiredSkills}
            onChange={handleSkillsChange}
          >
            {SKILL_OPTIONS.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            Use Ctrl/Cmd + click to select multiple
          </p>
        </div>

        {/* Required Availability (multi) */}
        <div>
          <label className="block mb-1">Required Availability:</label>
          <select
            multiple
            className="border border-gray-300 p-2 w-full"
            value={requiredAvailability}
            onChange={handleAvailabilityChange}
          >
            {AVAILABILITY_OPTIONS.map((avail) => (
              <option key={avail} value={avail}>
                {avail}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            Use Ctrl/Cmd + click to select multiple
          </p>
        </div>

        {/* Required Location (single) */}
        <div>
          <label className="block mb-1">Required Location:</label>
          <select
            className="border border-gray-300 p-2 w-full"
            value={requiredLocation}
            onChange={handleLocationChange}
          >
            {LOCATION_OPTIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc === "" ? "-- No Location Requirement --" : loc}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Posting
        </button>
      </form>
    </div>
  );
};

export default NewPostingPage;

