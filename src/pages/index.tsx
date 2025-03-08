// pages/index.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const HomePage: React.FC = () => {
  const router = useRouter();

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <header className="bg-teal-900 text-white w-full h-16">
        <div className="w-11/12 max-w-6xl mx-auto h-full flex items-center justify-between">
          <Link href="/" className="flex items-center text-white">
            <span className="text-xl font-bold">VolunThrive</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/login" className="px-4 py-1 border border-white rounded-md text-sm font-medium hover:bg-white hover:text-teal-900 transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="px-4 py-1 bg-white text-teal-900 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="w-full max-w-6xl mx-auto px-4 lg:px-0 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left Column - Text Content */}
            <div className="w-full md:w-1/2 pr-0 md:pr-8 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                Experience a 
                <span className="block">fresh way to</span>
                <span className="text-green-600">volunteer</span>
              </h1>
              
              <p className="text-gray-600 mb-6">
                Find meaningful opportunities with personalized insights,
                custom search filters, hour tracking, and impact 
                monitoring—all for free.
              </p>
              
              <div className="mb-8">
                <button 
                  onClick={() => router.push('/signup')}
                  className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors"
                >
                  Sign up for VolunThrive
                </button>
              </div>
              
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Find opportunities that match your skills</p>
                </div>
                
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Track your volunteer hours automatically</p>
                </div>
                
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Connect with nonprofits making real impact</p>
                </div>
              </div>
            </div>
            
            {/* Right Column - Image */}
            <div className="w-full md:w-1/2">
              <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 w-full rounded-lg overflow-hidden">
                <Image 
                  src="/api/placeholder/600/600" 
                  alt="Volunteer using VolunThrive app" 
                  fill
                  className="object-cover"
                  priority
                />
              </div>
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

export default HomePage;