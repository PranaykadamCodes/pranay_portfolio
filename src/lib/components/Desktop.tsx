'use client';

import { useState, useEffect } from 'react';
import TopBar from './TopBar';

export default function Desktop() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden font-sf">
      <TopBar />
      <div className="p-4 flex flex-col items-start">
      </div>
    </div>
  );
}
