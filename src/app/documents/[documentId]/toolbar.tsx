"use client";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ChevronDownIcon,
  HighlighterIcon,
  ImageIcon,
  ItalicIcon,
  Link2Icon,
  ListCollapseIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  LucideIcon,
  MessageSquarePlusIcon,
  MinusIcon,
  PlusIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  SearchIcon,
  SpellCheckIcon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  UnderlineIcon,
  Undo2Icon,
  UploadIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Level } from "@tiptap/extension-heading";
import { type ColorResult, SketchPicker } from "react-color";
import { useState } from "react";

// ─── Line Height ──────────────────────────────────────────────────────────────

const LineHeightButton = () => {
  const { editor } = useEditorStore();
  const lineHeights = [
    { label: "Default", value: "normal" },
    { label: "Single",  value: "1"      },
    { label: "1.15",    value: "1.15"   },
    { label: "1.5",     value: "1.5"    },
    { label: "Double",  value: "2"      },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200 px-1.5 text-sm" title="Line spacing">
          <ListCollapseIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {lineHeights.map(({ label, value }) => (
          <button key={value}
            onClick={() => editor?.chain().focus().setLineHeight(value).run()}
            className={cn("flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200 text-sm",
              editor?.getAttributes("paragraph").lineHeight === value && "bg-neutral-200")}>
            {label}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ─── Font Size ────────────────────────────────────────────────────────────────

const FontSizeButton = () => {
  const { editor } = useEditorStore();
  const currentFontSize = editor?.getAttributes("textStyle").fontSize?.replace("px", "") ?? "16";
  const [inputValue, setInputValue] = useState(currentFontSize);
  const [isEditing, setIsEditing]   = useState(false);

  const update = (val: string) => {
    const n = parseInt(val);
    if (!isNaN(n) && n > 0) {
      editor?.chain().focus().setFontSize(`${n}px`).run();
      setInputValue(String(n));
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-x-0.5">
      <button className="h-7 w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200"
        onClick={() => update(String(Math.max(1, parseInt(currentFontSize) - 1)))} title="Decrease font size">
        <MinusIcon className="size-4" />
      </button>
      {isEditing ? (
        <Input type="text" value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => update(inputValue)}
          onKeyDown={(e) => { if (e.key === "Enter") update(inputValue); }}
          className="h-7 w-10 text-sm text-center border border-neutral-400 rounded-sm bg-white" />
      ) : (
        <button className="h-7 w-10 text-sm text-center border border-neutral-400 rounded-sm bg-white hover:bg-neutral-50"
          onClick={() => { setIsEditing(true); setInputValue(currentFontSize); }}>
          {currentFontSize}
        </button>
      )}
      <button className="h-7 w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200"
        onClick={() => update(String(parseInt(currentFontSize) + 1))} title="Increase font size">
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
};

// ─── List Button ──────────────────────────────────────────────────────────────

const ListButton = () => {
  const { editor } = useEditorStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200 px-1.5 text-sm" title="Lists">
          <ListIcon className="size-4" />
          <ChevronDownIcon className="size-3 ml-0.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {[
          { label: "Bullet list",   icon: ListIcon,        active: () => editor?.isActive("bulletList"),  cmd: () => editor?.chain().focus().toggleBulletList().run()  },
          { label: "Numbered list", icon: ListOrderedIcon, active: () => editor?.isActive("orderedList"), cmd: () => editor?.chain().focus().toggleOrderedList().run() },
          { label: "Checklist",     icon: ListTodoIcon,    active: () => editor?.isActive("taskList"),    cmd: () => editor?.chain().focus().toggleTaskList().run()    },
        ].map(({ label, icon: Icon, active, cmd }) => (
          <button key={label} onClick={cmd}
            className={cn("flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200 text-sm", active() && "bg-neutral-200")}>
            <Icon className="size-4" />{label}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ─── Align Button ─────────────────────────────────────────────────────────────

const AlignButton = () => {
  const { editor } = useEditorStore();
  const options = [
    { label: "Left",    value: "left",    icon: AlignLeftIcon    },
    { label: "Center",  value: "center",  icon: AlignCenterIcon  },
    { label: "Right",   value: "right",   icon: AlignRightIcon   },
    { label: "Justify", value: "justify", icon: AlignJustifyIcon },
  ];
  const current = options.find((o) => editor?.isActive({ textAlign: o.value })) ?? options[0];
  const CurrentIcon = current.icon;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200 px-1.5 text-sm" title="Text alignment">
          <CurrentIcon className="size-4" />
          <ChevronDownIcon className="size-3 ml-0.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {options.map(({ label, value, icon: Icon }) => (
          <button key={value}
            onClick={() => editor?.chain().focus().setTextAlign(value).run()}
            className={cn("flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200 text-sm",
              editor?.isActive({ textAlign: value }) && "bg-neutral-200")}>
            <Icon className="size-4" />{label}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ─── Image Button ─────────────────────────────────────────────────────────────

const ImageButton = () => {
  const { editor } = useEditorStore();
  const [imageUrl, setImageUrl]       = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const insert = (src: string) => {
    if (src.trim()) editor?.chain().focus().setImage({ src: src.trim() }).run();
  };

  const onUpload = () => {
    const input = Object.assign(document.createElement("input"), { type: "file", accept: "image/*" });
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) insert(URL.createObjectURL(file));
    };
    input.click();
  };

  return (
    <DropdownMenu onOpenChange={(open) => { if (!open) setShowUrlInput(false); }}>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200 px-1.5 text-sm" title="Insert image">
          <ImageIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[320px] bg-white p-2">
        {!showUrlInput ? (
          <>
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); onUpload(); }}>
              <UploadIcon className="size-4 mr-2" />Upload from computer
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setShowUrlInput(true); }}>
              <SearchIcon className="size-4 mr-2" />Insert image URL
            </DropdownMenuItem>
          </>
        ) : (
          <div className="flex gap-2 p-1" onKeyDown={(e) => e.stopPropagation()}>
            <Input autoFocus placeholder="https://…" value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { insert(imageUrl); setImageUrl(""); setShowUrlInput(false); }}} />
            <Button size="sm" disabled={!imageUrl.trim()} onClick={() => { insert(imageUrl); setImageUrl(""); setShowUrlInput(false); }}>Insert</Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ─── Link Button ──────────────────────────────────────────────────────────────

const LinkButton = () => {
  const { editor } = useEditorStore();
  const [value, setValue] = useState("");
  return (
    <DropdownMenu onOpenChange={(open) => { if (open) setValue(editor?.getAttributes("link").href ?? ""); }}>
      <DropdownMenuTrigger asChild>
        <button className={cn("h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200 px-1.5 text-sm",
          editor?.isActive("link") && "bg-neutral-200")} title="Insert / edit link">
          <Link2Icon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2 flex items-center gap-x-2">
        <Input placeholder="https://example.com" value={value} onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") editor?.chain().focus().extendMarkRange("link").setLink({ href: value }).run(); }} />
        <Button onClick={() => editor?.chain().focus().extendMarkRange("link").setLink({ href: value }).run()}>Apply</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ─── Highlight Color ──────────────────────────────────────────────────────────

const HighlightColorButton = () => {
  const { editor } = useEditorStore();
  const value = editor?.getAttributes("highlight").color ?? "#FFFF00";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200 px-1.5 text-sm" title="Highlight color">
          <HighlighterIcon className="size-4" />
          <div className="h-0.5 w-full mt-0.5 rounded-full" style={{ backgroundColor: value }} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0 border-0">
        <SketchPicker color={value} onChange={(c: ColorResult) => editor?.chain().focus().setHighlight({ color: c.hex }).run()} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ─── Text Color ───────────────────────────────────────────────────────────────

const TextColorButton = () => {
  const { editor } = useEditorStore();
  const value = editor?.getAttributes("textStyle").color ?? "#000000";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200 px-1.5 text-sm" title="Text color">
          <span className="text-xs font-bold leading-none">A</span>
          <div className="h-[3px] w-full mt-0.5 rounded-full" style={{ backgroundColor: value }} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0 border-0">
        <SketchPicker color={value} onChange={(c: ColorResult) => editor?.chain().focus().setColor(c.hex).run()} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ─── Heading Level ────────────────────────────────────────────────────────────

const HeadingLevelButton = () => {
  const { editor } = useEditorStore();
  const headings = [
    { label: "Normal text", value: 0, fontSize: "16px" },
    { label: "Heading 1",   value: 1, fontSize: "32px" },
    { label: "Heading 2",   value: 2, fontSize: "24px" },
    { label: "Heading 3",   value: 3, fontSize: "20px" },
    { label: "Heading 4",   value: 4, fontSize: "18px" },
    { label: "Heading 5",   value: 5, fontSize: "16px" },
  ];
  const currentLabel = headings.find(
    (h) => h.value !== 0 && editor?.isActive("heading", { level: h.value })
  )?.label ?? "Normal text";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 w-[130px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200 px-1.5 text-sm" title="Paragraph style">
          <span className="truncate">{currentLabel}</span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {headings.map(({ label, value, fontSize }) => (
          <button key={value} style={{ fontSize }}
            onClick={() => value === 0
              ? editor?.chain().focus().setParagraph().run()
              : editor?.chain().focus().toggleHeading({ level: value as Level }).run()}
            className={cn("flex items-center px-2 py-1 rounded-sm hover:bg-neutral-200",
              (value === 0 && !editor?.isActive("heading")) ||
              editor?.isActive("heading", { level: value })
                ? "bg-neutral-200" : "")}>
            {label}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ─── Font Family ──────────────────────────────────────────────────────────────

const FontFamilyButton = () => {
  const { editor } = useEditorStore();
  const fonts = [
    { label: "Arial",           value: "Arial"           },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Courier New",     value: "Courier New"     },
    { label: "Georgia",         value: "Georgia"         },
    { label: "Verdana",         value: "Verdana"         },
    { label: "Trebuchet MS",    value: "Trebuchet MS"    },
    { label: "Comic Sans MS",   value: "Comic Sans MS"   },
  ];
  const current = editor?.getAttributes("textStyle").fontFamily ?? "Arial";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 w-[110px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200 px-1.5 text-sm" title="Font">
          <span className="truncate" style={{ fontFamily: current }}>{current}</span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {fonts.map(({ label, value }) => (
          <button key={value} style={{ fontFamily: value }}
            onClick={() => editor?.chain().focus().setFontFamily(value).run()}
            className={cn("flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200 text-sm",
              current === value && "bg-neutral-200")}>
            {label}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ─── Generic toolbar button ───────────────────────────────────────────────────

interface ToolbarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
  title?: string;
}
const ToolbarButton = ({ onClick, isActive, icon: Icon, title }: ToolbarButtonProps) => (
  <button title={title} onClick={onClick}
    className={cn("text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200",
      isActive && "bg-neutral-200")}>
    <Icon className="size-4" />
  </button>
);

// ─── Toolbar ──────────────────────────────────────────────────────────────────

export const Toolbar = () => {
  const { editor } = useEditorStore();

  return (
    <div className="bg-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-w-[40px] flex items-center gap-x-0.5 overflow-x-auto">
      {/* History */}
      <ToolbarButton title="Undo (⌘Z)"  icon={Undo2Icon}  onClick={() => editor?.chain().focus().undo().run()} />
      <ToolbarButton title="Redo (⌘Y)"  icon={Redo2Icon}  onClick={() => editor?.chain().focus().redo().run()} />
      <ToolbarButton title="Print (⌘P)" icon={PrinterIcon} onClick={() => window.print()} />
      <ToolbarButton title="Spell check" icon={SpellCheckIcon}
        onClick={() => {
          const cur = editor?.view.dom.getAttribute("spellcheck");
          editor?.view.dom.setAttribute("spellcheck", cur === "false" ? "true" : "false");
        }} />

      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <FontFamilyButton />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <HeadingLevelButton />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <FontSizeButton />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />

      {/* Inline marks */}
      <ToolbarButton title="Bold (⌘B)"        icon={BoldIcon}          isActive={editor?.isActive("bold")}        onClick={() => editor?.chain().focus().toggleBold().run()} />
      <ToolbarButton title="Italic (⌘I)"      icon={ItalicIcon}        isActive={editor?.isActive("italic")}      onClick={() => editor?.chain().focus().toggleItalic().run()} />
      <ToolbarButton title="Underline (⌘U)"   icon={UnderlineIcon}     isActive={editor?.isActive("underline")}   onClick={() => editor?.chain().focus().toggleUnderline().run()} />
      <ToolbarButton title="Strikethrough"     icon={StrikethroughIcon} isActive={editor?.isActive("strike")}      onClick={() => editor?.chain().focus().toggleStrike().run()} />
      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <ToolbarButton title="Superscript"       icon={SuperscriptIcon}   isActive={editor?.isActive("superscript")} onClick={() => editor?.chain().focus().toggleSuperscript().run()} />
      <ToolbarButton title="Subscript"         icon={SubscriptIcon}     isActive={editor?.isActive("subscript")}   onClick={() => editor?.chain().focus().toggleSubscript().run()} />

      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <TextColorButton />
      <HighlightColorButton />

      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <LinkButton />
      <ImageButton />

      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <AlignButton />
      <LineHeightButton />

      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      <ListButton />
      {/* Direct checklist button for quick access */}
      <ToolbarButton title="Checklist" icon={ListTodoIcon} isActive={editor?.isActive("taskList")} onClick={() => editor?.chain().focus().toggleTaskList().run()} />

      <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      {/* Comment */}
      <ToolbarButton title="Add comment" icon={MessageSquarePlusIcon} isActive={editor?.isActive("liveblocksCommentMark")} onClick={() => editor?.chain().addPendingComment().run()} />
      {/* Clear formatting */}
      <ToolbarButton title="Clear formatting (⌘\\)" icon={RemoveFormattingIcon} onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()} />
    </div>
  );
};
