export interface UserProfile {
  name: string;
  age?: number;
  email: string;
  skills?: string[];
  interests?: string[];
  preferredCauses?: string[];
  availability?: string;
  address?: string;           // new field for storing address
  createdAt?: string;
  updatedAt?: string;
  events?: string[];
}

export interface NonprofitProfile {
  name: string;
  email: string;
  organizationName: string;
  description?: string;
  website?: string;
  address?: string;
  phoneNumber?: string;
  causes?: string[];
  createdAt?: string;
  updatedAt?: string;
  events?: string[];
  verified?: boolean;
}