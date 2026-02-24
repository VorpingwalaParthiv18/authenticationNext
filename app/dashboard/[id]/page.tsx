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
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex justify-between items-center bg-black text-white p-4">
        <h1 className="text-xl font-bold">
          {user.firstName} {user.lastName}'s Todos
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/dashboard")}
            className="border-2 border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-800 transition"
          >
            ← Back to Dashboard
          </button>
          <button
            className="border-2 border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-800 transition"
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
      <div className="p-6">
        {/* User Info Card */}
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-600">Email: {user.email}</p>
          <p className="text-gray-600">Role: {user.role}</p>
        </div>

        {/* Todo Section */}
        <div className="space-y-6">
          {/* Add Todo Form */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Add New Todo</h3>
            <TodoForm
              id={id}
              // onTodoCreated={() => setRefreshTrigger((prev) => prev + 1)}
            />
          </div>
          {/* Todo List */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Todo List</h3>
            {/* <Todolist refreshTrigger={refreshTrigger} id={id} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
