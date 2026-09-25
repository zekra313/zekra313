import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronRight, ChevronLeft, Sparkles, ArrowLeft } from 'lucide-react';

interface TopAnnouncementBannerProps {
  onBannerActionClick?: (link?: string) => void;
}

export const TopAnnouncementBanner: React.FC<TopAnnouncementBannerProps> = ({ onBannerActionClick }) => {
  const { advertisements } = useStore();
  const activeAds = advertisements
    .filter(ad => ad.isActive)
    .sort((a, b) => a.order - b.order);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (activeAds.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeAds.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [activeAds.length, isPaused]);

  if (activeAds.length === 0) return null;

  const currentAd = activeAds[currentIndex] || activeAds[0];

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % activeAds.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + activeAds.length) % activeAds.length);
  };

  return (
    <div
      className="relative text-white overflow-hidden select-none border-b border-white/10"
      style={{ backgroundColor: 'var(--primary-color, #1e3a2b)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4 text-xs md:text-sm">
        {/* Navigation arrows (desktop) */}
        {activeAds.length > 1 && (
          <button
            onClick={handleNext}
            aria-label="الإعلان التالي"
            className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Center Animated Content */}
        <div className="flex-1 flex items-center justify-center text-center gap-2 md:gap-3 flex-wrap transition-all duration-300">
          {currentAd.badgeText && (
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded text-amber-900 bg-amber-400"
            >
              {currentAd.badgeText}
            </span>
          )}

          <span className="font-semibold tracking-wide">
            {currentAd.title}
          </span>

          {currentAd.subtitle && (
            <span className="hidden md:inline text-white/80 font-normal">
              — {currentAd.subtitle}
            </span>
          )}

          {currentAd.buttonText && (
            <button
              onClick={() => onBannerActionClick?.(currentAd.linkUrl)}
              className="inline-flex items-center gap-1 font-medium underline underline-offset-4 hover:text-amber-300 transition-colors text-xs"
            >
              <span>{currentAd.buttonText}</span>
              <ArrowLeft className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Navigation arrows (desktop) & Slide indicators */}
        <div className="flex items-center gap-2">
          {activeAds.length > 1 && (
            <>
              <div className="flex gap-1">
                {activeAds.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handlePrev}
                aria-label="الإعلان السابق"
                className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
