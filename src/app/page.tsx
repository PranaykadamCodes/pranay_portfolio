'use client';

import { useState, useEffect } from 'react';
import Desktop from '@/lib/components/Desktop';
import Dock from '@/lib/components/Dock';
import Window from '@/lib/components/Window';
import Launchpad from '@/lib/components/Launchpad';
import { useWindowStore } from '@/lib/stores/windowStore';

export default function Home() {
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
  const { windows, addWindow, isAppRunning, isAppMinimized } = useWindowStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = "Home | Your Portfolio";
      if (window.innerWidth >= 768) {
        addWindow("terminal");
      }
    }
  }, [addWindow]);

  const handleOpenLaunchpad = () => {
    setIsLaunchpadOpen(true);
  };

  const handleLaunchApp = (appType: string) => {
    addWindow(appType as "terminal" | "safari" | "photos" | "blog" | "projects" | "github" | "music");
    setIsLaunchpadOpen(false);
  };

  const [wallpapers, setWallpapers] = useState<string[]>([]);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/wallpapers');
        const data = await res.json();
        if (Array.isArray(data.wallpapers) && data.wallpapers.length) {
          setWallpapers(data.wallpapers);
          setWallpaperIndex(0);
        } else {
          setWallpapers(['/wallpapers/wallpaper-1.png', '/wallpapers/wallpaper-2.png']);
        }
      } catch (e) {
        setWallpapers(['/wallpapers/wallpaper-1.png', '/wallpapers/wallpaper-2.png']);
      }
    };
    load();
  }, []);

  const nextWallpaper = () => setWallpaperIndex((prev) => (prev + 1) % wallpapers.length);
  const prevWallpaper = () => setWallpaperIndex((prev) => (prev - 1 + wallpapers.length) % wallpapers.length);

  return (
    <main className="min-h-screen font-mono relative overflow-hidden">
      {/* Wallpaper Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: wallpapers.length ? `url(${wallpapers[wallpaperIndex]})` : undefined }}
      />

      <div className="relative z-20">
        <Desktop />
      
        {windows.map((window) => (
          <Window key={window.id} window={window} />
        ))}
        
        <Dock 
          isAppRunning={isAppRunning} 
          isAppMinimized={isAppMinimized} 
          addWindow={addWindow} 
          onOpenLaunchpad={handleOpenLaunchpad} 
        />
        
        <Launchpad 
          isOpen={isLaunchpadOpen} 
          onLaunchApp={handleLaunchApp} 
          onCloseLaunchpad={() => setIsLaunchpadOpen(false)} 
        />

        {/* Wallpaper Switcher */}
        {wallpapers.length > 1 && (
          <div className="fixed bottom-6 right-6 z-30 flex items-center space-x-2 bg-black/40 text-white backdrop-blur-md px-3 py-2 rounded-full border border-white/20">
            <button onClick={prevWallpaper} className="px-2 py-1 hover:text-blue-200">Prev</button>
            <div className="text-xs opacity-80">{wallpaperIndex + 1}/{wallpapers.length}</div>
            <button onClick={nextWallpaper} className="px-2 py-1 hover:text-blue-200">Next</button>
          </div>
        )}
      </div>
    </main>
  );
}