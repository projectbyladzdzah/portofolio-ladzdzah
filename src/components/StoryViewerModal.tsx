import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, Pause, ChevronLeft, ChevronRight, MapPin, CheckCircle2 } from 'lucide-react';
import { BiographyGalleryItem } from '../types/portfolio';

interface StoryViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: BiographyGalleryItem[];
  initialIndex?: number;
  driverPhoto?: string;
  driverName?: string;
}

const STORY_DURATION = 5000; // 5 seconds per story

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  isOpen,
  onClose,
  stories,
  initialIndex = 0,
  driverPhoto = 'assets/driver-portrait.png',
  driverName = 'Ladzdzah Hanan'
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setProgress(0);
      setIsPaused(false);
    }
  }, [isOpen, initialIndex]);

  const goToNextStory = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      // Loop or close when finished
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goToPrevStory = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    } else {
      // Reset current progress
      setProgress(0);
    }
  }, [currentIndex]);

  // Progress Bar timer (smooth 60fps / 50ms interval)
  useEffect(() => {
    if (!isOpen || isPaused || stories.length === 0) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepMs = 50;
    const increment = (stepMs / STORY_DURATION) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNextStory();
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isOpen, isPaused, currentIndex, goToNextStory, stories.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        goToNextStory();
      } else if (e.key === 'ArrowLeft') {
        goToPrevStory();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToNextStory, goToPrevStory, onClose]);

  if (!isOpen || stories.length === 0) return null;

  const currentStory = stories[currentIndex] || stories[0];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-0 sm:p-4 select-none animate-fadeIn"
      onClick={onClose}
    >
      {/* Story Phone-sized Wrapper */}
      <div
        className="relative w-full h-full sm:h-[88vh] sm:max-h-[820px] sm:max-w-[440px] bg-black sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Blurred Image Glow */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-2xl scale-125 pointer-events-none"
          style={{ backgroundImage: `url(${currentStory.image})` }}
        />

        {/* 1. TOP PROGRESS BARS (Instagram Story Segments) */}
        <div className="absolute top-0 left-0 right-0 z-30 pt-3 px-3.5 pb-2 flex gap-1.5 pointer-events-none">
          {stories.map((_, idx) => {
            let fillWidth = '0%';
            if (idx < currentIndex) {
              fillWidth = '100%';
            } else if (idx === currentIndex) {
              fillWidth = `${progress}%`;
            }

            return (
              <div
                key={idx}
                className="flex-1 h-1 bg-white/25 rounded-full overflow-hidden backdrop-blur-sm shadow-sm"
              >
                <div
                  className="h-full bg-gradient-to-r from-f1-red to-white transition-all ease-linear"
                  style={{ width: fillWidth }}
                />
              </div>
            );
          })}
        </div>

        {/* 2. TOP HEADER (Avatar, Name, Verified Badge, Controls) */}
        <div className="absolute top-6 left-0 right-0 z-30 px-3.5 py-1.5 flex items-center justify-between pointer-events-auto">
          {/* User Profile */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={driverPhoto}
                alt={driverName}
                className="w-9 h-9 rounded-full object-cover border-2 border-f1-red p-0.5 shadow-md bg-[#16161d]"
                onError={(e) => {
                  e.currentTarget.src = 'assets/driver-portrait.png';
                }}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-f1-red rounded-full border border-black flex items-center justify-center text-[7px] font-f1 font-black text-white">
                #24
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-f1 font-bold text-white text-xs tracking-wider">
                  {driverName}
                </span>
                <CheckCircle2 size={13} className="text-f1-red fill-f1-red text-black" />
              </div>
              <span className="text-[10px] text-white/70 block font-mono">
                {currentStory.timestamp || 'Engineering Milestone'}
              </span>
            </div>
          </div>

          {/* Controls: Pause/Play & Close */}
          <div className="flex items-center gap-1 text-white">
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? 'Resume Story' : 'Pause Story'}
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-white/20 flex items-center justify-center transition backdrop-blur-md"
            >
              {isPaused ? <Play size={14} className="ml-0.5" /> : <Pause size={14} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Story"
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-f1-red flex items-center justify-center transition backdrop-blur-md"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 3. MAIN STORY IMAGE CONTAINER */}
        <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden bg-black/60">
          <img
            key={currentStory.id || currentIndex}
            src={currentStory.image}
            alt={currentStory.title}
            className="w-full h-full object-cover object-center select-none pointer-events-none transition-transform duration-700 ease-out"
            onError={(e) => {
              e.currentTarget.src = 'assets/driver-f1-banner.webp';
            }}
          />

          {/* TAP INTERACTION ZONES */}
          {/* Left Tap Zone (Previous Story) */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[35%] z-20 cursor-pointer"
            onClick={goToPrevStory}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          />

          {/* Right Tap Zone (Next Story) */}
          <div
            className="absolute right-0 top-0 bottom-0 w-[65%] z-20 cursor-pointer"
            onClick={goToNextStory}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          />

          {/* Visual Navigation Pill Chevrons (for Desktop Mouse Users) */}
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevStory();
              }}
              className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/50 hover:bg-f1-red text-white items-center justify-center backdrop-blur-md transition shadow-lg"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {currentIndex < stories.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToNextStory();
              }}
              className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/50 hover:bg-f1-red text-white items-center justify-center backdrop-blur-md transition shadow-lg"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        {/* 4. BOTTOM CAPTION & METADATA (Instagram / F1 Editorial Style) */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-auto space-y-2">
          {currentStory.location && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-f1-red/20 border border-f1-red/40 text-white text-[10px] font-f1 font-bold tracking-wider backdrop-blur-md">
              <MapPin size={11} className="text-f1-red" />
              <span>{currentStory.location}</span>
            </div>
          )}

          <div>
            <h4 className="font-f1 font-black italic text-white text-base sm:text-lg tracking-wide uppercase leading-tight drop-shadow-md">
              {currentStory.title}
            </h4>
            <p className="text-xs text-white/90 font-sans mt-1 leading-relaxed drop-shadow">
              {currentStory.caption}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] font-f1 text-white/60">
            <span className="uppercase tracking-widest text-f1-red font-bold">
              Professional Milestones & Field Highlights
            </span>
            <span className="font-mono">
              {currentIndex + 1} / {stories.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
