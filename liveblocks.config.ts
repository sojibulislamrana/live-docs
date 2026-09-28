// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      // Real-time cursor position inside the document editor.
      cursor: { x: number; y: number } | null;
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      // Document content is synced via the Liveblocks TipTap extension;
      // no manual storage keys are needed.
    };

    // Custom user info set when authenticating with a secret key.
    UserMeta: {
      id: string;
      info: {
        // Display name shown in avatars, cursors, and comments.
        name: string;
        // Clerk profile picture URL.
        avatar: string;
      };
    };

    // Custom events, for useBroadcastEvent / useEventListener.
    RoomEvent: {};

    // Custom metadata attached to comment threads.
    ThreadMetadata: {};

    // Custom room info resolved by resolveRoomsInfo.
    RoomInfo: {};
  }
}

export {};
