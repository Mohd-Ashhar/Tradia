import { useEffect, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

export const FloatingElements = () => {
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const elements = [
    { size: 100, delay: 0, color: 'from-primary/20 to-accent/20' },
    { size: 150, delay: 1, color: 'from-accent/15 to-primary/15' },
    { size: 80, delay: 2, color: 'from-primary/10 to-accent/10' },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {elements.map((element, index) => (
        <div
          key={index}
          className={`absolute rounded-full bg-gradient-to-br ${element.color} blur-3xl transition-all duration-1000 ease-out animate-float-slow`}
          style={{
            width: element.size,
            height: element.size,
            left: mousePosition.x - element.size / 2,
            top: mousePosition.y - element.size / 2,
            animationDelay: `${element.delay}s`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
};
