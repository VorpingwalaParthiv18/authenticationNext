"use client";

import TodoForm from "@/components/TodoForm";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

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
        <TodoForm />
      </div>
    </div>
  );
}
