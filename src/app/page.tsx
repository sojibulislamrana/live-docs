import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      Click
      <Link href="/documents/ranawillrulethiscountry">
        &nbsp;
        <span className="text-blue-800 underline">here</span>
      </Link>
      &nbsp; to go to the document.
    </div>
  );
};

export default Home;
