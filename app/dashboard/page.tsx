"use client";

import TodoForm from "@/components/TodoForm";
import Todo from "@/model/Todo.model";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  interface userList {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    roleLevel: number;
  }
  const router = useRouter();
  const [data, setData] = useState<userList[]>([]);
  const [currentUser, setCurrentUser] = useState<userList | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/register", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const userData = await response.json();
        console.log("Current user data:", userData);
        setCurrentUser(userData.currentUser);
        setData(userData.users || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleClick = (email: string) => {
    setSelectedUserId(email);
    router.push(`/dashboard/${email}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16  from-black via-blue-950 to-black">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              {currentUser && (
                <p className="text-sm text-gray-600">
                  Welcome, {currentUser.firstName} {currentUser.lastName}
                </p>
              )}
            </div>
            <button
              className="border-2 border-red-500 rounded-lg px-5 py-2.5 hover:bg-red-900/50 transition-all text-black hover:text-red-100 font-medium"
              onClick={async () => {
                await fetch("/api/auth/signout", { method: "POST" });
                router.push("/sign-in");
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentUser?.roleLevel == 3 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
                <p className="text-gray-600 mt-1">
                  {data.length} {data.length === 1 ? "user" : "users"}{" "}
                  registered
                </p>
              </div>
            </div>

            {/* User Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((user) => (
                <div
                  key={user.email}
                  onClick={() => handleClick(user.email)}
                  className={`group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${
                    selectedUserId === user.email
                      ? "ring-2 ring-blue-500 shadow-xl scale-[1.02]"
                      : "hover:scale-[1.02]"
                  }`}
                >
                  {/* Card Header with Gradient */}
                  <div className="h-24 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 relative">
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                  </div>

                  {/* Avatar */}
                  <div className="px-6 pb-6">
                    <div className="relative -mt-12 mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white">
                        {user.firstName.charAt(0).toUpperCase()}
                        {user.lastName.charAt(0).toUpperCase()}
                      </div>
                      {selectedUserId === user.email && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-800 truncate">
                        {user.firstName} {user.lastName}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          {user.role}
                        </span>
                      </div>
                    </div>

                    {/* View Details Link */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 flex items-center">
                        View Todos
                        <svg
                          className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Todo Form Section */}
        {selectedUserId && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Manage Todos
            </h2>
            <TodoForm id={selectedUserId} />
          </div>
        )}

        {!selectedUserId && currentUser?.roleLevel !== 3 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <TodoForm id="" />
          </div>
        )}
      </main>
    </div>
  );
}
