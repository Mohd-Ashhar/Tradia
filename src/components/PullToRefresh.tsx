import { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh = ({ onRefresh, children }: PullToRefreshProps) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const threshold = 80;
  const maxPull = 120;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === 0 || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;

    if (distance > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(distance, maxPull));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
    setStartY(0);
  };

  const rotation = (pullDistance / maxPull) * 360;
  const scale = Math.min(pullDistance / threshold, 1);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* Pull to Refresh Indicator */}
      <div
        className="pointer-events-none fixed left-0 right-0 top-0 z-40 flex justify-center overflow-hidden transition-all duration-300"
        style={{
          height: `${pullDistance}px`,
          opacity: scale,
        }}
      >
        <div className="flex items-center justify-center">
          <div
            className={`rounded-full bg-gradient-to-r from-primary to-accent p-3 shadow-lg ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{
              transform: `rotate(${rotation}deg) scale(${scale})`,
            }}
          >
            <RefreshCw className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-300"
        style={{
          transform: `translateY(${isRefreshing ? threshold : pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
