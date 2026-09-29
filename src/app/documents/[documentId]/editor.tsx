"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Underline from "@tiptap/extension-underline";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import { useEditorStore } from "@/store/use-editor-store";
import { FontSizeExtension } from "@/extensions/font-size";
import { LineHeightExtension } from "@/extensions/line-height";
import { Ruler } from "./ruler";
import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { useUpdateMyPresence, useStorage } from "@liveblocks/react/suspense";
import { Threads } from "./threads";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";

const DEFAULT_MARGIN = 56;

interface EditorProps {
  initialContent?: string;
}

export const Editor = ({ initialContent }: EditorProps) => {
  const liveblocks = useLiveblocksExtension({
    initialContent,
    offlineSupport_experimental: true,
    mentions: true,
  });
  const { setEditor } = useEditorStore();
  const updateMyPresence = useUpdateMyPresence();

  // Read shared margins from Liveblocks Storage.
  // These are the pixel values applied as left/right padding INSIDE the
  // 816px editor canvas — the canvas itself never moves.
  const leftMargin  = useStorage((root) => root.leftMargin)  ?? DEFAULT_MARGIN;
  const rightMargin = useStorage((root) => root.rightMargin) ?? DEFAULT_MARGIN;

  // Ref to the ProseMirror DOM node so we can update its inline style
  // without recreating the editor instance.
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    autofocus: "end",   // Focus at end of doc when editor mounts
    onCreate({ editor }) { setEditor(editor); },
    onDestroy()          { setEditor(null);   },
    onUpdate({ editor })          { setEditor(editor); },
    onSelectionUpdate({ editor }) { setEditor(editor); },
    onTransaction({ editor })     { setEditor(editor); },
    onFocus({ editor })           { setEditor(editor); },
    onBlur({ editor })            { setEditor(editor); },
    onContentError({ editor })    { setEditor(editor); },

    editorProps: {
      attributes: {
        // Initial padding matches the default margin.
        // We update this via the DOM ref effect below on every Storage change.
        style: `padding-left: ${DEFAULT_MARGIN}px; padding-right: ${DEFAULT_MARGIN}px;`,
        class: [
          "focus:outline-none print:border-0 bg-white border border-[#C7C7C7]",
          "flex flex-col min-h-[1054px] w-[816px] pt-10 pb-10 cursor-text",
        ].join(" "),
      },
    },
    extensions: [
      liveblocks,
      StarterKit.configure({
        history: false,
        // Disable built-in bullet/ordered list so we register our own
        // versions below with input rules removed.
        bulletList: false,
        orderedList: false,
      }),
      // Register list extensions without markdown input rules so that
      // typing '-' or '1.' doesn't auto-convert to a list mid-sentence.
      BulletList.extend({ addInputRules: () => [] }),
      OrderedList.extend({ addInputRules: () => [] }),
      FontSizeExtension,
      LineHeightExtension.configure({
        types: ["heading", "paragraph"],
        defaultLineHeight: "normal",
      }),
      FontFamily,
      TextStyle,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: "https" }),
      Underline,
      Table,
      TableHeader,
      TableRow,
      TableCell,
      Image,
      ImageResize,
      TaskItem.configure({ nested: true }),
      TaskList,
      Subscript,
      Superscript,
    ],
  });

  // Apply margin changes directly to the ProseMirror DOM element.
  // This runs whenever leftMargin or rightMargin changes in Storage —
  // i.e. when any collaborator drags a ruler marker.
  // The editor canvas (w-[816px]) stays fixed; only the inner padding changes.
  useEffect(() => {
    const el = editorContainerRef.current?.querySelector<HTMLElement>(".ProseMirror");
    if (!el) return;
    el.style.paddingLeft  = `${leftMargin}px`;
    el.style.paddingRight = `${rightMargin}px`;
  }, [leftMargin, rightMargin]);

  return (
    <div
      className="size-full overflow-x-auto bg-[#FAFBFD] px-4 print:p-0 print:bg-white print:overflow-visible"
      onPointerMove={(e) => {
        updateMyPresence({ cursor: { x: Math.round(e.clientX), y: Math.round(e.clientY) } });
      }}
      onPointerLeave={() => {
        updateMyPresence({ cursor: null });
      }}
    >
      <Ruler />
      {/* This wrapper is fixed at the page width — it never shifts.
          Only the inner ProseMirror padding changes when margins move. */}
      <div
        ref={editorContainerRef}
        className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0"
      >
        <EditorContent editor={editor} />
        <Threads editor={editor} />
      </div>
    </div>
  );
};
