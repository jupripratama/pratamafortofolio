import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';

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
      {/* Dynamic Background Flashlight / Spotlight Illumination Beam (Follows Mouse) */}
      <div
        className={`pointer-events-none fixed inset-0 z-0 transition-opacity duration-700 ease-out ${
          isInside ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `
            radial-gradient(220px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.16) 0%, rgba(14, 165, 233, 0.08) 50%, transparent 100%),
            radial-gradient(${isHovered ? '700px' : '550px'} circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.05) 45%, transparent 75%)
          `,
        }}
      />

      {/* Cyber Grid Masked Flashlight Revealer (Highlights the cyber grid under the light) */}
      <div
        className={`pointer-events-none fixed inset-0 z-[1] transition-opacity duration-500 ${
          isInside ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '3.5rem 3.5rem',
          maskImage: `radial-gradient(380px circle at ${mousePosition.x}px ${mousePosition.y}px, black 0%, rgba(0,0,0,0.5) 50%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(380px circle at ${mousePosition.x}px ${mousePosition.y}px, black 0%, rgba(0,0,0,0.5) 50%, transparent 100%)`,
        }}
      />

      {/* Small Precision Center Cursor Dot */}
      <div
        className="pointer-events-none fixed z-50 w-2 h-2 rounded-full bg-cyan-400 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(6,182,212,1)]"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          opacity: isInside ? 1 : 0,
        }}
      />

      {/* Smooth Lagging Glow Ring */}
      <motion.div
        className="pointer-events-none fixed z-50 rounded-full border border-cyan-400/50 bg-cyan-500/10 -translate-x-1/2 -translate-y-1/2 backdrop-blur-[1px]"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          width: isHovered ? 48 : 28,
          height: isHovered ? 48 : 28,
          borderColor: isHovered ? 'rgba(52, 211, 153, 0.9)' : 'rgba(6, 182, 212, 0.5)',
          opacity: isInside ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          damping: 28,
          stiffness: 350,
          mass: 0.5,
        }}
      />
    </>
  );
}
