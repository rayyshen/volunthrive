import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/initFirebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { UserProfile } from "../types/user";

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
        let profile: UserProfile | null = null;
        console.log("Current user:", currentUser);
        try {
          const userDocSnap = await getDoc(doc(db, "users", currentUser.uid));
          if (userDocSnap.exists()) {
            const profileData = userDocSnap.data() as UserProfile;
            console.log("Fetched profile data:", profileData);
            if (profileData) {
              setUserProfile(profileData);
              setFormData({
                name: profileData.name || "",
                email: profileData.email || "",
                interests: profileData.interests?.join(", ") || "",
                skills: profileData.skills?.join(", ") || "",
              });
            } else {
              console.error("Profile data is not in the expected format");
            }
          } else {
            console.error("User document does not exist");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        console.error("No current user");
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {userProfile ? (
        <div className="bg-white p-4 rounded shadow-md">
          {editing ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Interests</label>
                <textarea
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Skills</label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
                Save
              </button>
              <button onClick={() => setEditing(false)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {userProfile.name}</p>
              <p><strong>Email:</strong> {userProfile.email}</p>
              <p><strong>Interests:</strong> {userProfile.interests ? userProfile.interests.join(", ") : "No interests listed"}</p>
              <p><strong>Skills:</strong> {userProfile.skills ? userProfile.skills.join(", ") : "No skills listed"}</p>
              <button onClick={() => setEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
                Edit
              </button>
            </>
          )}
        </div>
      ) : (
        <p>No profile data found.</p>
      )}
    </div>
  );
};

export default Profile;
