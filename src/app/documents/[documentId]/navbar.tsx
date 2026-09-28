"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { DocumentInput } from "./document-input";
import {
  BoldIcon,
  FileIcon,
  FileJsonIcon,
  FilePenIcon,
  FilePlusIcon,
  FileTextIcon,
  GlobeIcon,
  ItalicIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  TableIcon,
  TextIcon,
  TrashIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import { BsFilePdf } from "react-icons/bs";
import { useEditorStore } from "@/store/use-editor-store";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "@/hooks/use-toast";
import { RenameDialog } from "@/components/rename-dialog";
import { RemoveDialog } from "@/components/remove-dialog";
import { Avatars } from "./avatar";
import { Inbox } from "./inbox";

interface NavbarProps {
  title: string;
  documentId: Id<"document">;
  /** Clerk user-id of the document owner — used to gate the Delete option. */
  ownerId: string;
}

export const Navbar = ({ title, documentId, ownerId }: NavbarProps) => {
  const router = useRouter();
  const { editor } = useEditorStore();
  const create = useMutation(api.document.create);
  const { user } = useUser();

  const isOwner = user?.id === ownerId;

  const insertTable = ({ rows, cols }: { rows: number; cols: number }) => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: false })
      .run();
  };

  const onDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onSaveJSON = () => {
    if (!editor) return;
    const blob = new Blob([JSON.stringify(editor.getJSON())], {
      type: "application/json",
    });
    onDownload(blob, `${title}.json`);
  };

  const onSaveHTML = () => {
    if (!editor) return;
    const blob = new Blob([editor.getHTML()], { type: "text/html" });
    onDownload(blob, `${title}.html`);
  };

  const onSaveText = () => {
    if (!editor) return;
    const blob = new Blob([editor.getText()], { type: "text/plain" });
    onDownload(blob, `${title}.txt`);
  };

  const onNewDocument = () => {
    create({})
      .then((id) => {
        toast({ title: "Document created" });
        router.push(`/documents/${id}`);
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Could not create document",
        });
      });
  };

  return (
    <nav className="flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <Link href="/">
          <Image src="/logo.svg" alt="logo" width={36} height={36} />
        </Link>
        <div className="flex flex-col">
          <DocumentInput title={title} id={documentId} />
          <div className="flex">
            <Menubar className="border-none bg-white shadow-none h-auto p-0">
              {/* ── File ──────────────────────────────────────────────── */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted">
                  File
                </MenubarTrigger>
                <MenubarContent className="print:hidden bg-white">
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <FileIcon className="size-4 mr-2" />
                      Save
                    </MenubarSubTrigger>
                    <MenubarSubContent className="bg-white">
                      <MenubarItem onClick={onSaveJSON}>
                        <FileJsonIcon className="size-4 mr-2" />
                        JSON
                      </MenubarItem>
                      <MenubarItem onClick={onSaveHTML}>
                        <GlobeIcon className="size-4 mr-2" />
                        HTML
                      </MenubarItem>
                      <MenubarItem onClick={() => window.print()}>
                        <BsFilePdf className="size-4 mr-2" />
                        PDF
                      </MenubarItem>
                      <MenubarItem onClick={onSaveText}>
                        <FileTextIcon className="size-4 mr-2" />
                        Text
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>

                  <MenubarItem onClick={onNewDocument}>
                    <FilePlusIcon className="size-4 mr-2" />
                    New document
                  </MenubarItem>

                  <MenubarSeparator />

                  {/* Rename — available to owners AND org members */}
                  <RenameDialog documentId={documentId} initialTitle={title}>
                    <MenubarItem
                      onSelect={(e) => e.preventDefault()}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FilePenIcon className="size-4 mr-2" />
                      Rename
                    </MenubarItem>
                  </RenameDialog>

                  <MenubarSeparator />

                  {/* Delete — owner only */}
                  {isOwner && (
                    <RemoveDialog documentId={documentId}>
                      <MenubarItem
                        onSelect={(e) => e.preventDefault()}
                        onClick={(e) => e.stopPropagation()}
                        className="text-destructive focus:text-destructive"
                      >
                        <TrashIcon className="size-4 mr-2" />
                        Delete
                      </MenubarItem>
                    </RemoveDialog>
                  )}

                  <MenubarItem onClick={() => window.print()}>
                    <PrinterIcon className="size-4 mr-2" />
                    Print <MenubarShortcut>⌘P</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* ── Edit ──────────────────────────────────────────────── */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted">
                  Edit
                </MenubarTrigger>
                <MenubarContent className="bg-white">
                  <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
                    <Undo2Icon className="size-4 mr-2" />
                    Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
                    <Redo2Icon className="size-4 mr-2" />
                    Redo <MenubarShortcut>⌘Y</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* ── Insert ────────────────────────────────────────────── */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted">
                  Insert
                </MenubarTrigger>
                <MenubarContent className="bg-white">
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <TableIcon className="size-4 mr-2" />
                      Table
                    </MenubarSubTrigger>
                    <MenubarSubContent className="bg-white">
                      {[1, 2, 3, 4].map((n) => (
                        <MenubarItem
                          key={n}
                          onClick={() => insertTable({ rows: n, cols: n })}
                        >
                          {n} x {n}
                        </MenubarItem>
                      ))}
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>

              {/* ── Format ────────────────────────────────────────────── */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted">
                  Format
                </MenubarTrigger>
                <MenubarContent className="bg-white">
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <TextIcon className="mr-2 size-4" />
                      Text
                    </MenubarSubTrigger>
                    <MenubarSubContent className="bg-white">
                      <MenubarItem onClick={() => editor?.chain().focus().toggleBold().run()}>
                        <BoldIcon className="size-4 mr-2" />
                        Bold <MenubarShortcut>⌘B</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem onClick={() => editor?.chain().focus().toggleItalic().run()}>
                        <ItalicIcon className="size-4 mr-2" />
                        Italic <MenubarShortcut>⌘I</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                        <UnderlineIcon className="size-4 mr-2" />
                        Underline <MenubarShortcut>⌘U</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem onClick={() => editor?.chain().focus().toggleStrike().run()}>
                        <StrikethroughIcon className="size-4 mr-2" />
                        Strikethrough
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem onClick={() => editor?.chain().focus().unsetAllMarks().run()}>
                    <RemoveFormattingIcon className="size-4 mr-2" />
                    Clear formatting
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>

      {/* ── Right side: avatars | separator | bell + org + user ──── */}
      <div className="flex items-center gap-2 pl-6">
        {/* Live collaborator avatars */}
        <Avatars />

        {/* Vertical divider separating active-user avatars from action icons */}
        <div className="h-6 w-px bg-neutral-300 mx-1" />

        {/* Notifications bell */}
        <Inbox />

        <OrganizationSwitcher
          hidePersonal={false}
          afterCreateOrganizationUrl="/"
          afterLeaveOrganizationUrl="/"
          afterSelectOrganizationUrl="/"
          afterSelectPersonalUrl="/"
        />
        <UserButton />
      </div>
    </nav>
  );
};
