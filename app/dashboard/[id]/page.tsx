"use client";

import Navbar from "@/components/Navbar";
import TodoForm from "@/components/TodoForm";
import Todolist from "@/components/Todolist";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserTodoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/auth/register/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        console.log("Fetched all users:", data);

        // // Find the specific user by email (id)
        // const foundUser = data.users?.find((u: any) => u.email === userId);
        setUser(data.user || null);
        // console.log("User data for:", userId, foundUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
          <div className="text-xl text-blue-100">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-black">
        <h1 className="text-2xl font-bold mb-4 text-blue-100">
          User not found
        </h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 shadow-lg transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      <div className="flex justify-between items-center bg-gradient-to-r from-black via-blue-950 to-black text-white p-6 shadow-xl border-b border-blue-800">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            {user.firstName} {user.lastName}'s Todos
          </h1>
          <p className="text-blue-300 text-sm mt-1">{user.email}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="border-2 border-blue-500 rounded-lg px-5 py-2.5 hover:bg-blue-900/50 transition-all text-blue-200 hover:text-blue-100 font-medium flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </button>
          <button
            className="border-2 border-red-500 rounded-lg px-5 py-2.5 hover:bg-red-900/50 transition-all text-red-200 hover:text-red-100 font-medium"
            onClick={async () => {
              await fetch("/api/auth/signout", { method: "POST" });
              router.push("/sign-in");
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto w-full">
        {/* User Info Card */}
        <div className="mb-6 p-6 bg-gradient-to-br from-blue-900/50 via-indigo-900/50 to-purple-900/50 backdrop-blur-sm rounded-xl border border-blue-700/50 shadow-xl">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user.firstName.charAt(0).toUpperCase()}
              {user.lastName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-100">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-blue-300">Email: {user.email}</p>
            </div>
          </div>
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-200 border border-blue-500/30">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Role: {user.role}
          </div>
        </div>

        {/* Todo Section */}
        <div className="space-y-6">
          {/* Add Todo Form */}
          <div className="bg-gradient-to-br from-blue-900/30 via-indigo-900/30 to-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-blue-700/30 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <svg
                className="w-7 h-7 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="text-2xl font-bold text-blue-100">Manage Todos</h3>
            </div>
            <TodoForm
              id={id}
              // onTodoCreated={() => setRefreshTrigger((prev) => prev + 1)}
            />
          </div>
          {/* Todo List */}
          {/* <div> */}
          {/* <h3 className="text-2xl font-bold mb-4">Todo List</h3> */}
          {/* <Todolist refreshTrigger={refreshTrigger} id={id} /> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
