"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

type Card = {
  title: string;
  src: string;
};

export const FocusCards = ({ cards }: { cards: Card[] }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto w-full z-10 relative">
      {cards.map((card, index) => (
        <div
          key={card.title}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "rounded-xl relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out cursor-pointer shadow-2xl",
            hovered !== null && hovered !== index && "blur-sm scale-[0.98] opacity-50"
          )}
        >
          <img
            src={card.src}
            alt={card.title}
            className="object-cover absolute inset-0 w-full h-full transition-transform duration-500 hover:scale-105"
          />
          <div
            className={cn(
              "absolute inset-0 bg-black/60 flex items-end py-8 px-4 transition-opacity duration-300",
              hovered === index ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="text-xl md:text-3xl font-bold text-white tracking-wide">
              {card.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
