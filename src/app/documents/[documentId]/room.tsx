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
      authEndpoint={async () => {
        const room = params.documentId as string;
        const response = await fetch("/api/liveblocks-auth", {
          method: "POST",
          body: JSON.stringify({ room }),
        });
        return await response.json();
      }}
      throttle={16}
      resolveUsers={async ({ userIds }) => {
        try {
          const res = await fetch("/api/liveblocks-users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userIds }),
          });
          if (!res.ok) return userIds.map(() => undefined);
          const users: { name: string; avatar: string; color: string }[] = await res.json();
          return users.map((u) => ({ name: u.name, avatar: u.avatar, color: u.color }));
        } catch {
          toast({
            variant: "destructive",
            title: "Could not resolve collaborators",
          });
          return userIds.map(() => undefined);
        }
      }}
      resolveMentionSuggestions={async ({ text }) => {
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
      <RoomProvider
        id={params.documentId as string}
        initialPresence={{ cursor: null }}
        initialStorage={{ leftMargin: 56, rightMargin: 56 }}
      >
        <ClientSideSuspense
          fallback={<FullScreenLoader label="Room loading ..." />}
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
