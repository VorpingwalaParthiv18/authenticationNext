import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar.tsx";
// import Navbar from "@/components/navbar";

export default function Home() {
  // const istoken = localStorage.getItem("token");

  // if (istoken) {
  //   window.location.href = "/dashboard";
  // } else {
  //   window.location.href = "/sign-in";
  // }
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 items-center p-6 gap-8">
        <div className="relative w-1/2 h-96 ml-4">
          <Image
            src="/todolist.jpg"
            alt="Logo"
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="w-1/2 pr-6">
          <h2 className="text-3xl font-bold mb-4">Welcome to Our Platform</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Organize your tasks efficiently with our intuitive todo list
            application. Stay productive, track your progress, and achieve your
            goals with ease.
          </p>
        </div>
      </div>
    </div>
  );
}
