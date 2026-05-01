"use client";

import { useState, useRef, useEffect } from "react";

interface ScaleDialogProps {
  /** Pixel length of the drawn reference line */
  pixelLength: number;
  onConfirm: (realMetres: number) => void;
  onCancel: () => void;
}

export default function ScaleDialog({ pixelLength, onConfirm, onCancel }: ScaleDialogProps) {
  const [value, setValue] = useState("6");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const metres = parseFloat(value);
    if (metres > 0) onConfirm(metres);
  };

  const ppm = pixelLength / (parseFloat(value) || 1);

  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-2xl p-5 w-80" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-sm font-semibold text-neutral-800 mb-1">Set Scale</h3>
        <p className="text-xs text-neutral-500 mb-4">
          Enter the real-world distance the line you drew represents.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
              Distance (metres)
            </label>
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="number"
                step="0.1"
                min="0.1"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-sm text-neutral-500 font-medium">m</span>
            </div>
          </div>
          <div className="text-xs text-neutral-400">
            Line length: {Math.round(pixelLength)}px = {value}m
            <br />
            Scale: {Math.round(ppm)} pixels/metre
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-3 py-2 text-xs border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-2 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
            >
              Set Scale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
