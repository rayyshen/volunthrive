export interface Posting {
    id?: string;          // Firestore document ID (optional in interface)
    title: string;
    description: string;
    date: string;         // e.g. "2025-03-01" (or a more precise ISO string)
    location?: string;
    createdAt?: string;   // e.g. "2025-03-01T12:00:00.000Z"
  }