'use client';

import { useState } from 'react';
import type { wType } from "../types/wType";
import { useWindowStore } from "../stores/windowStore";

interface PhotosProps {
  windowInstance: wType;
  startDrag: (event: React.MouseEvent, id: string, type: "move" | "resize") => void;
}

export default function Photos({ windowInstance, startDrag }: PhotosProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const { closeWindow, toggleMinimize, toggleMaximize } = useWindowStore();

  // Sample photos - in a real implementation, these would come from your assets
  const photos = [
    'A walk to remember.jpeg',
    'Banaras .jpeg',
    'bird.jpeg',
    'Black and White.jpeg',
    'camel.jpeg',
    'Faith.jpeg',
    'Golden.jpeg',
    'India.jpeg',
    'Mysore Palace.jpeg',
    'Sun.jpeg'
  ];

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Window Title Bar */}
      <div 
        className="bg-gray-200 px-4 py-2 flex items-center justify-between cursor-move border-b"
        onMouseDown={(e) => startDrag(e, windowInstance.id, "move")}
      >
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <button 
              className="w-3 h-3 bg-red-500 rounded-full"
              onClick={() => closeWindow(windowInstance.id)}
            />
            <button 
              className="w-3 h-3 bg-yellow-500 rounded-full"
              onClick={() => toggleMinimize(windowInstance.id)}
            />
            <button 
              className="w-3 h-3 bg-green-500 rounded-full"
              onClick={() => toggleMaximize(windowInstance.id)}
            />
          </div>
          <span className="text-gray-700 text-sm">Photos</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {selectedPhoto ? (
          <div className="h-full flex flex-col">
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="mb-4 text-blue-600 hover:text-blue-800"
            >
              ← Back to Gallery
            </button>
            <div className="flex-1 flex items-center justify-center">
              <img 
                src={`/lib/assets/photos/${selectedPhoto}`}
                alt={selectedPhoto}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Photo Gallery</h2>
            <div className="grid grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div 
                  key={index}
                  className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img 
                    src={`/lib/assets/photos/${photo}`}
                    alt={photo}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
