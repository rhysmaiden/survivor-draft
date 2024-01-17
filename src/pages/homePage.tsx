import Link from "next/link";
import { Input } from "@/components/ui/input";
import RecentDraftsNav from "@/app/components/RecentDraftsNav";

export default function HomePage() {
  return (
    <div className="h-full flex">
      <div className="w-64 border-r border-gray-200 overflow-auto bg-gray-600 h-full">
        <RecentDraftsNav />
      </div>
      <div className="flex-1 p-4 flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold text-white">Draft Game</h1>
        <p className="mt-2 text-center  text-white max-w-md">
          Welcome to Draft Game! A fun and interactive game where you can create
          your own game or join an existing one. Let&apos;s get started!
        </p>
        <div className="mt-10">
          <Link
            className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-indigo-600 hover:bg-indigo-500 focus:shadow-outline focus:outline-none"
            href="/create-draft"
          >
            Create New Game
          </Link>
        </div>
        <div className="mt-6 flex items-center justify-center space-x-2">
          <Input
            className="w-64 px-4 py-2 text-base font-medium text-white placeholder-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:focus:border-indigo-700 dark:focus:ring-indigo-700"
            placeholder="Enter Game Code"
            type="text"
          />
          <Link
            className="inline-flex items-center justify-center h-10 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-indigo-600 hover:bg-indigo-500 focus:shadow-outline focus:outline-none"
            href="#"
          >
            Join
          </Link>
        </div>
      </div>
    </div>
  );
}
