'use client';

import { useState, useEffect, useRef } from 'react';
import type { Song, RepeatMode } from "../types/music";
import type { wType } from "../types/wType";
import { ALL_MUSIC, INITIAL_VOLUME } from "../utils/musicPlaylists";
import { useWindowStore } from "../stores/windowStore";

interface MusicProps {
  window: wType;
  startDrag: (event: React.MouseEvent, id: string, type: "move" | "resize") => void;
}

export default function Music({ window, startDrag }: MusicProps) {
  const [musicIndex, setMusicIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [volume, setVolume] = useState(INITIAL_VOLUME);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("shuffle");
  const [selectedGenre, setSelectedGenre] = useState('All');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { closeWindow, toggleMinimize, toggleMaximize } = useWindowStore();

  const genres = ['All', ...new Set(ALL_MUSIC.map(song => song.genre))];
  const filteredPlaylist = selectedGenre === 'All' 
    ? ALL_MUSIC 
    : ALL_MUSIC.filter(song => song.genre === selectedGenre);
  const currentSong = ALL_MUSIC[musicIndex];

  const getImagePath = (imageName: string): string => {
    return `/lib/assets/images/${imageName}`;
  };

  const getMusicPath = (musicName: string): string => {
    return `/lib/assets/mp3s/${musicName}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial volume
    audio.volume = volume / 100;

    const updateProgress = () => {
      const newProgress = (audio.currentTime / audio.duration) * 100;
      setProgress(newProgress);
      setCurrentTime(formatTime(audio.currentTime));
    };

    const setTotalDuration = () => {
      setDuration(formatTime(audio.duration));
    };

    const handleSongEnd = () => {
      nextSong();
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setTotalDuration);
    audio.addEventListener("ended", handleSongEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setTotalDuration);
      audio.removeEventListener("ended", handleSongEnd);
    };
  }, [musicIndex, volume]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    let newIndex = (musicIndex + 1) % ALL_MUSIC.length;
    while (!filteredPlaylist.includes(ALL_MUSIC[newIndex])) {
      newIndex = (newIndex + 1) % ALL_MUSIC.length;
    }
    setMusicIndex(newIndex);
  };

  const prevSong = () => {
    let newIndex = (musicIndex - 1 + ALL_MUSIC.length) % ALL_MUSIC.length;
    while (!filteredPlaylist.includes(ALL_MUSIC[newIndex])) {
      newIndex = (newIndex - 1 + ALL_MUSIC.length) % ALL_MUSIC.length;
    }
    setMusicIndex(newIndex);
  };

  const setProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    audio.currentTime = clickPosition * audio.duration;
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
    if (audio.muted) {
      setVolume(0);
    } else {
      setVolume(audio.volume * 100);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    audio.volume = newVolume / 100;
    setIsMuted(newVolume === 0);
  };

  const selectSong = (index: number) => {
    setMusicIndex(index);
    setIsPlaylistVisible(false);
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-red-500 to-pink-600 text-white flex flex-col">
      <audio
        ref={audioRef}
        src={getMusicPath(currentSong.src)}
      />
      
      {/* Window Header */}
      <div 
        className="h-8 bg-gray-800/50 backdrop-blur-sm flex items-center justify-between px-3 cursor-move"
        onMouseDown={(e) => startDrag(e, window.id, "move")}
      >
        <div className="flex space-x-2">
          <button 
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
            onClick={() => closeWindow(window.id)}
          />
          <button 
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600"
            onClick={() => toggleMinimize(window.id)}
          />
          <button 
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600"
            onClick={() => toggleMaximize(window.id)}
          />
        </div>
        <span className="text-sm font-medium">Music</span>
        <div className="w-12" />
      </div>

      {/* Music Player Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {!isPlaylistVisible ? (
          // Main Player View
          <div className="flex-1 flex flex-col p-6">
            {/* Header with Genre Selector */}
            <div className="flex items-center justify-between mb-6">
              <select 
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-sm text-white border-none outline-none"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre} className="text-black">
                    {genre}
                  </option>
                ))}
              </select>
              <button 
                className="text-white/80 hover:text-white transition-colors"
                onClick={() => setIsPlaylistVisible(true)}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Album Art */}
            <div className="flex-1 flex flex-col items-center justify-center mb-6">
              <div className="w-48 h-48 bg-black/20 rounded-2xl overflow-hidden shadow-2xl mb-4">
                <img 
                  src={getImagePath(currentSong.img)} 
                  alt={currentSong.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 truncate max-w-xs">{currentSong.name}</h2>
                <p className="text-lg text-white/80 truncate max-w-xs">{currentSong.artist}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div 
                className="w-full h-2 bg-white/20 rounded-full cursor-pointer"
                onClick={setProgressClick}
              >
                <div 
                  className="h-full bg-white rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-white/80 mt-1">
                <span>{currentTime}</span>
                <span>{duration}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-6 mb-6">
              <button 
                onClick={prevSong}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                </svg>
              </button>
              
              <button 
                onClick={togglePlay}
                className="bg-white text-red-500 rounded-full p-3 hover:bg-white/90 transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              <button 
                onClick={nextSong}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                </svg>
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-3">
              <button onClick={toggleMute} className="text-white/80 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  {isMuted ? (
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.797L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-3.797A1 1 0 019.383 3.076zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.797L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-3.797A1 1 0 019.383 3.076zM12 6a1 1 0 011 1v6a1 1 0 11-2 0V7a1 1 0 011-1z" clipRule="evenodd" />
                  )}
                </svg>
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm text-white/80 w-8">{volume}</span>
            </div>
          </div>
        ) : (
          // Playlist View
          <div className="flex-1 flex flex-col p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Playlist</h3>
              <button 
                className="text-white/80 hover:text-white"
                onClick={() => setIsPlaylistVisible(false)}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredPlaylist.map((song, index) => {
                const actualIndex = ALL_MUSIC.indexOf(song);
                return (
                  <div
                    key={actualIndex}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      actualIndex === musicIndex ? 'bg-white/20' : 'hover:bg-white/10'
                    }`}
                    onClick={() => selectSong(actualIndex)}
                  >
                    <div className="w-10 h-10 bg-white/20 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={getImagePath(song.img)} 
                        alt={song.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{song.name}</h4>
                      <p className="text-sm text-white/70 truncate">{song.artist}</p>
                    </div>
                    <span className="text-xs text-white/60">{song.genre}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
