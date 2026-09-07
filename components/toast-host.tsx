"use client";

import { useEffect, useState } from "react";
import { subscribeToasts } from "@/lib/feedback";

type ToastItem = { id: number; message: string };

export function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    return subscribeToasts(({ message, durationMs }) => {
      const id = Date.now() + Math.random();
      setItems((current) => [...current.slice(-2), { id, message }]);
      window.setTimeout(() => {
        setItems((current) => current.filter((item) => item.id !== id));
      }, durationMs);
    });
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-[130] flex flex-col items-center gap-2 px-4 md:bottom-6"
      aria-live="polite"
      aria-relevant="additions"
    >
      {items.map((item) => (
        <p
          key={item.id}
          className="max-w-sm rounded-full border border-line bg-[#10241f] px-4 py-2 text-center text-sm font-semibold text-cream shadow-lg"
          role="status"
        >
          {item.message}
        </p>
      ))}
    </div>
  );
}
