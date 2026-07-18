"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

export const BackgroundBeams = ({
  className,
}: {
  className?: string;
}) => {
  const pathsRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!pathsRef.current) return;
    const paths = pathsRef.current.querySelectorAll("path");
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length} ${length}`;
      path.style.strokeDashoffset = `${length}`;
      
      path.animate(
        [
          { strokeDashoffset: length },
          { strokeDashoffset: 0 },
        ],
        {
          duration: Math.random() * 3000 + 4000,
          easing: "ease-in-out",
          iterations: Infinity,
          direction: "alternate",
        }
      );
    });
  }, []);

  return (
    <div
      className={cn(
        "absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-neutral-950",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.15),transparent_50%)]" />
      <svg
        ref={pathsRef}
        className="absolute inset-0 h-full w-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,50 Q250,150 500,50 T1000,50" stroke="#22D3EE" strokeWidth="2" fill="none" />
        <path d="M0,150 Q250,50 500,150 T1000,150" stroke="#4AFFA0" strokeWidth="2" fill="none" />
        <path d="M0,250 Q250,350 500,250 T1000,250" stroke="#FFB020" strokeWidth="2" fill="none" />
        <path d="M0,350 Q250,250 500,350 T1000,350" stroke="#22D3EE" strokeWidth="2" fill="none" />
        <path d="M0,450 Q250,550 500,450 T1000,450" stroke="#4AFFA0" strokeWidth="2" fill="none" />
        
        <path d="M250,0 Q350,250 250,500 T250,1000" stroke="#FFB020" strokeWidth="2" fill="none" />
        <path d="M500,0 Q400,250 500,500 T500,1000" stroke="#22D3EE" strokeWidth="2" fill="none" />
        <path d="M750,0 Q850,250 750,500 T750,1000" stroke="#4AFFA0" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
};
