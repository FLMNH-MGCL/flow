import React from "react";

export default function Text({ width }: { width: string }) {
  return (
    <div className="animate-pulse flex space-x-4">
      <div className={`rounded bg-gray-400 h-4 w-${width}`}></div>
    </div>
  );
}
