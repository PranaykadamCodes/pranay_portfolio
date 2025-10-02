'use client';

import { useState } from 'react';
import Image from 'next/image';
import photos from '@/lib/assets/icons/photos.avif'; 
import terminal from '@/lib/assets/icons/terminal.avif';
import safari from '@/lib/assets/icons/safari.png';
import projects from '@/lib/assets/icons/projects.png';
import blog from '@/lib/assets/icons/blog.png';
import github from '@/lib/assets/icons/github.png';

interface LaunchpadProps {
  isOpen: boolean;
  onLaunchApp: (appId: string) => void;
  onCloseLaunchpad: () => void;
}

export default function Launchpad({ isOpen, onLaunchApp, onCloseLaunchpad }: LaunchpadProps) {
  const [searchText, setSearchText] = useState('');

  const apps = [
    { id: 'photos', name: 'Photos', icon: photos },
    { id: 'terminal', name: 'Terminal', icon: terminal },
    { id: 'safari', name: 'Safari', icon: safari },
    { id: 'projects', name: 'Projects', icon: projects },
    { id: 'blog', name: 'Blog', icon: blog },
    { id: 'github', name: 'Github', icon: github },
    { id: 'linkedin', name: 'LinkedIn', icon: null }
  ];

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const launchApp = (appId: string) => {
    onLaunchApp(appId);
    onCloseLaunchpad();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-2xl font-sf transition-opacity duration-200"
      onClick={onCloseLaunchpad}
    >
      <div className="w-full h-full flex flex-col items-center pt-8">
        <div 
          className="w-64 h-8 bg-white/10 rounded-md flex items-center px-3 mb-8 transition-all duration-300 focus-within:bg-white/20 focus-within:ring-1 focus-within:ring-white/30"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center w-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-white/50 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-transparent text-white placeholder-white/50 outline-none font-light text-sm"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-x-8 gap-y-12 p-8 max-w-7xl mx-auto">
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <div 
                key={app.id}
                className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  launchApp(app.id);
                }}
              >
                {app.id === 'linkedin' ? (
                  <div className="w-20 h-20 mb-2 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                ) : (
                  <Image src={app.icon!} alt={app.name} className="w-20 h-20 mb-2 object-contain" />
                )}
                <span className="text-white text-sm text-center font-light">{app.name}</span>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-white/70 font-light text-xl">
              No Results
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
