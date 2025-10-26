import { useState, useRef } from 'react';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ProductImageViewerProps {
  images: string[];
  productName: string;
}

export const ProductImageViewer = ({ images, productName }: ProductImageViewerProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="sticky top-24 space-y-4">
      {/* Main Image Viewer */}
      <div
        ref={imageRef}
        className="group relative aspect-square overflow-hidden rounded-2xl bg-muted"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <img
          src={images[currentImageIndex]}
          alt={`${productName} - View ${currentImageIndex + 1}`}
          className="h-full w-full object-cover transition-transform duration-500"
          style={{
            transform: isZoomed 
              ? `scale(2) translate(${(50 - mousePosition.x) / 2}%, ${(50 - mousePosition.y) / 2}%)`
              : 'scale(1)',
            cursor: isZoomed ? 'zoom-out' : 'zoom-in',
          }}
        />

        {/* Zoom Indicator */}
        <div
          className={cn(
            "absolute right-4 top-4 flex items-center gap-2 rounded-full bg-background/80 px-3 py-2 text-sm font-medium backdrop-blur-sm transition-opacity",
            isZoomed ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <ZoomIn className="h-4 w-4" />
          {isZoomed ? 'Click to zoom out' : 'Hover to zoom'}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 glass-morphism hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 glass-morphism hover:scale-110"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-4 py-2 text-sm font-medium backdrop-blur-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-lg transition-all",
              currentImageIndex === index
                ? "ring-2 ring-primary ring-offset-2"
                : "opacity-60 hover:opacity-100"
            )}
          >
            <img
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              className="h-full w-full object-cover transition-transform group-hover:scale-110"
            />
          </button>
        ))}
      </div>

      {/* 360 View Indicator */}
      <div className="glass-morphism rounded-xl p-4 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span className="text-sm font-medium">360° Interactive View</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Navigate with arrows or hover to zoom
        </p>
      </div>
    </div>
  );
};
