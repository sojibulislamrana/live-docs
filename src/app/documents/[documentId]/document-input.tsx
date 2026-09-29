"use client";

import { useMutation } from "convex/react";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { LoaderIcon } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { useStatus } from "@liveblocks/react";
import { toast } from "@/hooks/use-toast";

interface DocumentInputProps {
  title: string;
  id: Id<"document">;
}

export const DocumentInput = ({ title, id }: DocumentInputProps) => {
  const status   = useStatus();
  const [value, setValue]       = useState(title);
  const [isPending, setIsPending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const mutate   = useMutation(api.document.updateById);

  useEffect(() => { setValue(title); }, [title]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const nextTitle = value.trim() || "Untitled document";
    if (nextTitle === title) { setIsEditing(false); return; }
    setIsPending(true);
    mutate({ id, title: nextTitle })
      .then(() => { setIsEditing(false); })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Could not rename document",
          description: "You need to be the owner or a member of this document's organization.",
        });
      })
      .finally(() => setIsPending(false));
  };

  // Show spinner while saving OR while Liveblocks is connecting/reconnecting
  const showLoader = isPending || status === "connecting" || status === "reconnecting";
  const showError  = status === "disconnected";

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <form onSubmit={onSubmit} className="relative w-fit max-w-[50ch]">
          {/* invisible ghost text keeps the input the right width */}
          <span className="invisible whitespace-pre px-1.5 text-lg">{value || " "}</span>
          <input
            ref={inputRef}
            value={value}
            onChange={onChange}
            onBlur={() => onSubmit()}
            className="absolute inset-0 text-lg text-black px-1.5 bg-transparent truncate"
          />
        </form>
      ) : (
        <span
          onClick={() => {
            setIsEditing(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          className="text-lg px-1.5 cursor-pointer truncate"
        >
          {title}
        </span>
      )}

      {/* Status indicator */}
      {showError  && <BsCloudSlash className="size-4 text-destructive" title="Disconnected" />}
      {showLoader && !showError && (
        <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
      )}
      {!showLoader && !showError && (
        <BsCloudCheck className="size-4 text-muted-foreground" title="Saved" />
      )}
    </div>
  );
};
