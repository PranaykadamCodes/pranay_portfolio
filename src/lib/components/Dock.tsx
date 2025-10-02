'use client';

import { useState, useEffect } from 'react';
import { useWindowStore } from '../stores/windowStore';
import Image from 'next/image';

import launchpad from '@/lib/assets/icons/launchpad.png';
import terminal from '@/lib/assets/icons/terminal.avif';
import safari from '@/lib/assets/icons/safari.png';
import photos from '@/lib/assets/icons/photos.avif';
import blog from '@/lib/assets/icons/blog.png';
import projects from '@/lib/assets/icons/projects.png';
import github from '@/lib/assets/icons/github.png';
import music from '@/lib/assets/icons/music.svg';

interface DockProps {
  isAppRunning: (type: 'terminal' | 'safari' | 'photos' | 'blog' | 'projects' | 'music') => boolean;
  isAppMinimized: (type: 'terminal' | 'safari' | 'photos' | 'blog' | 'projects' | 'music') => boolean;
  addWindow: (type: 'terminal' | 'safari' | 'photos' | 'blog' | 'projects' | 'music') => void;
  onOpenLaunchpad: () => void;
}

export default function Dock({ isAppRunning, isAppMinimized, addWindow, onOpenLaunchpad }: DockProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const { windows } = useWindowStore();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleDockClick = (appType: string) => {
    const isLargeScreen = windowWidth >= 1024;
    
    if (!isLargeScreen && appType !== 'github' && appType !== 'linkedin') {
      setShowPopup(true);
    } else {
      if (appType === 'launchpad') {
        onOpenLaunchpad();
      } else if (appType === 'github') {
        window.open('https://github.com/developer', '_blank');
      } else if (appType === 'linkedin') {
        window.open('https://www.linkedin.com/in/your-profile', '_blank');
      } else {
        addWindow(appType as 'terminal' | 'safari' | 'photos' | 'blog' | 'projects' | 'music');
      }
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const terminalWindow = windows.find(w => w.type === 'terminal');
  const safariWindow = windows.find(w => w.type === 'safari');
  const photosWindow = windows.find(w => w.type === 'photos');
  const blogWindow = windows.find(w => w.type === 'blog');
  const projectsWindow = windows.find(w => w.type === 'projects');
  const musicWindow = windows.find(w => w.type === 'music');
  const isLargeScreen = windowWidth >= 1024;

  return (
    <>
      <div className="dock fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full flex space-x-4 items-end h-[68px]">
        <div className="dock-item" onClick={() => handleDockClick('launchpad')}>
          <Image src={launchpad} alt="Launchpad" className="h-12 w-12" />
        </div>
        
        <div className="dock-item" onClick={() => handleDockClick("terminal")}>
          <Image src={terminal} alt="Terminal" className="h-12 w-12" />
          {terminalWindow && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
          )}
        </div>
        
        {isLargeScreen && (
          <div className="dock-item" onClick={() => handleDockClick("safari")}>
            <Image src={safari} alt="safari" className="h-12 w-12" />
            {safariWindow && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </div>
        )}

        <div className="dock-item" onClick={() => handleDockClick("photos")}>
          <Image src={photos} alt="Photos" className="h-12 w-12" />
          {photosWindow && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
          )}
        </div>

        {isLargeScreen && (
          <div className="dock-item" onClick={() => handleDockClick("blog")}>
            <Image src={blog} alt="Blog" className="h-12 w-12" />
            {blogWindow && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </div>
        )}

        <div className="dock-item" onClick={() => handleDockClick("projects")}>
          <Image src={projects} alt="Projects" className="h-12 w-12" />
          {projectsWindow && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
          )}
        </div>

        <div className="dock-item" onClick={() => handleDockClick("music")}>
          <Image src={music} alt="Music" className="h-12 w-12" />
          {musicWindow && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
          )}
        </div>

        <div className="dock-item" onClick={() => handleDockClick("github")}>
          <Image src={github} alt="Github" className="h-12 w-12" />
        </div>

        <div className="dock-item" onClick={() => handleDockClick("linkedin")}>
          <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm mx-auto">
            <h2 className="text-lg font-semibold mb-4">Limited Features</h2>
            <p className="mb-4">For full feature access, please use a desktop device.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .dock-item {
          @apply w-12 h-12 rounded-full flex items-center justify-center text-white cursor-pointer relative;
          transition: all 0.2s ease;
        }

        .dock:hover .dock-item {
          transform: translateY(0px) scale(1);
        }

        .dock .dock-item:hover {
          transform: translateY(-10px) scale(1.2);
        }

        .dock:hover .dock-item:hover + .dock-item {
          transform: translateY(-5px) scale(1.1);
        }

        .dock:hover .dock-item:hover + .dock-item + .dock-item {
          transform: translateY(-2px) scale(1.05);
        }
      `}</style>
    </>
  );
}
