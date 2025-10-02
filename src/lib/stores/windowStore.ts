import { create } from 'zustand';
import type { wType } from '../types/wType';

interface WindowState {
  windows: wType[];
  nextZIndex: number;
  addWindow: (type: "terminal" | "safari" | "photos" | "blog" | "projects" | "github" | "music") => void;
  focusWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  isAppRunning: (type: 'terminal' | 'safari' | 'photos' | 'blog' | 'projects' | 'music') => boolean;
  isAppMinimized: (type: 'terminal' | 'safari' | 'photos' | 'blog' | 'projects' | 'music') => boolean;
}

export const useWindowStore = create<WindowState>((set, get) => ({
  windows: [],
  nextZIndex: 1,

  addWindow: (type) => {
    if (type === "github") {
      window.open('https://github.com/developer', '_blank');
      return;
    }

    const { windows, nextZIndex } = get();
    const existingWindow = windows.find((w) => w.type === type);
    
    if (existingWindow) {
      get().focusWindow(existingWindow.id);
      if (existingWindow.minimized) {
        get().toggleMinimize(existingWindow.id);
      }
      return;
    }

    const windowWidth = 900;
    const windowHeight = 600;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const newWindow: wType = {
      id: `${type}-${Date.now()}`,
      type,
      minimized: false,
      maximized: false,
      position: {
        x: (screenWidth - windowWidth) / 2,
        y: (screenHeight - windowHeight) / 2,
      },
      size: { width: windowWidth, height: windowHeight },
      zIndex: nextZIndex,
    };

    set({ 
      windows: [...windows, newWindow],
      nextZIndex: nextZIndex + 1
    });
  },

  focusWindow: (id) => {
    const { windows, nextZIndex } = get();
    const updatedWindows = windows
      .map((w) => ({
        ...w,
        zIndex: w.id === id ? nextZIndex : w.zIndex,
      }))
      .sort((a, b) => a.zIndex - b.zIndex);
    
    set({ 
      windows: updatedWindows,
      nextZIndex: nextZIndex + 1
    });
  },

  closeWindow: (id) => {
    const { windows } = get();
    set({ windows: windows.filter((w) => w.id !== id) });
  },

  toggleMinimize: (id) => {
    const { windows } = get();
    set({
      windows: windows.map((w) =>
        w.id === id ? { ...w, minimized: !w.minimized } : w
      )
    });
  },

  toggleMaximize: (id) => {
    const { windows } = get();
    set({
      windows: windows.map((w) => {
        if (w.id === id) {
          if (!w.maximized) {
            return {
              ...w,
              maximized: true,
              position: { x: 0, y: 0 },
              size: { width: window.innerWidth, height: window.innerHeight },
            };
          } else {
            return {
              ...w,
              maximized: false,
              position: {
                x: (window.innerWidth - 600) / 2,
                y: (window.innerHeight - 400) / 2,
              },
              size: { width: 600, height: 400 },
            };
          }
        }
        return w;
      })
    });
  },

  isAppRunning: (type) => {
    const { windows } = get();
    return windows.some(w => w.type === type && !w.minimized);
  },

  isAppMinimized: (type) => {
    const { windows } = get();
    return windows.some(w => w.type === type && w.minimized);
  },
}));
