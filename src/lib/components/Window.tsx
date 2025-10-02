'use client';

import { useRef } from 'react';
import type { wType } from "../types/wType";
import { useWindowStore } from "../stores/windowStore";
import Terminal from "./Terminal";
import Safari from "./Safari";
import Photos from "./Photos";
import Projects from "./Projects";
import Blog from "./Blog";
import Music from "./Music";

interface WindowProps {
  window: wType;
}

export default function Window({ window }: WindowProps) {
  const { focusWindow } = useWindowStore();
  const windowRef = useRef<HTMLDivElement>(null);

  const startDrag = (event: React.MouseEvent, id: string, type: "move" | "resize") => {
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = window.size.width;
    const startHeight = window.size.height;
    const startLeft = window.position.x;
    const startTop = window.position.y;

    const onMouseMove = (e: MouseEvent) => {
      if (type === "move") {
        window.position.x = startLeft + e.clientX - startX;
        window.position.y = startTop + e.clientY - startY;
        
        if (windowRef.current) {
          windowRef.current.style.left = `${window.position.x}px`;
          windowRef.current.style.top = `${window.position.y}px`;
        }
      } else {
        window.size.width = Math.max(300, startWidth + e.clientX - startX);
        window.size.height = Math.max(200, startHeight + e.clientY - startY);
        
        if (windowRef.current) {
          windowRef.current.style.width = `${window.size.width}px`;
          windowRef.current.style.height = `${window.size.height}px`;
        }
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const renderContent = () => {
    switch (window.type) {
      case "terminal":
        return <Terminal window={window} startDrag={startDrag} />;
      case "safari":
        return <Safari window={window} startDrag={startDrag} />;
      case "photos":
        return <Photos windowInstance={window} startDrag={startDrag} />;
      case "projects":
        return <Projects window={window} startDrag={startDrag} />;
      case "blog":
        return <Blog window={window} startDrag={startDrag} />;
      case "music":
        return <Music window={window} startDrag={startDrag} />;
      default:
        return <div>Unknown window type</div>;
    }
  };

  return (
    <div
      ref={windowRef}
      id={window.id}
      className={`absolute rounded-lg shadow-2xl overflow-hidden ${window.minimized ? 'hidden' : ''}`}
      style={{
        left: `${window.position.x}px`,
        top: `${window.position.y}px`,
        width: `${window.size.width}px`,
        height: `${window.size.height}px`,
        zIndex: window.zIndex,
      }}
      onMouseDown={() => focusWindow(window.id)}
    >
      {renderContent()}
      
      {!window.maximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={(e) => startDrag(e, window.id, "resize")}
        />
      )}
    </div>
  );
}
