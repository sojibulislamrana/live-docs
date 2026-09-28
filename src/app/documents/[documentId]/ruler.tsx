"use client";

import { useRef, useState, useCallback } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useStorage, useMutation } from "@liveblocks/react/suspense";

const PAGE_WIDTH    = 816;
const DEFAULT_MARGIN = 56;
const MIN_SPACE     = 100; // minimum content width

const markers = Array.from({ length: 83 }, (_, i) => i);

export const Ruler = () => {
  const leftMargin  = useStorage((root) => root.leftMargin)  ?? DEFAULT_MARGIN;
  const rightMargin = useStorage((root) => root.rightMargin) ?? DEFAULT_MARGIN;

  const setLeftMargin = useMutation(({ storage }, v: number) => {
    storage.set("leftMargin", v);
  }, []);

  const setRightMargin = useMutation(({ storage }, v: number) => {
    storage.set("rightMargin", v);
  }, []);

  const [isDraggingLeft,  setIsDraggingLeft]  = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);

  const rulerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDraggingLeft && !isDraggingRight) return;
      const rect     = rulerRef.current!.getBoundingClientRect();
      const x        = Math.max(0, Math.min(PAGE_WIDTH, e.clientX - rect.left));

      if (isDraggingLeft) {
        const max = PAGE_WIDTH - rightMargin - MIN_SPACE;
        setLeftMargin(Math.min(x, max));
      } else {
        const fromRight = PAGE_WIDTH - x;
        const max       = PAGE_WIDTH - leftMargin - MIN_SPACE;
        setRightMargin(Math.min(Math.max(0, fromRight), max));
      }
    },
    [isDraggingLeft, isDraggingRight, leftMargin, rightMargin, setLeftMargin, setRightMargin],
  );

  const stopDrag = useCallback(() => {
    setIsDraggingLeft(false);
    setIsDraggingRight(false);
  }, []);

  return (
    <div
      ref={rulerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      className="w-[816px] mx-auto h-6 border-b border-gray-300 relative select-none print:hidden bg-white overflow-hidden"
    >
      {/* ── Shaded margin zones ── */}
      {/* Left: from 0 → leftMargin */}
      <div
        className="absolute top-0 left-0 h-full bg-[#efefef]"
        style={{ width: leftMargin }}
      />
      {/* Right: from (PAGE_WIDTH - rightMargin) → PAGE_WIDTH */}
      <div
        className="absolute top-0 right-0 h-full bg-[#efefef]"
        style={{ width: rightMargin }}
      />

      {/* ── Tick marks ── */}
      <div className="absolute inset-0 pointer-events-none">
        {markers.map((marker) => {
          const x       = (marker / 82) * PAGE_WIDTH;
          const isMajor = marker % 10 === 0;
          const isMid   = marker % 5  === 0 && !isMajor;

          return (
            <div key={marker} className="absolute bottom-0" style={{ left: x }}>
              {isMajor && (
                <>
                  <div className="absolute bottom-0 w-px h-2.5 bg-neutral-500" />
                  <span className="absolute bottom-3 text-[9px] leading-none text-neutral-400 -translate-x-1/2 whitespace-nowrap">
                    {marker / 10 + 1}
                  </span>
                </>
              )}
              {isMid  && <div className="absolute bottom-0 w-px h-2 bg-neutral-400" />}
              {!isMajor && !isMid && <div className="absolute bottom-0 w-px h-1 bg-neutral-300" />}
            </div>
          );
        })}
      </div>

      {/* ── Left margin caret ── */}
      <MarkerCaret
        position={leftMargin}
        isLeft
        isDragging={isDraggingLeft}
        onMouseDown={() => setIsDraggingLeft(true)}
        onDoubleClick={() => setLeftMargin(DEFAULT_MARGIN)}
      />

      {/* ── Right margin caret ── */}
      <MarkerCaret
        position={rightMargin}
        isLeft={false}
        isDragging={isDraggingRight}
        onMouseDown={() => setIsDraggingRight(true)}
        onDoubleClick={() => setRightMargin(DEFAULT_MARGIN)}
      />
    </div>
  );
};

// ─── Caret ────────────────────────────────────────────────────────────────────

interface MarkerCaretProps {
  position: number;
  isLeft: boolean;
  isDragging: boolean;
  onMouseDown: () => void;
  onDoubleClick: () => void;
}

const MarkerCaret = ({
  position,
  isLeft,
  isDragging,
  onMouseDown,
  onDoubleClick,
}: MarkerCaretProps) => {
  // Place the caret so its visual tip sits exactly on the margin boundary.
  // The caret icon is 12px wide → offset by 6px to centre it.
  const style: React.CSSProperties = isLeft
    ? { left: position - 6 }
    : { right: position - 6 };

  return (
    <div
      className="absolute top-0 z-10 cursor-ew-resize"
      style={{ ...style, width: 12, height: "100%" }}
      onMouseDown={(e) => { e.preventDefault(); onMouseDown(); }}
      onDoubleClick={onDoubleClick}
      title="Drag to adjust margin · Double-click to reset"
    >
      <FaCaretDown className="fill-blue-500" size={12} />

      {/* Vertical guide line shown while dragging */}
      {isDragging && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 w-px bg-blue-400 pointer-events-none"
          style={{ height: "100vh", opacity: 0.5 }}
        />
      )}
    </div>
  );
};
