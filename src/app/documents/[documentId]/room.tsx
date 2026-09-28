"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { FullScreenLoader } from "@/components/fullscreen-loader";
import { useToast } from "@/hooks/use-toast";

export function Room({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const params = useParams();

  return (
    <LiveblocksProvider
      authEndpoint={async ()=> {const endpoint = "/api/liveblocks-auth";
        const room = params.documentId as string;

        const response = await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify({room})
        })
        return await response.json();
      }}
      throttle={16}
      resolveUsers={async ({ userIds }) => {
        // Call our server-side route that resolves Clerk user info by id.
        // This fixes the personal-mode bug where getUsers() returned nothing
        // because there was no org_id to pass to getUserList.
        try {
          const res = await fetch("/api/liveblocks-users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userIds }),
          });
          if (!res.ok) return userIds.map(() => undefined);
          const users: { name: string; avatar: string }[] = await res.json();
          return users.map((u) => ({ name: u.name, avatar: u.avatar }));
        } catch {
          toast({
            variant: "destructive",
            title: "Could not resolve collaborators",
          });
          return userIds.map(() => undefined);
        }
      }}
      resolveMentionSuggestions={async ({ text }) => {
        // Fetch org members (or current user in personal mode) for @mentions.
        try {
          const res = await fetch("/api/liveblocks-mention-suggestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
          });
          if (!res.ok) return [];
          const suggestions: { id: string }[] = await res.json();
          return suggestions.map((s) => s.id);
        } catch {
          return [];
        }
      }}
      resolveRoomsInfo={() => []}
    >
      <RoomProvider id={params.documentId as string} initialPresence={{ cursor: null }}>
        <ClientSideSuspense
          fallback={<FullScreenLoader label="Room loading ..." />}
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
