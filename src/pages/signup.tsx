// pages/signup.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/initFirebase";

// Step components
const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) => {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="relative">
        <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200">
          <div style={{ width: `${(currentStep / totalSteps) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
        </div>
        <div className="text-right text-sm text-gray-500">Step {currentStep} of {totalSteps}</div>
      </div>
    </div>
  );
};

interface QuestionOption {
  value: string;
  label: string;
}

interface Question {
  id: string;
  question: string;
  type: "single" | "multiple" | "slider" | "text";
  options?: QuestionOption[];
  min?: number;
  max?: number;
}

const SignupPage: React.FC = () => {
  const router = useRouter();
  const totalSteps = 6; // 5 question steps + 1 account creation step
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form state
  const [formData, setFormData] = useState({
    // Preference questions
    interests: [] as string[],
    skills: [] as string[],
    causes: [] as string[],
    availability: "",
    locationPreference: "",
    
    // Personal info
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  // Error state
  const [error, setError] = useState("");
  
  // Questions for the quiz
  const questions: Question[] = [
    {
      id: "interests",
      question: "What kinds of volunteering activities interest you?",
      type: "multiple",
      options: [
        { value: "teaching", label: "Teaching & Education" },
        { value: "environment", label: "Environmental Conservation" },
        { value: "healthcare", label: "Healthcare & Wellness" },
        { value: "animalWelfare", label: "Animal Welfare" },
        { value: "foodBank", label: "Food Bank & Hunger Relief" },
        { value: "disaster", label: "Disaster Relief" },
        { value: "arts", label: "Arts & Culture" },
        { value: "senior", label: "Senior Care" },
        { value: "youth", label: "Youth Mentoring" },
        { value: "tech", label: "Technology Support" },
      ]
    },
    {
      id: "skills",
      question: "What skills can you offer?",
      type: "multiple",
      options: [
        { value: "communication", label: "Communication" },
        { value: "programming", label: "Programming/IT" },
        { value: "teaching", label: "Teaching" },
        { value: "languages", label: "Languages" },
        { value: "healthcare", label: "Healthcare" },
        { value: "marketing", label: "Marketing/PR" },
        { value: "management", label: "Project Management" },
        { value: "art", label: "Art/Design" },
        { value: "construction", label: "Construction/Handiwork" },
        { value: "cooking", label: "Cooking" },
      ]
    },
    {
      id: "causes",
      question: "What causes are you passionate about?",
      type: "multiple",
      options: [
        { value: "education", label: "Education" },
        { value: "environment", label: "Environment" },
        { value: "health", label: "Health" },
        { value: "poverty", label: "Poverty Alleviation" },
        { value: "homelessness", label: "Homelessness" },
        { value: "humanRights", label: "Human Rights" },
        { value: "animalRights", label: "Animal Rights" },
        { value: "socialJustice", label: "Social Justice" },
        { value: "disaster", label: "Disaster Relief" },
        { value: "community", label: "Community Development" },
      ]
    },
    {
      id: "availability",
      question: "What is your availability for volunteering?",
      type: "single",
      options: [
        { value: "weekends", label: "Weekends only" },
        { value: "evenings", label: "Weekday evenings" },
        { value: "flexible", label: "Flexible schedule" },
        { value: "fullTime", label: "Full-time/Gap year" },
        { value: "remote", label: "Remote only" },
        { value: "occasional", label: "Occasional/One-time events" },
      ]
    },
    {
      id: "locationPreference",
      question: "What is your preferred location type for volunteering?",
      type: "single",
      options: [
        { value: "local", label: "Local (in my city/neighborhood)" },
        { value: "remote", label: "Remote/Virtual only" },
        { value: "travel", label: "Willing to travel" },
        { value: "international", label: "International opportunities" },
        { value: "any", label: "Any location" },
      ]
    },
  ];
  
  const handleMultipleChoice = (questionId: string, value: string) => {
    const currentValues = formData[questionId as keyof typeof formData] as string[];
    
    if (Array.isArray(currentValues)) {
      if (currentValues.includes(value)) {
        // Remove if already selected
        setFormData({
          ...formData,
          [questionId]: currentValues.filter(item => item !== value)
        });
      } else {
        // Add if not already selected
        setFormData({
          ...formData,
          [questionId]: [...currentValues, value]
        });
      }
    }
  };
  
  const handleSingleChoice = (questionId: string, value: string) => {
    setFormData({
      ...formData,
      [questionId]: value
    });
  };
  
  const handleTextInput = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleNext = () => {
    const currentQuestion = questions[currentStep - 1];
    
    // Validate current step
    if (currentStep <= questions.length) {
      const questionId = currentQuestion.id;
      const answer = formData[questionId as keyof typeof formData];
      
      if (currentQuestion.type === "multiple" && Array.isArray(answer) && answer.length === 0) {
        setError("Please select at least one option");
        return;
      }
      
      if (currentQuestion.type === "single" && !answer) {
        setError("Please select an option");
        return;
      }
    }
    
    // Clear any errors
    setError("");
    
    // Move to next step
    setCurrentStep(currentStep + 1);
  };
  
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setError("");
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate final form
    if (!formData.firstName.trim()) return setError("First name is required");
    if (!formData.lastName.trim()) return setError("Last name is required");
    if (!formData.email.trim()) return setError("Email is required");
    if (!formData.password) return setError("Password is required");
    if (formData.password.length < 6) return setError("Password must be at least 6 characters");
    if (formData.password !== formData.confirmPassword) return setError("Passwords don't match");
    
    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Store user preferences in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        interests: formData.interests,
        skills: formData.skills,
        causes: formData.causes,
        availability: formData.availability,
        locationPreference: formData.locationPreference,
        createdAt: new Date().toISOString(),
      });
      
      // Redirect to dashboard
      router.push("/dashboard");
      
    } catch (error: any) {
      setError(error.message);
    }
  };
  
  // Current question based on step
  const currentQuestion = currentStep <= questions.length ? questions[currentStep - 1] : null;
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <header className="bg-teal-900 text-white w-full h-16">
  <div className="w-11/12 max-w-6xl mx-auto h-full flex items-center">
    <Link href="/" className="flex items-center text-white">
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
</header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 py-8">
        <div className="w-11/12 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            {currentStep <= questions.length ? (
              <>
                <h1 className="text-2xl font-semibold text-center mb-6">Find Your Perfect Volunteer Match</h1>
                <p className="text-gray-600 text-center mb-8">
                  Answer a few questions to help us match you with volunteer opportunities that fit your interests and skills.
                </p>
                
                <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
                
                {/* Question */}
                <div className="mb-8">
                  <h2 className="text-xl font-medium mb-4">{currentQuestion?.question}</h2>
                  
                  {/* Multiple choice questions */}
                  {currentQuestion?.type === "multiple" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentQuestion.options?.map(option => (
                        <div 
                          key={option.value}
                          className={`border rounded-md p-3 cursor-pointer transition-colors ${
                            (formData[currentQuestion.id as keyof typeof formData] as string[])?.includes(option.value)
                              ? "border-green-500 bg-green-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          onClick={() => handleMultipleChoice(currentQuestion.id, option.value)}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                              (formData[currentQuestion.id as keyof typeof formData] as string[])?.includes(option.value)
                                ? "border-green-500 bg-green-500"
                                : "border-gray-400"
                            }`}>
                              {(formData[currentQuestion.id as keyof typeof formData] as string[])?.includes(option.value) && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span>{option.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Single choice questions */}
                  {currentQuestion?.type === "single" && (
                    <div className="grid grid-cols-1 gap-3">
                      {currentQuestion.options?.map(option => (
                        <div 
                          key={option.value}
                          className={`border rounded-md p-3 cursor-pointer transition-colors ${
                            formData[currentQuestion.id as keyof typeof formData] === option.value
                              ? "border-green-500 bg-green-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          onClick={() => handleSingleChoice(currentQuestion.id, option.value)}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                              formData[currentQuestion.id as keyof typeof formData] === option.value
                                ? "border-green-500 bg-green-500"
                                : "border-gray-400"
                            }`}>
                              {formData[currentQuestion.id as keyof typeof formData] === option.value && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <span>{option.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Error message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                    {error}
                  </div>
                )}
                
                {/* Navigation buttons */}
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className={`px-4 py-2 border border-gray-300 rounded-md ${
                      currentStep === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                    }`}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              // Final step - Account creation
              <>
                <h1 className="text-2xl font-semibold text-center mb-6">Create Your Account</h1>
                <p className="text-gray-600 text-center mb-8">
                  You're almost there! Complete your profile to get matched with volunteer opportunities.
                </p>
                
                <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleTextInput("firstName", e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleTextInput("lastName", e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleTextInput("email", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleTextInput("password", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      required
                      minLength={6}
                    />
                    <p className="text-sm text-gray-500 mt-1">Must be at least 6 characters</p>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleTextInput("confirmPassword", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  {/* Error message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
                
                <div className="mt-6 text-center text-sm text-gray-600">
                  <p>
                    Already have an account?{" "}
                    <Link href="/login" className="text-green-600 font-semibold">
                      Log in
                    </Link>
                  </p>
                </div>
              </>
            )}
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

export default SignupPage;