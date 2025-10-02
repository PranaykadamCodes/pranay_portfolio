'use client';

import { useState, useEffect, useRef } from 'react';
import type { wType } from "../types/wType";
import { useWindowStore } from "../stores/windowStore";

interface TerminalProps {
  window: wType;
  startDrag: (event: React.MouseEvent, id: string, type: "move" | "resize") => void;
}

export default function Terminal({ window, startDrag }: TerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'Welcome to Terminal',
    'Type "help" for available commands',
    ''
  ]);
  const { closeWindow, toggleMinimize, toggleMaximize } = useWindowStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleCommand = (command: string) => {
    const cmd = command.trim().toLowerCase();
    let output = '';

    switch (cmd) {
      case 'help':
        output = 'Available commands: help, clear, about, projects, skills, contact';
        break;
      case 'clear':
        setHistory(['Welcome to Terminal', 'Type "help" for available commands', '']);
        return;
      case 'about':
        output = 'Software Developer passionate about creating innovative solutions';
        break;
      case 'projects':
        output = 'Check out my projects in the Projects app!';
        break;
      case 'skills':
        output = 'JavaScript, TypeScript, React, Node.js, Python, Next.js';
        break;
      case 'contact':
        output = 'Reach out via LinkedIn or GitHub!';
        break;
      default:
        output = `Command not found: ${command}`;
    }

    setHistory(prev => [...prev, `$ ${command}`, output, '']);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-green-400 font-mono">
      {/* Window Title Bar */}
      <div 
        className="bg-gray-800 px-4 py-2 flex items-center justify-between cursor-move"
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
          <span className="text-white text-sm">Terminal</span>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {history.map((line, index) => (
            <div key={index} className="text-sm">
              {line}
            </div>
          ))}
          <form onSubmit={handleSubmit} className="flex items-center">
            <span className="text-green-400 mr-2">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-green-400"
              autoFocus
            />
          </form>
        </div>
      </div>
    </div>
  );
}
