// pages/dashboard.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { db } from "../firebase/initFirebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { UserProfile } from "../types/user";
import { Posting } from "../types/posting";
import { calculateMatchScore } from "../helpers/matchScore";
import TruncatedText from "../lib/components/TruncatedText";
import DateConvert from "../lib/components/dateConvert";
import SignOutButton from "../lib/components/SignOutButton";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [postings, setPostings] = useState<Posting[]>([]);
  const [selectedPosting, setSelectedPosting] = useState<Posting | null>(null);
  const [loading, setLoading] = useState(true);
  const [filteredPostings, setFilteredPostings] = useState<Posting[]>([]);
  const [visiblePostings, setVisiblePostings] = useState(5);

  const handleShowMore = () => {
    setVisiblePostings((prev) => prev + 5);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // 1. Fetch user's profile if logged in
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
            organization: data.organization || "Local Nonprofit",
            commitment: data.commitment || "Flexible hours",
            benefits: data.benefits || "Community service hours",
            requirements: data.requirements || "No special requirements",
            impact: data.impact || "Help your local community",
            contactPerson: data.contactPerson || "Volunteer Coordinator",
            contactEmail: data.contactEmail || "volunteer@example.org",
            logo: data.logo || "/api/placeholder/50/50",
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

        // 4. Store sorted postings
        setPostings(postingsWithScores);
        setFilteredPostings(postingsWithScores); // Initialize filtered postings

        // Set the first posting as selected
        if (postingsWithScores.length > 0) {
          setSelectedPosting(postingsWithScores[0]);
        }
      } catch (error) {
        console.error("Error fetching or sorting postings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    const filtered = postings.filter(posting =>
      posting.title.toLowerCase().includes(query) ||
      posting.description.toLowerCase().includes(query) ||
      (posting.location ?? "").toLowerCase().includes(query)
    );
    setFilteredPostings(filtered);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-teal-900 text-white">
        {/* Top Navigation */}
        <div className="w-11/12 max-w-6xl mx-auto py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-white mr-8">
                <Image
                  src="/logo2.png"
                  alt="VolunThrive Logo"
                  width={60}
                  height={60}
                  className="mr-2"
                />
                <span className="text-xl font-bold">VolunThrive</span>
              </Link>

              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search opportunities and locations"
                    className="w-64 lg:w-80 py-2 px-4 pr-10 rounded-l-md text-gray-800 focus:outline-none border-2 border-white bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-r-md border-2 border-white"
                >
                  Search
                </button>
              </form>
            </div>

            <div className="flex items-center space-x-6">
              <Link href="/" className="text-white"><SignOutButton/></Link>
              <Link href="/profile" className="text-white">
                Profile
              </Link>
              <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                <span className="text-sm font-medium">
                  {currentUser ? currentUser.email?.charAt(0).toUpperCase() || 'U' : 'G'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search - visible only on small screens */}
      <div className="md:hidden bg-white py-3 px-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            placeholder="Search opportunities"
            className="flex-1 py-2 px-3 border-2 border-gray-300 rounded-l-md focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-r-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 py-6">
        <div className="w-11/12 max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              {/* Section Title */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Volunteer Opportunities</h2>
                <p className="text-gray-600">Explore opportunities matching your skills and interests</p>
              </div>

              {filteredPostings.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-600 mb-2">No volunteer opportunities found.</p>
                  <p className="text-sm text-gray-500">Check back later or adjust your search criteria.</p>
                </div>
              ) : (
                /* Responsive Split View: Opportunities List and Detail View */
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Column - Opportunities List */}
                  <div className="w-full lg:w-1/2 lg:overflow-y-auto lg:max-h-[calc(100vh-220px)]">
                    {/* Mobile View: Selected opportunity details (shown only when screen is small) */}
                    <div className="lg:hidden mb-6">
                      {selectedPosting && (
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 mr-3 flex-shrink-0">
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {selectedPosting.title}
                              </h3>
                            </div>
                          </div>
                          <button
                            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                            className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors text-sm"
                          >
                            View Details
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Opportunities List */}
                    {filteredPostings.slice(0, visiblePostings).map((posting) => (
                      <div
                        key={posting.id}
                        className={`bg-white mb-4 rounded-lg shadow-sm border-2 p-4 cursor-pointer transition-colors ${selectedPosting?.id === posting.id
                          ? 'border-green-500'
                          : 'border-gray-200 hover:border-green-300'
                          }`}
                        onClick={() => setSelectedPosting(posting)}
                      >
                        <div className="flex">

                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {posting.title}
                            </h3>
                            <p className="text-gray-600 text-sm"><DateConvert text={posting.date} /></p>
                            <p className="text-gray-600 text-sm">{posting.location}</p>
                            <p className="text-sm"><TruncatedText text={posting.description} maxLength={200} /></p>

                            {/* <div className="mt-2 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm text-gray-600">{posting.commitment}</span>
                            </div> */}

                            {/* {posting.score !== undefined && (
                              <div className="mt-2 flex items-center">
                                <div className={`h-2 rounded-full w-28 bg-gray-200 mr-2 overflow-hidden`}>
                                  <div 
                                    className="h-full bg-green-500" 
                                    style={{ width: `${Math.min(100, Math.max(0, posting.score * 100))}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-600">{Math.round(posting.score * 100)}% match</span>
                              </div>
                            )} */}
                          </div>

                          <button className="text-gray-400 hover:text-gray-600 ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Show more button */}
                    <div className="text-center mt-6 mb-8 lg:mb-0">
                      {visiblePostings < filteredPostings.length && (
                        <button
                          onClick={handleShowMore}
                          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
                        >
                          Show More Opportunities
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Opportunity Details */}
                  <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                    {selectedPosting && (
                      <>
                        <div className="flex items-start mb-6">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                              {selectedPosting.title}
                            </h2>
                            <p className="text-gray-600">
                              {selectedPosting.location}
                            </p>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="mb-6">
                          <div className="flex flex-wrap mb-4">
                            <div className="w-full sm:w-1/2 flex items-center mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <p className="text-sm text-gray-500">Start Date</p>
                                <p className="font-medium"><DateConvert text={selectedPosting.date} /></p>
                              </div>
                            </div>

                            <div className="w-full sm:w-1/2 flex items-center mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              <div>
                                <p className="text-sm text-gray-500">Commitment</p>
                                <p className="font-medium">{selectedPosting.requiredAvailability}</p>
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p className="text-gray-700">{selectedPosting.description}</p>
                          </div>

                          <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Location</h3>
                            <p className="text-gray-700">{selectedPosting.location}</p>
                            <div className="mt-4">
                              <iframe
                                width="100%"
                                height="300"
                                frameBorder="0"
                                style={{ border: 0 }}
                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAB1oLQM2gXw198eNUjlLWvKfLCSczDBAk&q=${encodeURIComponent(selectedPosting.location || '')}`}
                                allowFullScreen
                              ></iframe>
                            </div>
                          </div>


                          {/* <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                            <p className="text-gray-700">{selectedPosting.requirements}</p>
                          </div> */}

                          {/* <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Impact</h3>
                            <p className="text-gray-700">{selectedPosting.impact}</p>
                          </div> */}

                          {/* <div className="mb-6 p-4 bg-gray-50 rounded-md">
                            <h3 className="text-lg font-semibold mb-2">Contact</h3>
                            <p className="text-gray-700 mb-1">{selectedPosting.contactPerson}</p>
                            <p className="text-gray-700">{selectedPosting.contactEmail}</p>
                          </div> */}
                        </div>

                        {/* Action buttons */}
                        <div className="flex space-x-4">
                          <Link target="_blank" href="https://www.signupgenius.com/" className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors">
                            <button className="justify-center w-full">
                              RSVP
                            </button>
                          </Link>
                          <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6">
        <div className="w-11/12 max-w-6xl mx-auto">
          <div className="text-center text-gray-600 text-sm">
            <p>© 2025 VolunThrive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;