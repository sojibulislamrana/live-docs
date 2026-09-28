"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { FullScreenLoader } from "@/components/fullscreen-loader";
import { getUsers } from "./actions";
import { useToast } from "@/hooks/use-toast";

type User = { id: string; name: string; avatar: string };

export function Room({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const params = useParams();
  const [user, setUser] = useState<User[]>([]);
  const fetUser = useMemo(
    () => async () => {
      try {
        const list = await getUsers();
        setUser(list);
      } catch {
        toast({
          variant: "destructive",
          title: "Failed to fetch users!",
          description: "ABCD",
        });
      }
    },
    [],
  );

  useEffect(() => {
    fetUser();
  }, [fetUser]);

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      throttle={16}
      resolveUsers={({ userIds }) => {
        return userIds.map(
          (userId) => user.find((user) => user.id === userId) ?? undefined,
        );
      }}
      resolveMentionSuggestions={({ text }) => {
        let filteredUser = user;

        if (text) {
          filteredUser = user.filter((user) =>
            user.name.toLowerCase().includes(text.toLowerCase()),
          );
        }

        return filteredUser.map((user) => user.id);
      }}
      resolveRoomsInfo={() => []}
    >
      <RoomProvider id={params.documentId as string}>
        <ClientSideSuspense
          fallback={<FullScreenLoader label="Room loading ..." />}
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
