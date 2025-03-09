export interface Posting {
    id?: string;
    title: string;
    description: string;
    date: string;          // e.g. "2025-03-01"
    location?: string;     // general location for display
    requiredInterests?: string[];
    requiredSkills?: string[];
    requiredAvailability?: string;
    requiredLocation?: string;  // e.g. "New York, NY"
    createdAt?: string;
    attendees?: string[];
  }