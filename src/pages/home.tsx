import Link from "next/link";

export default function Home() {
  return (
    <div className="p-4">
      <h1>Welcome to the Volunteer Platform</h1>
      <div className="mt-4">
        <Link href="/postings">
          <a className="text-blue-600 underline">View All Postings</a>
        </Link>
      </div>
      <div className="mt-2">
        <Link href="/new-posting">
          <a className="text-blue-600 underline">Create a New Posting</a>
        </Link>
      </div>
    </div>
  );
}