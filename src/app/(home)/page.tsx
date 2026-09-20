import Link from "next/link";
import React from "react";
import { Navbar } from "./navbar";

const Home = () => {
  return (
    <div className=" min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
        <Navbar />
      </div>
      <div className="mt-16">
        Click
        <Link href="/documents/ranawillrulethiscountry">
          &nbsp;
          <span className="text-blue-800 underline">here</span>
        </Link>
        &nbsp; to go to the document.
      </div>
    </div>
  );
};

export default Home;
