import { useState } from "react";

export function CompareSlider({
  before,
  after,
  labelBefore = "Before",
  labelAfter = "After",
}: {
  before: string;
  after: string;
  labelBefore?: string;
  labelAfter?: string;
}) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60">
      <img src={before} alt={labelBefore} className="w-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={after} alt={labelAfter} className="h-full w-[100vw] max-w-none object-cover" style={{ width: `${(100 / pos) * 100}%` }} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/80" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full gradient-brand text-xs text-white shadow-lg">
          ⇄
        </span>
      </div>
      <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-white backdrop-blur">{labelAfter}</span>
      <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-white backdrop-blur">{labelBefore}</span>
      <input
        type="range"
        min={2}
        max={98}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Compare before and after"
        className="absolute inset-x-0 bottom-0 top-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
