"use client";

import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { ClientSideSuspense } from "@liveblocks/react";
import NextImage from "next/image";

const AVATAR_SIZE = 36;
const MAX_SHOWN = 5;

interface AvatarProps {
  src: string;
  name: string;
  /** hex colour for the ring, defaults to a neutral */
  color?: string;
}

export const Avatar = ({ src, name, color }: AvatarProps) => {
  return (
    <div
      style={{
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderColor: color ?? "#e5e7eb",
      }}
      className="group relative -ml-2 shrink-0 rounded-full border-2 bg-gray-400 cursor-pointer overflow-hidden"
      title={name}
    >
      {/* Tooltip */}
      <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-black text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
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
        /* fallback initials */
        <div className="size-full rounded-full flex items-center justify-center text-white text-xs font-semibold bg-blue-500 select-none">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

/** Stack of all currently-active collaborators, Google-Docs style. */
const AvatarsInner = () => {
  const others = useOthers();
  const self = useSelf();

  const all = [
    ...(self
      ? [{ id: self.id, info: self.info, isSelf: true }]
      : []),
    ...others.map((o) => ({ id: o.id, info: o.info, isSelf: false })),
  ];

  const shown = all.slice(0, MAX_SHOWN);
  const overflow = all.length - MAX_SHOWN;

  return (
    <div className="flex items-center">
      {shown.map(({ id, info, isSelf }) => (
        <Avatar
          key={id}
          src={info?.avatar ?? ""}
          name={isSelf ? `${info?.name ?? "You"} (you)` : (info?.name ?? "Unknown")}
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

/** Exported wrapper — safe outside a Liveblocks room (renders nothing). */
export const Avatars = () => (
  <ClientSideSuspense fallback={null}>
    <AvatarsInner />
  </ClientSideSuspense>
);
