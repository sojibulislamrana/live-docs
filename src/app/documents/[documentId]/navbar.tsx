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
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ClipboardCopyIcon,
  ClipboardPasteIcon,
  FileIcon,
  FileJsonIcon,
  FilePenIcon,
  FilePlusIcon,
  FileTextIcon,
  GlobeIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  MinusIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  ScissorsIcon,
  MousePointerSquareDashedIcon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
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
import { openFileImport } from "@/lib/import-file";
import { useState } from "react";
import { LoaderIcon } from "lucide-react";

interface NavbarProps {
  title: string;
  documentId: Id<"document">;
  ownerId: string;
}

export const Navbar = ({ title, documentId, ownerId }: NavbarProps) => {
  const router = useRouter();
  const { editor } = useEditorStore();
  const create = useMutation(api.document.create);
  const { user } = useUser();

  const isOwner = user?.id === ownerId;

  /* ── helpers ── */
  const insertTable = ({ rows, cols }: { rows: number; cols: number }) =>
    editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();

  const download = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a   = Object.assign(document.createElement("a"), { href: url, download: filename });
    a.click();
    URL.revokeObjectURL(url);
  };

  const onNewDocument = () =>
    create({})
      .then((id) => { toast({ title: "Document created" }); router.push(`/documents/${id}`); })
      .catch(() => toast({ variant: "destructive", title: "Could not create document" }));

  return (
    <nav className="flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <Link href="/"><Image src="/logo.svg" alt="logo" width={36} height={36} /></Link>
        <div className="flex flex-col">
          <DocumentInput title={title} id={documentId} />
          <Menubar className="border-none bg-white shadow-none h-auto p-0">

            {/* ─── File ─────────────────────────────────────────────── */}
            <MenubarMenu>
              <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted">File</MenubarTrigger>
              <MenubarContent className="print:hidden bg-white min-w-[220px]">
                <MenubarItem onClick={onNewDocument}>
                  <FilePlusIcon className="size-4 mr-2" />New document
                </MenubarItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger><FileIcon className="size-4 mr-2" />Download</MenubarSubTrigger>
                  <MenubarSubContent className="bg-white">
                    <MenubarItem onClick={() => editor && download(new Blob([JSON.stringify(editor.getJSON())], { type: "application/json" }), `${title}.json`)}>
                      <FileJsonIcon className="size-4 mr-2" />JSON
                    </MenubarItem>
                    <MenubarItem onClick={() => editor && download(new Blob([editor.getHTML()], { type: "text/html" }), `${title}.html`)}>
                      <GlobeIcon className="size-4 mr-2" />HTML
                    </MenubarItem>
                    <MenubarItem onClick={() => window.print()}>
                      <BsFilePdf className="size-4 mr-2" />PDF
                    </MenubarItem>
                    <MenubarItem onClick={() => editor && download(new Blob([editor.getText()], { type: "text/plain" }), `${title}.txt`)}>
                      <FileTextIcon className="size-4 mr-2" />Plain text
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <RenameDialog documentId={documentId} initialTitle={title}>
                  <MenubarItem onSelect={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
                    <FilePenIcon className="size-4 mr-2" />Rename
                  </MenubarItem>
                </RenameDialog>
                {isOwner && (
                  <RemoveDialog documentId={documentId}>
                    <MenubarItem onSelect={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()} className="text-destructive focus:text-destructive">
                      <TrashIcon className="size-4 mr-2" />Delete
                    </MenubarItem>
                  </RemoveDialog>
                )}
                <MenubarSeparator />
                <MenubarItem onClick={() => window.print()}>
                  <PrinterIcon className="size-4 mr-2" />Print <MenubarShortcut>⌘P</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            {/* ─── Edit ─────────────────────────────────────────────── */}
            <MenubarMenu>
              <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted">Edit</MenubarTrigger>
              <MenubarContent className="bg-white min-w-[220px]">
                <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
                  <Undo2Icon className="size-4 mr-2" />Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
                  <Redo2Icon className="size-4 mr-2" />Redo <MenubarShortcut>⌘⇧Z</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={() => document.execCommand("cut")}>
                  <ScissorsIcon className="size-4 mr-2" />Cut <MenubarShortcut>⌘X</MenubarShortcut>
                </MenubarItem>
                <MenubarItem onClick={() => document.execCommand("copy")}>
                  <ClipboardCopyIcon className="size-4 mr-2" />Copy <MenubarShortcut>⌘C</MenubarShortcut>
                </MenubarItem>
                <MenubarItem onClick={() => navigator.clipboard.readText().then((t) => editor?.chain().focus().insertContent(t).run())}>
                  <ClipboardPasteIcon className="size-4 mr-2" />Paste <MenubarShortcut>⌘V</MenubarShortcut>
                </MenubarItem>
                <MenubarItem onClick={() => document.execCommand("copy")}>
                  <ClipboardCopyIcon className="size-4 mr-2" />Copy without formatting <MenubarShortcut>⌘⇧V</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={() => editor?.chain().focus().selectAll().run()}>
                  <MousePointerSquareDashedIcon className="size-4 mr-2" />Select all <MenubarShortcut>⌘A</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            {/* ─── Insert ───────────────────────────────────────────── */}
            <MenubarMenu>
              <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted">Insert</MenubarTrigger>
              <MenubarContent className="bg-white min-w-[220px]">
                <MenubarItem onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
                  <MinusIcon className="size-4 mr-2" />Horizontal line
                </MenubarItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger><TableIcon className="size-4 mr-2" />Table</MenubarSubTrigger>
                  <MenubarSubContent className="bg-white">
                    {[1, 2, 3, 4].map((n) => (
                      <MenubarItem key={n} onClick={() => insertTable({ rows: n, cols: n })}>{n} × {n}</MenubarItem>
                    ))}
                    <MenubarSeparator />
                    {[{ r: 2, c: 3 }, { r: 3, c: 4 }, { r: 4, c: 5 }].map(({ r, c }) => (
                      <MenubarItem key={`${r}x${c}`} onClick={() => insertTable({ rows: r, cols: c })}>{r} × {c}</MenubarItem>
                    ))}
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSub>
                  <MenubarSubTrigger><ListIcon className="size-4 mr-2" />List</MenubarSubTrigger>
                  <MenubarSubContent className="bg-white">
                    <MenubarItem onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                      <ListIcon className="size-4 mr-2" />Bullet list
                    </MenubarItem>
                    <MenubarItem onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
                      <ListOrderedIcon className="size-4 mr-2" />Numbered list
                    </MenubarItem>
                    <MenubarItem onClick={() => editor?.chain().focus().toggleTaskList().run()}>
                      <ListTodoIcon className="size-4 mr-2" />Checklist
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarItem onClick={() => {
                  const url = window.prompt("Enter URL:");
                  if (url) editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
                }}>
                  <LinkIcon className="size-4 mr-2" />Link <MenubarShortcut>⌘K</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            {/* ─── Format ───────────────────────────────────────────── */}
            <MenubarMenu>
              <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted">Format</MenubarTrigger>
              <MenubarContent className="bg-white min-w-[220px]">
                <MenubarSub>
                  <MenubarSubTrigger><TextIcon className="mr-2 size-4" />Text</MenubarSubTrigger>
                  <MenubarSubContent className="bg-white">
                    <MenubarItem onClick={() => editor?.chain().focus().toggleBold().run()}>
                      <BoldIcon className="size-4 mr-2" />Bold <MenubarShortcut>⌘B</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => editor?.chain().focus().toggleItalic().run()}>
                      <ItalicIcon className="size-4 mr-2" />Italic <MenubarShortcut>⌘I</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                      <UnderlineIcon className="size-4 mr-2" />Underline <MenubarShortcut>⌘U</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => editor?.chain().focus().toggleStrike().run()}>
                      <StrikethroughIcon className="size-4 mr-2" />Strikethrough
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem onClick={() => editor?.chain().focus().toggleSuperscript().run()}>
                      <SuperscriptIcon className="size-4 mr-2" />Superscript
                    </MenubarItem>
                    <MenubarItem onClick={() => editor?.chain().focus().toggleSubscript().run()}>
                      <SubscriptIcon className="size-4 mr-2" />Subscript
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSub>
                  <MenubarSubTrigger><AlignLeftIcon className="mr-2 size-4" />Align</MenubarSubTrigger>
                  <MenubarSubContent className="bg-white">
                    {(["left","center","right","justify"] as const).map((a) => {
                      const Icon = { left: AlignLeftIcon, center: AlignCenterIcon, right: AlignRightIcon, justify: AlignJustifyIcon }[a];
                      return (
                        <MenubarItem key={a} onClick={() => editor?.chain().focus().setTextAlign(a).run()}>
                          <Icon className="size-4 mr-2" />{a.charAt(0).toUpperCase() + a.slice(1)}
                          <MenubarShortcut>⌘⇧{a === "left" ? "L" : a === "center" ? "E" : a === "right" ? "R" : "J"}</MenubarShortcut>
                        </MenubarItem>
                      );
                    })}
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarItem onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}>
                  <RemoveFormattingIcon className="size-4 mr-2" />Clear formatting <MenubarShortcut>⌘\</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

          </Menubar>
        </div>
      </div>

      {/* ── Right side ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 pl-6">
        <Avatars />
        <div className="h-6 w-px bg-neutral-300 mx-1" />
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
