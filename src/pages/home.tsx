// pages/dashboard.tsx
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

// Mock data for volunteer opportunities
const volunteerOpportunities = [
  {
    id: 1,
    title: "Youth Mentor Program",
    organization: "Community Youth Network",
    location: "Washington, DC",
    commitment: "4-6 hrs / week",
    benefits: "Training, professional references",
    description: "Mentor at-risk youth in academic and social settings. Help students develop self-confidence, communication skills, and academic achievement. Mentors meet with assigned students weekly to provide guidance and support.",
    requirements: "Background check required. Previous experience with children preferred but not required. Must commit to at least 3 months.",
    impact: "Your mentorship can improve high school graduation rates and reduce risk behaviors in vulnerable youth populations.",
    contactPerson: "Maria Rodriguez",
    contactEmail: "mrodriguez@cyn.org",
    logo: "/api/placeholder/50/50"
  },
  {
    id: 2,
    title: "Environmental Conservation Assistant",
    organization: "EcoAction Alliance",
    location: "Frederick, MD",
    commitment: "8 hrs / week",
    benefits: "Service credits, community awards",
    description: "Join our conservation team working to restore local watersheds and natural habitats. Activities include planting native species, removing invasive plants, water quality monitoring, and trail maintenance.",
    requirements: "Must be comfortable working outdoors in various weather conditions. No experience necessary - training provided.",
    impact: "Help restore 50+ acres of natural habitat and improve water quality in the Potomac River watershed.",
    contactPerson: "David Chen",
    contactEmail: "dchen@ecoaction.org",
    logo: "/api/placeholder/50/50"
  },
  {
    id: 3,
    title: "Elderly Care Companion",
    organization: "Senior Wellness Foundation",
    location: "Manassas, VA",
    commitment: "3-5 hrs / week",
    benefits: "Healthcare experience, certification",
    description: "Provide companionship and social interaction to seniors. Activities include conversation, reading, playing games, and accompanying seniors on walks or to appointments. Help reduce isolation and improve quality of life.",
    requirements: "Compassionate individuals with good listening skills. Basic health and safety training provided.",
    impact: "Reduce isolation for seniors and help them maintain independence longer.",
    contactPerson: "Sarah Johnson",
    contactEmail: "sjohnson@seniorwellness.org",
    logo: "/api/placeholder/50/50"
  },
  {
    id: 4,
    title: "Food Bank Assistant",
    organization: "Hunger Relief Network",
    location: "Rockville, MD",
    commitment: "Flexible hours",
    benefits: "Community service hours",
    description: "Sort and package food donations, assist with distribution to clients, and help maintain inventory. Occasional opportunities to assist with food drives and community outreach events.",
    requirements: "Ability to stand for extended periods and lift up to 25 pounds. Food handler's certification a plus but not required.",
    impact: "Help provide food security to over 5,000 families in the community each month.",
    contactPerson: "James Williams",
    contactEmail: "jwilliams@hungerrelief.org",
    logo: "/api/placeholder/50/50"
  },
  {
    id: 5,
    title: "Web Developer - Nonprofit Site",
    organization: "TechCause",
    location: "Remote",
    commitment: "5-10 hrs / week",
    benefits: "Portfolio building, tech networking",
    description: "Help design and develop websites for small nonprofits that cannot afford professional web services. Projects typically last 4-8 weeks and may include creating new sites or improving existing ones.",
    requirements: "Experience with HTML, CSS, and JavaScript. Familiarity with WordPress or other CMS platforms helpful.",
    impact: "Increase online visibility and fundraising capabilities for small but impactful nonprofit organizations.",
    contactPerson: "Alex Rivera",
    contactEmail: "arivera@techcause.org",
    logo: "/api/placeholder/50/50"
  },
  {
    id: 6,
    title: "Literacy Tutor",
    organization: "Education for All",
    location: "Sterling, VA",
    commitment: "2-3 hrs / week",
    benefits: "Teaching experience, references",
    description: "Provide one-on-one or small group tutoring to adult learners working to improve their reading, writing, and language skills. Materials and training provided by our literacy specialists.",
    requirements: "Bachelor's degree preferred. Must be patient and comfortable working with diverse populations.",
    impact: "Help adults gain the literacy skills needed for employment advancement and increased self-sufficiency.",
    contactPerson: "Michelle Park",
    contactEmail: "mpark@educationforall.org",
    logo: "/api/placeholder/50/50"
  }
];

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] = useState(volunteerOpportunities[0]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
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
        {/* PNG Logo using Next.js Image component */}
        <Image 
          src="/logo2.png" // Path is relative to the public folder
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
      <Link href="/dashboard" className="text-white font-medium">
        Home
      </Link>
      <Link href="/messages" className="text-white">
        Messages
      </Link>
      <Link href="/profile" className="text-white">
        Profile
      </Link>
      <button className="text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </button>
      <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center">
        <span className="text-sm font-medium">JD</span>
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
          {/* Section Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Volunteer Opportunities</h2>
            <p className="text-gray-600">Explore opportunities matching your skills and interests</p>
          </div>
          
          {/* Responsive Split View: Opportunities List and Detail View */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Opportunities List */}
            <div className="w-full lg:w-1/2 lg:overflow-y-auto lg:max-h-[calc(100vh-220px)]">
              {/* Mobile View: Selected opportunity details (shown only when screen is small) */}
              <div className="lg:hidden mb-6">
                {selectedOpportunity && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 mr-3 flex-shrink-0">
                        <Image
                          src={selectedOpportunity.logo}
                          alt={selectedOpportunity.organization}
                          width={40}
                          height={40}
                          className="rounded"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedOpportunity.title}
                        </h3>
                        <p className="text-sm text-gray-700">{selectedOpportunity.organization}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})}
                      className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
              
              {/* Opportunities List */}
              {volunteerOpportunities.map((opportunity) => (
                <div 
                  key={opportunity.id} 
                  className={`bg-white mb-4 rounded-lg shadow-sm border-2 p-4 cursor-pointer transition-colors ${
                    selectedOpportunity.id === opportunity.id 
                      ? 'border-green-500' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => setSelectedOpportunity(opportunity)}
                >
                  <div className="flex">
                    <div className="w-12 h-12 mr-4 flex-shrink-0">
                      <Image
                        src={opportunity.logo}
                        alt={opportunity.organization}
                        width={50}
                        height={50}
                        className="rounded"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {opportunity.title}
                      </h3>
                      <p className="text-gray-700 mb-1">{opportunity.organization}</p>
                      <p className="text-gray-600 text-sm">{opportunity.location}</p>
                      
                      <div className="mt-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">{opportunity.commitment}</span>
                      </div>
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
                <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50">
                  Show More Opportunities
                </button>
              </div>
            </div>
            
            {/* Right Column - Opportunity Details */}
            <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              {selectedOpportunity && (
                <>
                  {/* Header with logo and organization */}
                  <div className="flex items-start mb-6">
                    <div className="w-16 h-16 mr-4">
                      <Image
                        src={selectedOpportunity.logo}
                        alt={selectedOpportunity.organization}
                        width={64}
                        height={64}
                        className="rounded"
                      />
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {selectedOpportunity.title}
                      </h2>
                      <p className="text-lg text-gray-700 mb-1">
                        {selectedOpportunity.organization}
                      </p>
                      <p className="text-gray-600">
                        {selectedOpportunity.location}
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
                          <p className="text-sm text-gray-500">Time Commitment</p>
                          <p className="font-medium">{selectedOpportunity.commitment}</p>
                        </div>
                      </div>
                      
                      <div className="w-full sm:w-1/2 flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500">Benefits</p>
                          <p className="font-medium">{selectedOpportunity.benefits}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-gray-700">{selectedOpportunity.description}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                      <p className="text-gray-700">{selectedOpportunity.requirements}</p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Impact</h3>
                      <p className="text-gray-700">{selectedOpportunity.impact}</p>
                    </div>
                    
                    <div className="mb-6 p-4 bg-gray-50 rounded-md">
                      <h3 className="text-lg font-semibold mb-2">Contact</h3>
                      <p className="text-gray-700 mb-1">{selectedOpportunity.contactPerson}</p>
                      <p className="text-gray-700">{selectedOpportunity.contactEmail}</p>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex space-x-4">
                    <button className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors">
                      Apply Now
                    </button>
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