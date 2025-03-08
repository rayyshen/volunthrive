// types/user.ts
export interface UserProfile {
    name: string;
    age?: number;
    email: string;
    skills?: string[];
    interests?: string[];
    location?: string[];
    createdAt?: string;
    updatedAt?: string;
  }