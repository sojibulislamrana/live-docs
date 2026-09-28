"use client";

import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { ClientSideSuspense } from "@liveblocks/react";
import NextImage from "next/image";

const AVATAR_SIZE = 36;
const MAX_SHOWN   = 5;

interface AvatarProps {
  src: string;
  name: string;
  color: string;
}

export const Avatar = ({ src, name, color }: AvatarProps) => (
  <div
    style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderColor: color }}
    className="group relative -ml-2 shrink-0 rounded-full border-[3px] bg-gray-300 cursor-pointer overflow-hidden"
    title={name}
  >
    {/* Tooltip */}
    <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded-md text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow"
      style={{ backgroundColor: color }}>
      {name}
    </div>

    {src ? (
      <NextImage
        src={src}
        alt={name}
        fill
        className="rounded-full object-cover"
        sizes={`${AVATAR_SIZE}px`}
      />
    ) : (
      // Initials fallback — uses the user's color as background
      <div
        className="size-full rounded-full flex items-center justify-center text-white text-xs font-bold select-none"
        style={{ backgroundColor: color }}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    )}
  </div>
);

// ─── Avatars stack ────────────────────────────────────────────────────────────

const AvatarsInner = () => {
  const others = useOthers();
  const self   = useSelf();

  // Build the list: current user first, then others.
  const all = [
    ...(self ? [{ id: self.id, info: self.info, isSelf: true }] : []),
    ...others.map((o) => ({ id: o.id, info: o.info, isSelf: false })),
  ];

  const shown    = all.slice(0, MAX_SHOWN);
  const overflow = all.length - MAX_SHOWN;

  return (
    <div className="flex items-center">
      {shown.map(({ id, info, isSelf }) => (
        <Avatar
          key={id}
          src={info?.avatar ?? ""}
          name={isSelf ? `${info?.name ?? "You"} (you)` : (info?.name ?? "Unknown")}
          color={info?.color ?? "#6b7280"}
        />
      ))}

      {overflow > 0 && (
        <div
          style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
          className="-ml-2 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0"
          title={`${overflow} more collaborator${overflow > 1 ? "s" : ""}`}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
};

export const Avatars = () => (
  <ClientSideSuspense fallback={null}>
    <AvatarsInner />
  </ClientSideSuspense>
);
