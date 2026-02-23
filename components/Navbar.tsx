import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <>
      <div className="bg-linear-to-br from-blue-50 to-indigo-100 bg-black text-black">
        <div className="flex items-center justify-between">
          {/* <h1>Hello world</h1>; */}
          <div className="flex-1"></div>
          <div className="flex items-center justify-center flex-1">
            <button className="m-2">
              <Link href="/dashboard">dashboard</Link>
            </button>
            <button className="m-2">
              <Link href="/videoMaking">video</Link>
            </button>
          </div>
          <div className="flex items-center justify-end flex-1">
            <button className="border-2 border-gray-300 rounded-lg px-4 py-2 m-2">
              <Link href="/sign-in">Sign In</Link>
            </button>
            <button>
              <Link
                href="/sign-up"
                className="border-2 border-gray-300 rounded-lg px-4 py-2 m-2"
              >
                Sign Up
              </Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
