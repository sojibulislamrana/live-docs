"use client";

import { useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { usePathname, useRouter } from "next/navigation";

interface RemoveDialogProps {
  documentId: Id<"document">;
  children: React.ReactNode;
}

export const RemoveDialog = ({ documentId, children }: RemoveDialogProps) => {
  const remove = useMutation(api.document.removeById);
  const [isRemoving, setIsRemoving] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent
        className="bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            document.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter onClick={(e) => e.stopPropagation()}>
          <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isRemoving}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsRemoving(true);
              remove({ id: documentId })
                .then(() => {
                  toast({
                    title: "Document deleted",
                    description: "The document was removed successfully.",
                  });
                  if (pathname.includes(`/documents/${documentId}`)) {
                    router.push("/");
                  }
                })
                .catch(() => {
                  toast({
                    variant: "destructive",
                    title: "Could not delete document",
                    description:
                      "Only the document owner can delete it.",
                  });
                })
                .finally(() => {
                  setIsRemoving(false);
                });
            }}
          >
            {isRemoving ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
