// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      // Real-time cursor position inside the document editor.
      cursor: { x: number; y: number } | null;
    };

    // The Storage tree for the room — synced in real-time to every collaborator.
    Storage: {
      // Left margin in pixels (default 56 ≈ 0.7 inch at 96dpi).
      leftMargin: number;
      // Right margin in pixels (default 56).
      rightMargin: number;
    };

    // Custom user info set when authenticating with a secret key.
    UserMeta: {
      id: string;
      info: {
        // Display name shown in avatars, cursors, and comments.
        name: string;
        // Clerk profile picture URL.
        avatar: string;
        // Deterministic color assigned per user — used for cursors,
        // text selections, and avatar rings.
        color: string;
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
