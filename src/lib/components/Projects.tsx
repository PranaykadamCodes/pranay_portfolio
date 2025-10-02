'use client';

import { useEffect } from 'react';
import type { wType } from "../types/wType";
import { useWindowStore } from "../stores/windowStore";
import { useProjectStore } from "../stores/projectStore";
import { getTagColor, getTypeColor } from "../utils/tagColors";

interface ProjectsProps {
  window: wType;
  startDrag: (event: React.MouseEvent, id: string, type: "move" | "resize") => void;
}

export default function Projects({ window, startDrag }: ProjectsProps) {
  const { closeWindow, toggleMinimize, toggleMaximize } = useWindowStore();
  const { projects } = useProjectStore();

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
          <span className="text-gray-700 text-sm">Projects</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Projects</h2>
        
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-50 rounded-lg p-6 border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {project.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{project.shortDescription}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(project.type)}`}>
                  {project.type}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <span 
                    key={tech}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tech)}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex space-x-4">
                <a 
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View on GitHub →
                </a>
                {project.readmeUrl && (
                  <a 
                    href={project.readmeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 text-sm"
                  >
                    Read Documentation →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
