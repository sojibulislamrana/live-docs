"use client";

import Link from "next/link";
import React from "react";
import { Navbar } from "./navbar";
import { TemplateGallery } from "./template-gallary";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { DocumentsTable } from "./documents-table";
import { useSearchParams } from "@/hooks/use-seach-params";

const Home = () => {
  const [search] = useSearchParams("");
  const { results, status, loadMore } = usePaginatedQuery(
    api.document.get,
    { search },
    { initialNumItems: 5 },
  );

  return (
    <div className=" min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
        <Navbar />
      </div>
      <div className="mt-16">
        <TemplateGallery />
        <DocumentsTable
          documents={results}
          loadMore={loadMore}
          status={status}
        />
      </div>
    </div>
  );
};

export default Home;
