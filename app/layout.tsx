"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import NavBar from "@/components/NavBar";
import AlgorithmContext from "@/context/AlgorithmContext";
import { useState } from "react";
import { visualizations } from "@/data/visualizations";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(visualizations[0]);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-500`}>
        <AlgorithmContext.Provider
          value={{ selectedAlgorithm, setSelectedAlgorithm }}
        >
          <NavBar />
          {children}
        </AlgorithmContext.Provider>
      </body>
    </html>
  );
}
