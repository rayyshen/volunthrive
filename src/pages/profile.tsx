import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/initFirebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { UserProfile } from "../types/user";
import Link from "next/link";
import Image from "next/image";

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interests: "",
    skills: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const userDocSnap = await getDoc(doc(db, "users", currentUser.uid));
          if (userDocSnap.exists()) {
            const profileData = userDocSnap.data() as UserProfile;
            setUserProfile(profileData);
            // Initialize form data with existing values
            setFormData({
              name: profileData.name || "",
              email: profileData.email || "",
              interests: Array.isArray(profileData.interests) ? profileData.interests.join(", ") : "",
              skills: Array.isArray(profileData.skills) ? profileData.skills.join(", ") : "",
            });
          } else {
            // Create initial profile if it doesn't exist
            const initialProfile = {
              uid: currentUser.uid,
              name: currentUser.displayName || '',
              email: currentUser.email || '',
              interests: [],
              skills: [],
              createdAt: new Date().toISOString(),
            };
            await setDoc(doc(db, "users", currentUser.uid), initialProfile);
            setUserProfile(initialProfile);
            setFormData({
              name: initialProfile.name,
              email: initialProfile.email,
              interests: "",
              skills: "",
            });
          }
        } catch (error) {
          console.error("Error fetching/creating user profile:", error);
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    if (currentUser && userProfile) {
      const updatedProfile = {
        ...userProfile,
        name: formData.name,
        email: formData.email,
        interests: formData.interests.split(",").map((interest) => interest.trim()),
        skills: formData.skills.split(",").map((skill) => skill.trim()),
      };

      try {
        await updateDoc(doc(db, "users", currentUser.uid), updatedProfile);
        setUserProfile(updatedProfile);
        setEditing(false);
      } catch (error) {
        console.error("Error updating user profile:", error);
      }
    }
  };

  const handleEdit = () => {
    if (userProfile) {
      // Update form data with current profile values when starting to edit
      setFormData({
        name: userProfile.name || "",
        email: userProfile.email || "",
        interests: Array.isArray(userProfile.interests) ? userProfile.interests.join(", ") : "",
        skills: Array.isArray(userProfile.skills) ? userProfile.skills.join(", ") : "",
      });
    }
    setEditing(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-teal-900 text-white">
        <div className="w-11/12 max-w-6xl mx-auto py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/home" className="flex items-center text-white mr-8">
                <Image
                  src="/logo2.png"
                  alt="VolunThrive Logo"
                  width={60}
                  height={60}
                  className="mr-2"
                />
                <span className="text-xl font-bold">VolunThrive</span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                <span className="text-sm font-medium">
                  {currentUser ? currentUser.email?.charAt(0).toUpperCase() || 'U' : 'G'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 py-6">
        <div className="w-11/12 max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/home" className="text-gray-600 hover:text-gray-900 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          </div>

          {userProfile ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {editing ? (
                <div className="p-6">
                  <div className="grid gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Interests (comma-separated)</label>
                      <textarea
                        name="interests"
                        value={formData.interests}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows={3}
                        placeholder="e.g., Environmental Conservation, Youth Education, Animal Welfare"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
                      <textarea
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows={3}
                        placeholder="e.g., Teaching, Project Management, Web Development"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex space-x-4">
                    <button onClick={handleSave} className="flex-1 py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors">
                      Save Changes
                    </button>
                    <button onClick={() => setEditing(false)} className="py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Name</h3>
                      <p className="mt-1 text-gray-900">{userProfile.name || "Not set"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1 text-gray-900">{userProfile.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Interests</h3>
                      <p className="mt-1 text-gray-900">{userProfile.interests?.join(", ") || "No interests listed"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Skills</h3>
                      <p className="mt-1 text-gray-900">{userProfile.skills?.join(", ") || "No skills listed"}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button onClick={() => setEditing(true)} className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors">
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <p className="text-gray-600">No profile data found.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="w-11/12 max-w-6xl mx-auto">
          <div className="text-center text-gray-600 text-sm">
            <p>© 2025 VolunThrive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
