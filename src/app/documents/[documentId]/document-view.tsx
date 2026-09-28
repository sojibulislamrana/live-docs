"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { LockIcon } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { FullScreenLoader } from "@/components/fullscreen-loader";
import { Button } from "@/components/ui/button";
import { Navbar } from "./navbar";
import { Toolbar } from "./toolbar";
import { Room } from "./room";
import { Editor } from "./editor";

interface DocumentViewProps {
  documentId: string;
}

const NoAccess = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-white">
      <div className="size-20 rounded-full bg-destructive/10 flex items-center justify-center">
        <LockIcon className="size-9 text-destructive" />
      </div>
      <h1 className="text-xl font-semibold">No access to this document</h1>
      <p className="text-muted-foreground text-sm max-w-md text-center">
        This document is private or only shared with members of its
        organization. Ask the owner to share it with your organization so you
        can collaborate in realtime.
      </p>
      <Button onClick={() => router.push("/")}>Back to all documents</Button>
    </div>
  );
};

export const DocumentView = ({ documentId }: DocumentViewProps) => {
  const document = useQuery(api.document.getById, {
    id: documentId as Id<"document">,
  });

  if (document === undefined) {
    return <FullScreenLoader label="Loading document..." />;
  }

  if (document === null) {
    return <NoAccess />;
  }

  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      <Room>
        <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden">
          <Navbar title={document.title} documentId={document._id} />
          <Toolbar />
        </div>
        <div className="pt-[114px] print:pt-0">
          <Editor initialContent={document.initialContent} />
        </div>
      </Room>
    </div>
  );
};
