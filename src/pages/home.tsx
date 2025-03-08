import Link from "next/link";

export default function Home() {
  return (
    <div className="p-4">
      <h1>Welcome to the Volunteer Platform</h1>
      <div className="mt-4">
        <Link href="/postings" className="text-blue-600 underline">
          View All Postings
        </Link>
      </div>
      <div className="mt-2">
        <Link href="/new-posting" className="text-blue-600 underline">
          Create a New Posting
        </Link>
      </div>
    </div>
  );
}