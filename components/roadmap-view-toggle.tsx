"use client"

import { Map, List } from "lucide-react"

type ViewMode = "visual" | "list"

interface RoadmapViewToggleProps {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}

export function RoadmapViewToggle({ viewMode, setViewMode }: RoadmapViewToggleProps) {
  return (
    <div className="max-w-6xl mx-auto mb-8 flex justify-center">
      <div className="inline-flex rounded-lg border border-border bg-card p-1">
        <button
          onClick={() => setViewMode("visual")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
            viewMode === "visual"
              ? "bg-red-500 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Map className="w-4 h-4" />
          <span className="font-medium">Visual Map</span>
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
            viewMode === "list"
              ? "bg-red-500 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <List className="w-4 h-4" />
          <span className="font-medium">List View</span>
        </button>
      </div>
    </div>
  )
}