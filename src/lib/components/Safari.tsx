'use client';

import { useState } from 'react';
import type { wType } from "../types/wType";
import { useWindowStore } from "../stores/windowStore";

interface SafariProps {
  window: wType;
  startDrag: (event: React.MouseEvent, id: string, type: "move" | "resize") => void;
}

export default function Safari({ window, startDrag }: SafariProps) {
  const [url, setUrl] = useState('https://google.com');
  const { closeWindow, toggleMinimize, toggleMaximize } = useWindowStore();

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would handle URL navigation here
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Window Title Bar */}
      <div 
        className="bg-gray-100 px-4 py-2 flex items-center justify-between cursor-move border-b"
        onMouseDown={(e) => startDrag(e, window.id, "move")}
      >
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <button 
              className="w-3 h-3 bg-red-500 rounded-full"
              onClick={() => closeWindow(window.id)}
            />
            <button 
              className="w-3 h-3 bg-yellow-500 rounded-full"
              onClick={() => toggleMinimize(window.id)}
            />
            <button 
              className="w-3 h-3 bg-green-500 rounded-full"
              onClick={() => toggleMaximize(window.id)}
            />
          </div>
          <span className="text-gray-700 text-sm">Safari</span>
        </div>
      </div>

      {/* Address Bar */}
      <div className="bg-gray-50 px-4 py-2 border-b">
        <form onSubmit={handleUrlSubmit} className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <button className="p-1 hover:bg-gray-200 rounded">←</button>
            <button className="p-1 hover:bg-gray-200 rounded">→</button>
            <button className="p-1 hover:bg-gray-200 rounded">↻</button>
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-3 py-1 border rounded-lg bg-white"
            placeholder="Enter URL"
          />
        </form>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌐</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Safari Browser</h3>
          <p className="text-gray-500">Browse the web within your portfolio</p>
        </div>
      </div>
    </div>
  );
}
