import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isInside, setIsInside] = useState(false);

  useEffect(() => {
    // Only enable on desktop with fine pointer
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      setIsInside(true);
      setMousePosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const onMouseLeave = () => {
      setIsInside(false);
    };

    const onMouseEnter = () => {
      setIsInside(true);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Dynamic Background Flashlight / Spotlight Illumination Beam (Reveals the background cleanly) */}
      <div
        className={`pointer-events-none fixed inset-0 z-0 transition-opacity duration-500 ease-out ${
          isInside ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `
            radial-gradient(280px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.16) 0%, rgba(14, 165, 233, 0.06) 50%, transparent 100%),
            radial-gradient(${isHovered ? '680px' : '520px'} circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.04) 45%, transparent 75%)
          `,
        }}
      />

      {/* Cyber Grid Masked Flashlight Revealer (Highlights the cyber grid directly under mouse cursor) */}
      <div
        className={`pointer-events-none fixed inset-0 z-[1] transition-opacity duration-300 ${
          isInside ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.14) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.14) 1px, transparent 1px)
          `,
          backgroundSize: '3.5rem 3.5rem',
          maskImage: `radial-gradient(360px circle at ${mousePosition.x}px ${mousePosition.y}px, black 0%, rgba(0,0,0,0.45) 50%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(360px circle at ${mousePosition.x}px ${mousePosition.y}px, black 0%, rgba(0,0,0,0.45) 50%, transparent 100%)`,
        }}
      />

      {/* Sleek, responsive cursor reticle directly on the pointer (No strange lagging ghost circles) */}
      <div
        className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-100 ease-out"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          width: isHovered ? '28px' : '18px',
          height: isHovered ? '28px' : '18px',
          opacity: isInside ? 1 : 0,
        }}
      >
        <div
          className={`w-full h-full rounded-full border transition-all duration-150 ${
            isHovered
              ? 'border-emerald-400/80 bg-emerald-400/10 scale-110 shadow-[0_0_10px_rgba(52,211,153,0.4)]'
              : 'border-cyan-400/50 bg-cyan-400/5'
          }`}
        />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.9)]" />
      </div>
    </>
  );
}
