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
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center  bg-linear-to-br from-blue-50 to-indigo-100 bg-black text-black">
        {/* <h1>Hello world</h1>; */}
        <button
          className="border-2 border-gray-300 rounded-lg px-4 py-2 m-2"
          onClick={async () => {
            await fetch("/api/auth/signout", { method: "POST" });
            router.push("/sign-in");
          }}
        >
          Sign Out
        </button>
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard</h1>

        {currentUser?.roleLevel == 3 &&
          data.map((user) => {
            return (
              <div
                key={user.email}
                onClick={(e) => handleClick(user.email)}
                className={`p-4 rounded-lg mb-2 cursor-pointer transition-colors ${
                  selectedUserId === user.email
                    ? "bg-blue-200 border-2 border-blue-500"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <h2 className="text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">Role: {user.role}</p>
              </div>
            );
          })}
        {selectedUserId && <TodoForm id={selectedUserId} />}
        {!selectedUserId && <TodoForm id="" />}
      </div>
    </div>
  );
}
