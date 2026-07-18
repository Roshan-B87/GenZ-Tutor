"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed inset-x-0 top-10 z-50 mx-auto max-w-5xl px-4", className)}
    >
      <div className="flex items-center justify-between w-full">
        {/* GENZTutor Logo */}
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
          <img src="/GENZTutor.png" alt="GENZTutor Logo" className="h-[72px] md:h-[88px] w-auto object-contain" />
        </Link>

        {/* Aceternity Menu */}
        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="Platform">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/canvas">Interactive Canvas</HoveredLink>
              <HoveredLink href="/explore">Explore Gallery</HoveredLink>
              <HoveredLink href="/history">My History</HoveredLink>
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Subjects">
            <div className="grid grid-cols-2 gap-10 p-4 text-sm">
              <ProductItem
                title="Physics"
                href="/canvas?q=Show+me+how+gravity+works"
                src="https://images.unsplash.com/photo-1636466497217-26c8c5409923?q=80&w=600&auto=format&fit=crop"
                description="Explore mechanics, gravity, and collisions in real-time."
              />
              <ProductItem
                title="Mathematics"
                href="/canvas?q=Graph+a+sine+wave"
                src="https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop"
                description="Interactive graphing, algebra, and calculus visualizations."
              />
              <ProductItem
                title="Chemistry"
                href="/canvas?q=Show+me+the+process+of+photosynthesis"
                src="https://images.unsplash.com/photo-1603126859595-8e50640ea5c1?q=80&w=600&auto=format&fit=crop"
                description="Understand chemical reactions and molecular flow diagrams."
              />
              <ProductItem
                title="Biology"
                href="/canvas?q=Krebs+cycle"
                src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=600&auto=format&fit=crop"
                description="Discover cellular structures and biological cycles."
              />
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Project">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/about">About Us</HoveredLink>
              <HoveredLink href="#">Documentation</HoveredLink>
              <HoveredLink href="#">GitHub Repo</HoveredLink>
            </div>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}
