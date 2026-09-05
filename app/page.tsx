import React from "react";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { Solution } from "@/components/landing/Solution";
import { Features } from "@/components/landing/Features";
import { Innovation } from "@/components/landing/Innovation";
import { ImpactAndVision } from "@/components/landing/ImpactAndVision";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Phase 1: Hero with Interactive Personal Risk Preview */}
      <Hero />
      
      {/* Phase 2: Problem Analysis & Core Logic Chain Solution */}
      <Problem />
      <Solution />

      {/* Phase 3: Features, Technical Innovation, Real Impact, Privacy & Vision */}
      <Features />
      <Innovation />
      <ImpactAndVision />
    </div>
  );
}

