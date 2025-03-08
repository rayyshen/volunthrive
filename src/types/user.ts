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
}