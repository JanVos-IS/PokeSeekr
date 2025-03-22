import { useState, useRef, useEffect } from 'react';

interface Card3DEffectProps {
  imageUrl: string;
  altText?: string;
  averageColor?: [number, number, number] | null;
  className?: string;
}

export function Card3DEffect({ imageUrl, altText = 'Card image', averageColor = null, className = '' }: Card3DEffectProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const lastMoveTime = useRef(0);

  // Reset position when component props change
  useEffect(() => {
    setRotateX(0);
    setRotateY(0);
    setIsHovering(false);
    lastMoveTime.current = 0;
  }, [imageUrl]);

  const THROTTLE_MS = 16; // Throttle to ~60fps

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardContainerRef.current || !isHovering) return;

    const now = Date.now();
    // Throttle updates to maintain performance
    if (now - lastMoveTime.current < THROTTLE_MS) return;
    lastMoveTime.current = now;

    const rect = cardContainerRef.current.getBoundingClientRect();

    // Find the middle of the element
    const middleX = rect.width / 2;
    const middleY = rect.height / 2;

    // Get mouse position relative to the card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Get offset from middle as a percentage and tone it down
    const offsetX = ((x - middleX) / middleX) * 35; // Reduced to 20 for less extreme rotation
    const offsetY = ((y - middleY) / middleY) * 35;

    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      setRotateY(offsetX);
      setRotateX(-1 * offsetY);
    });
  };

  // Calculate lighting values based on mouse position and rotation
  const shineX = 50 + rotateY * 3;
  const shineY = 50 + rotateX * 3;
  const gradientRotation = 135 + rotateY;
  const gradientPositionX = 50 + rotateY * 3;
  const gradientPositionY = 50 + rotateX * 3;

  // Convert average color from [0-1] range to RGB values
  const rgbColor = averageColor ?
    `rgb(${Math.round(averageColor[0] * 255)}, ${Math.round(averageColor[1] * 255)}, ${Math.round(averageColor[2] * 255)})` :
    'transparent';

  return (
    <div
      ref={cardContainerRef}
      className={`flex items-center justify-center overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setRotateX(0);
        setRotateY(0);
      }}
      style={{
        perspective: '1000px',
        background: averageColor ? `linear-gradient(to bottom, ${rgbColor}22, transparent)` : 'transparent',
      }}
    >
      {/* Card Wrapper */}
      <div
        className="relative max-h-full max-w-full transform-gpu"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
          transition: isHovering ? 'transform 0.1s cubic-bezier(0.33, 1, 0.68, 1)' : 'transform 0.5s ease-out',
          willChange: 'transform',
        }}
      >
        {/* Card Image */}
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-full object-contain shadow-xl rounded-lg"
        />

        {/* Primary shine effect overlay */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)`,
            mixBlendMode: 'overlay',
            opacity: isHovering ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        />

        {/* Secondary edge highlight */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            boxShadow: `inset 0 0 20px 5px rgba(255,255,255,0.3), 0 0 10px 2px rgba(255,255,255,0.2)`,
            opacity: isHovering ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        />

        {/* Holographic effect */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden"
          style={{
            opacity: isHovering ? 0.5 : 0,
            transition: 'opacity 0.2s ease',
            backgroundImage: `linear-gradient(
              ${gradientRotation}deg, 
              rgba(255,0,0,0) 0%, 
              rgba(255,0,0,0.2) 25%, 
              rgba(0,255,0,0.2) 50%, 
              rgba(0,0,255,0.2) 75%, 
              rgba(255,0,0,0) 100%
            )`,
            backgroundSize: '400% 400%',
            backgroundPosition: `${gradientPositionX}% ${gradientPositionY}%`,
            mixBlendMode: 'color-dodge',
          }}
        />
      </div>
    </div>
  );
} 