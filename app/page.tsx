"use client";

import PathfindingVisualizer from "@/components/PathfindingVisualizer";
import Tutorial from "@/components/Tutorial";
import { PathVisualizerSlides } from "@/data/tutorial_slides";
import React, { useState } from "react";

export default function Home() {
  const [showTutorial, setShowTutorial] = useState(true);

  const handleTutorialClose = () => {
    setShowTutorial(false);
  };

  return (
    <div className={`home-container ${showTutorial ? "tutorial-active" : ""}`}>
      {showTutorial && (
        <Tutorial
          handleClick={handleTutorialClose}
          slides={PathVisualizerSlides}
        />
      )}

      <PathfindingVisualizer />
    </div>
  );
}
