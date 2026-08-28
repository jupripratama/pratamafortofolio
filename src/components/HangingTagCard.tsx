import React, { useEffect, useRef, useCallback } from 'react';
import { ProfileSettings } from '../types';
import { soundFx } from '../lib/audio';
import { 
  MapPin, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  Send,
  RotateCw
} from 'lucide-react';

interface HangingTagCardProps {
  profile: ProfileSettings;
  onOpenHireModal?: () => void;
  isReady?: boolean;
}

export function HangingTagCard({ profile, onOpenHireModal, isReady = true }: HangingTagCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Full 6-DOF Physical Simulation State for Tag Card & Ball Chain
  const stateRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    angle: 0,          // Z-axis pendulum roll angle (degrees, follows string line)
    angularVel: 0,     // Z-axis angular velocity (deg/s)
    pitch: 0,          // X-axis 3D pitch tilt (degrees, forward/backward tilt from dragging & air)
    pitchVel: 0,
    yaw: 0,            // Y-axis 3D yaw tilt (degrees, left/right card twist)
    yawVel: 0,
    flipAngle: 0,      // Controlled 180° flip angle (0 deg = Front, 180 deg = Back)
    flipTarget: 0,     // Target face (0 or 180)
    flipVel: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    cardStartX: 0,
    cardStartY: 0,
    cardStartPitch: 0,
    cardStartYaw: 0,
    dragDist: 0,
    motionIntensity: 0, // 0 = rest (no glare), 1 = active movement (specular glare active)
    lastTime: performance.now(),
    hasSnappedOnce: false, // Tracks the initial landing bounce snap
    lastSnapTime: 0,
  });

  // Render state for React DOM & SVG
  const [renderState, setRenderState] = React.useState({
    x: 0,
    y: 0,
    angle: 0,
    pitch: 0,
    yaw: 0,
    flipAngle: 0,
    motionIntensity: 0,
  });

  // Responsive device detector (isDesktop >= 1024px)
  const [isDesktop, setIsDesktop] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lanyard Physical Geometry:
  // Desktop/Web: Hangs dramatically from the ceiling (L0 = 280px, Anchor Y = -218px)
  // Mobile/Tablet: Sleek, compact chain staying below info/social icons (L0 = 150px, Anchor Y = -88px)
  const L0 = isDesktop ? 280 : 150;
  const gravity = 1800; // px/s^2 natural gravity

  // Ultra-Natural 3D Physics Engine with Continuous Dynamic Pendulum Math
  const updatePhysics = useCallback((currentTime: number) => {
    const s = stateRef.current;
    
    // Delta-time clamped to avoid numerical spikes
    const rawDt = Math.min(0.032, Math.max(0.001, (currentTime - s.lastTime) / 1000));
    s.lastTime = currentTime;

    // Smooth critically-damped spring for deliberate face flip (0 deg <-> 180 deg)
    const flipError = s.flipTarget - s.flipAngle;
    const flipSpringK = 190;
    const flipDamping = 0.86;
    s.flipVel = (s.flipVel + flipError * flipSpringK * rawDt) * Math.pow(flipDamping, rawDt * 60);
    s.flipAngle += s.flipVel * rawDt;

    if (!s.isDragging) {
      // 120Hz sub-stepping for buttery-smooth trajectory without stutter
      const fixedDt = 1 / 120;
      const steps = Math.min(6, Math.max(1, Math.round(rawDt / fixedDt)));
      const dt = rawDt / steps;

      for (let step = 0; step < steps; step++) {
        // Anchor is at (0, -L0) relative to rest center (0, 0)
        const dx = s.x;
        const dy = s.y + L0;
        const r = Math.hypot(dx, dy);

        // Unit vector pointing from anchor to card
        const nx = r > 0.0001 ? dx / r : 0;
        const ny = r > 0.0001 ? dy / r : 1;
        const vr = s.vx * nx + s.vy * ny;

        // Smooth tension force when cord extends past L0 (continuous spring-damper model)
        let tensionForce = 0;
        if (r > L0) {
          const stretch = r - L0;
          const kSpring = 2600; // Natural firm chain tension
          const cDamping = 32;   // Critical damping to smoothly absorb stretch
          tensionForce = kSpring * stretch + (vr > 0 ? cDamping * vr : cDamping * 0.3 * vr);

          // Play snap sound on first catch of the drop
          if (!s.hasSnappedOnce && vr > 140 && (performance.now() - s.lastSnapTime > 250)) {
            s.hasSnappedOnce = true;
            s.lastSnapTime = performance.now();
            soundFx.playSnap(Math.min(1.0, vr / 400));
          }
        }

        // Net accelerations: Gravity + Cord Tension
        const ax = -tensionForce * nx;
        const ay = gravity - tensionForce * ny;

        // Semi-implicit Euler integration with natural air & hinge damping
        s.vx = (s.vx + ax * dt) * Math.pow(0.990, dt * 60);
        s.vy = (s.vy + ay * dt) * Math.pow(0.990, dt * 60);

        // Position integration
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        // Card Orientation: Natural Gravitational Self-Leveling
        // A real ID card on a swivel hinge stays mostly upright, with gentle inertial lag (max +/- 8 deg)
        const targetAngle = -Math.max(-8, Math.min(8, s.vx * 0.016));
        const torqueAngle = (targetAngle - s.angle) * 75;
        s.angularVel = (s.angularVel + torqueAngle * dt) * Math.pow(0.88, dt * 60);
        s.angle += s.angularVel * dt;

        // Dynamic 3D Pitch (gentle aerodynamic tilt during vertical swing)
        const targetPitch = Math.max(-8, Math.min(8, s.vy * 0.010));
        const torquePitch = (targetPitch - s.pitch) * 65;
        s.pitchVel = (s.pitchVel + torquePitch * dt) * Math.pow(0.86, dt * 60);
        s.pitch += s.pitchVel * dt;

        // Dynamic 3D Yaw (subtle natural twist)
        const targetYaw = Math.max(-6, Math.min(6, s.vx * 0.010));
        const torqueYaw = (targetYaw - s.yaw) * 60;
        s.yawVel = (s.yawVel + torqueYaw * dt) * Math.pow(0.86, dt * 60);
        s.yaw += s.yawVel * dt;
      }

      // Clean rest condition check to save battery & CPU when stationary
      if (
        Math.abs(s.x) < 0.15 &&
        Math.abs(s.y) < 0.15 &&
        Math.abs(s.vx) < 0.3 &&
        Math.abs(s.vy) < 0.3 &&
        Math.abs(s.angle) < 0.1 &&
        Math.abs(s.angularVel) < 0.3 &&
        Math.abs(s.pitch) < 0.1 &&
        Math.abs(s.pitchVel) < 0.3 &&
        Math.abs(s.yaw) < 0.1 &&
        Math.abs(s.yawVel) < 0.3 &&
        Math.abs(s.flipTarget - s.flipAngle) < 0.1
      ) {
        s.x = 0;
        s.y = 0;
        s.vx = 0;
        s.vy = 0;
        s.angle = 0;
        s.angularVel = 0;
        s.pitch = 0;
        s.pitchVel = 0;
        s.yaw = 0;
        s.yawVel = 0;
        s.flipAngle = s.flipTarget;
        s.flipVel = 0;
        s.motionIntensity = 0;
      }
    }

    // Dynamic motion intensity for sheen reflection
    const instantSpeed = Math.hypot(s.vx, s.vy);
    const instantRotSpeed = Math.abs(s.angularVel) + Math.abs(s.pitchVel) + Math.abs(s.yawVel) + Math.abs(s.flipVel);
    const instantTilt = Math.hypot(s.x, s.y) * 0.8 + Math.abs(s.pitch) * 2 + Math.abs(s.yaw) * 2;
    
    const targetIntensity = Math.min(1, (instantSpeed / 350) * 0.45 + (instantRotSpeed / 180) * 0.45 + (instantTilt / 100) * 0.3);
    s.motionIntensity = s.motionIntensity * 0.82 + targetIntensity * 0.18;

    setRenderState({
      x: s.x,
      y: s.y,
      angle: s.angle,
      pitch: s.pitch,
      yaw: s.yaw,
      flipAngle: s.flipAngle,
      motionIntensity: Math.max(0, Math.min(1, s.motionIntensity)),
    });

    animFrameRef.current = requestAnimationFrame(updatePhysics);
  }, [L0, gravity]);

  // Initial Natural Drop & Settle Animation with Dramatic 3D Ceiling Fall
  useEffect(() => {
    if (!isReady) {
      const s = stateRef.current;
      s.y = -190;
      s.x = -35;
      s.vx = 0;
      s.vy = 0;
      s.angle = 18;
      s.pitch = -24;
      s.yaw = 20;
      s.motionIntensity = 1.0;
      return;
    }

    const s = stateRef.current;
    // Start card high up with slack chain, ready to plunge down with clean downward velocity
    s.y = isDesktop ? -260 : -140;
    s.x = isDesktop ? -15 : -10;
    s.vy = isDesktop ? 120 : 90;
    s.vx = isDesktop ? 10 : 6;
    s.angle = 0;
    s.pitch = -6;
    s.yaw = 0;
    s.motionIntensity = 1.0;
    s.lastTime = performance.now();
    s.hasSnappedOnce = false;

    // Subtle woosh sound on drop
    const wooshTimer = setTimeout(() => {
      soundFx.playHover();
    }, 80);

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      clearTimeout(wooshTimer);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isReady, updatePhysics, isDesktop]);

  // Pointer Drag Event Handlers with Inelastic Length Constraint and Full 3D Tilt from Any Angle
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 });
  const pointerDownPosRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    const s = stateRef.current;
    s.isDragging = true;
    s.dragStartX = e.clientX;
    s.dragStartY = e.clientY;
    s.cardStartX = s.x;
    s.cardStartY = s.y;
    s.cardStartPitch = s.pitch;
    s.cardStartYaw = s.yaw;
    s.dragDist = 0;
    s.vx = 0;
    s.vy = 0;

    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };

    soundFx.playClick();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const s = stateRef.current;
    if (!s.isDragging) return;

    const dxMouse = e.clientX - s.dragStartX;
    const dyMouse = e.clientY - s.dragStartY;
    s.dragDist = Math.hypot(e.clientX - pointerDownPosRef.current.x, e.clientY - pointerDownPosRef.current.y);

    let targetX = s.cardStartX + dxMouse;
    let targetY = s.cardStartY + dyMouse;

    // Anchor is at (0, -L0)
    const distFromAnchor = Math.hypot(targetX, targetY + L0);

    // Tether elastic/geometric constraint
    if (distFromAnchor > L0) {
      const over = distFromAnchor - L0;
      const allowedOver = Math.min(18, Math.pow(over, 0.65) * 1.8);
      const ratio = (L0 + allowedOver) / distFromAnchor;
      targetX *= ratio;
      targetY = -L0 + (targetY + L0) * ratio;
    }

    s.x = targetX;
    s.y = targetY;

    // The card hangs vertically (flat) under the pivot swivel by gravity (matches reference Image 1)
    // Dynamic tilt only responds very subtly to rapid cursor motion inertia:
    const now = performance.now();
    const dt = (now - lastPointerRef.current.time) / 1000;
    
    if (dt > 0.004) {
      const instantVx = (e.clientX - lastPointerRef.current.x) / dt;
      const instantVy = (e.clientY - lastPointerRef.current.y) / dt;
      s.vx = s.vx * 0.35 + instantVx * 0.65;
      s.vy = s.vy * 0.35 + instantVy * 0.65;

      // Subtle dynamic inertia (keeps card flat and upright instead of slanting with rope)
      const targetRoll = Math.max(-5, Math.min(5, -(instantVx * 0.015)));
      s.angle = s.angle * 0.8 + targetRoll * 0.2;

      // Pitch & Yaw stay flat (subtle depth response only)
      const targetPitch = Math.max(-4, Math.min(4, instantVy * 0.010));
      s.pitch = s.pitch * 0.8 + targetPitch * 0.2;

      const targetYaw = Math.max(-4, Math.min(4, instantVx * 0.010));
      s.yaw = s.yaw * 0.8 + targetYaw * 0.2;

      s.angularVel = -(instantVx * 0.03);
      s.pitchVel = (instantVy * 0.03);
      s.yawVel = (instantVx * 0.02);

      lastPointerRef.current = { x: e.clientX, y: e.clientY, time: now };
    }

    // Motion intensity update for sheen
    s.motionIntensity = Math.min(1, Math.max(s.motionIntensity, (s.dragDist / 60)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const s = stateRef.current;
    if (!s.isDragging) return;
    s.isDragging = false;
    s.lastTime = performance.now();

    // If it was a clean click / tap without significant drag (< 8px), smoothly flip the card!
    if (s.dragDist < 8) {
      s.flipTarget = s.flipTarget === 0 ? 180 : 0;
      soundFx.playCardFlip();
    } else {
      soundFx.playClick();
    }

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Flip trigger helper function
  const toggleFlip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const s = stateRef.current;
    s.flipTarget = s.flipTarget === 0 ? 180 : 0;
    soundFx.playCardFlip();
  };

  const photoUrl = profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80";

  // SVG Coordinates for Ball Chain (260px container width: center X = 130px)
  const ceilingAnchorX = 130;
  // Desktop/Web: -218 (originates high above from the viewport ceiling)
  // Mobile/Tablet: -88 (compact mount under info/social icons)
  const ceilingAnchorY = isDesktop ? -218 : -88;
  const beadCount = isDesktop ? 28 : 18;

  const clipTargetX = 130 + renderState.x;
  const clipTargetY = 66 + renderState.y;

  const currentRopeDist = Math.hypot(clipTargetX - ceilingAnchorX, clipTargetY - ceilingAnchorY);
  const ropeSlack = Math.max(0, L0 - currentRopeDist);

  // Catenary sag curve when lifted upwards
  const sagY = ropeSlack * 0.65;
  const ctrlX = (ceilingAnchorX + clipTargetX) / 2 + (renderState.x * 0.08);
  const ctrlY = (ceilingAnchorY + clipTargetY) / 2 + sagY;

  // Total 3D yaw combines dynamic motion yaw + flip angle
  const totalYawRotation = renderState.yaw + renderState.flipAngle;
  const isBackVisible = renderState.flipAngle > 90;

  // ================= TILT-ANGLE-BASED SPECULAR GLARE & LIGHTING CALCULATIONS =================
  // Optical Physics Model:
  // - Light source is positioned overhead (ceiling spotlight).
  // - Camera/viewer is facing perpendicular to the screen (0, 0, 1).
  // - When the card is flat (pitch = 0, yaw = 0, angle = 0, at rest):
  //   Tilt angle = 0 deg => Glare Opacity = 0.0 (Pure dark, crisp, zero glare, exactly as in Reference Image 2).
  // - When the card tilts (pitch / yaw / displacement angle > 0):
  //   Specular reflection catches the overhead light and washes frosted white sheen across the acrylic surface (Reference Image 1).

  // Compute 3D tilt deflection angle from neutral camera plane (in degrees)
  const tiltDeflectionDeg = Math.hypot(
    renderState.pitch,
    renderState.yaw,
    renderState.angle * 0.6,
    renderState.x * 0.12,
    renderState.y * 0.12
  );

  // Smooth Fresnel & Specular glare response curve
  // 0% when flat (< 1.5 deg), smoothly ramping up to ~72% when tilted to 20-30 deg
  const rawGlareFactor = Math.max(0, (tiltDeflectionDeg - 1.5) / 22);
  const glareIntensity = Math.min(0.75, Math.pow(rawGlareFactor, 1.25) * 0.75);

  // Front Face Specular Center & Gradient Angle (shifts dynamically based on 3D tilt angles)
  const frontGlareX = 50 + (renderState.yaw * 1.8) + (renderState.x * 0.06);
  const frontGlareY = 35 - (renderState.pitch * 1.6) + (renderState.y * 0.05);
  const frontGlareAngle = 120 + (renderState.angle * 0.9) + (renderState.yaw * 0.7);

  // Back Face Specular Center & Gradient Angle
  const backGlareX = 50 - (renderState.yaw * 1.8) - (renderState.x * 0.06);
  const backGlareY = 35 - (renderState.pitch * 1.6) + (renderState.y * 0.05);
  const backGlareAngle = 60 - (renderState.angle * 0.9) - (renderState.yaw * 0.7);

  // Dynamic Edge Highlight (subtle rim light that catches edges when tilted)
  const rimLightOpacity = Math.min(0.35, 0.08 + (tiltDeflectionDeg * 0.012));


  return (
    <div 
      ref={containerRef}
      className="relative w-full flex flex-col items-center select-none overflow-visible pt-4 sm:pt-6 lg:pt-0 pb-4"
    >
      {/* Ceiling Spotlight Ambient Beam */}
      <div 
        className={`absolute ${isDesktop ? '-top-40 w-[460px] h-[550px]' : '-top-14 sm:-top-16 w-[280px] sm:w-[380px] h-[400px] sm:h-[450px]'} left-1/2 -translate-x-1/2 pointer-events-none z-0 ${isDesktop ? 'opacity-70' : 'opacity-60'}`}
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(34, 197, 94, 0.16) 0%, rgba(0,0,0,0) 70%)',
          clipPath: 'polygon(46% 0%, 54% 0%, 98% 100%, 2% 100%)'
        }}
      />

      {/* Physics Stage (Compact 260px width & 420px height) */}
      <div className="relative w-[260px] h-[420px] sm:h-[440px] flex justify-center items-start overflow-visible">
        
        {/* SVG Metallic Ball Chain Hanging Down from Ceiling */}
        <svg 
          className="absolute inset-0 w-[260px] h-[560px] pointer-events-none z-10 overflow-visible"
          viewBox="0 0 260 560"
        >
          <defs>
            {/* Chrome Ball Bead Gradient */}
            <radialGradient id="chromeBeadGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#f1f5f9" />
              <stop offset="60%" stopColor="#94a3b8" />
              <stop offset="85%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>

            {/* Drop Shadow */}
            <filter id="chainShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="2" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* Top Anchor Mount Fixture */}
          <g filter="url(#chainShadow)">
            <circle cx={ceilingAnchorX} cy={ceilingAnchorY} r={5} fill="#090d16" stroke="#475569" strokeWidth="1.5" />
            <circle cx={ceilingAnchorX} cy={ceilingAnchorY} r={2.5} fill="#94a3b8" />
          </g>

          {/* Precision Ball Chain Path */}
          <g filter="url(#chainShadow)">
            {Array.from({ length: beadCount }).map((_, i) => {
              const total = beadCount;
              const t = (i + 1) / total;
              const bx = (1 - t) * (1 - t) * ceilingAnchorX + 2 * (1 - t) * t * ctrlX + t * t * clipTargetX;
              const by = (1 - t) * (1 - t) * ceilingAnchorY + 2 * (1 - t) * t * ctrlY + t * t * clipTargetY;

              const prevT = i / total;
              const pbx = (1 - prevT) * (1 - prevT) * ceilingAnchorX + 2 * (1 - prevT) * prevT * ctrlX + prevT * prevT * clipTargetX;
              const pby = (1 - prevT) * (1 - prevT) * ceilingAnchorY + 2 * (1 - prevT) * prevT * ctrlY + prevT * prevT * clipTargetY;

              return (
                <g key={i}>
                  {/* Metal Connecting Pin */}
                  <line 
                    x1={pbx} 
                    y1={pby} 
                    x2={bx} 
                    y2={by} 
                    stroke="#64748b" 
                    strokeWidth="1.2" 
                  />
                  {/* Chrome Ball Bead */}
                  <circle
                    cx={bx}
                    cy={by}
                    r={3.2}
                    fill="url(#chromeBeadGrad)"
                    stroke="#1e293b"
                    strokeWidth="0.4"
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Real-Physics Draggable ID Card with Full 3D Tilt (Pitch, Yaw, Roll) and Motion Glare */}
        <div
          id="hanging-tag-card-container"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            transform: `translate3d(${renderState.x}px, ${renderState.y}px, 0px) rotateZ(${renderState.angle}deg) rotateX(${renderState.pitch}deg) rotateY(${totalYawRotation}deg)`,
            transformOrigin: '50% -24px', // Pivots symmetrically at top hanger swivel ring
            transformStyle: 'preserve-3d',
            perspective: 1200,
            touchAction: 'none',
          }}
          className="absolute top-[90px] left-[10px] w-[240px] h-[350px] cursor-grab active:cursor-grabbing z-20 group select-none will-change-transform"
        >
          {/* Dynamic 3D Projected Floor / Atmosphere Shadow underneath */}
          <div 
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[210px] h-[25px] rounded-full blur-xl pointer-events-none transition-opacity duration-300"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 75%)',
              transform: `translate3d(${renderState.x * 0.3}px, ${-renderState.y * 0.2}px, -40px) scale(${1 - Math.abs(renderState.y) * 0.0015})`,
              opacity: Math.max(0.3, 0.75 - Math.abs(renderState.y) * 0.002)
            }}
          />

          {/* ================= MODERN HARDWARE CLIP & PUNCH HOLE ASSEMBLY ================= */}
          {/* Black Wire Hook & Clasp inserting into card punch hole */}
          <div className="absolute -top-[24px] left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center z-50">
            {/* Top Swivel Loop */}
            <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-700 bg-black shadow-md flex items-center justify-center -mb-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            </div>

            {/* Dark Metal Clasp Bracket */}
            <div className="w-3.5 h-4 bg-gradient-to-b from-slate-700 via-slate-900 to-black rounded-t-sm shadow-md border-x border-t border-slate-600 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-slate-400" />
            </div>

            {/* Hook Wire entering punch hole */}
            <div className="w-1.5 h-3 bg-gradient-to-b from-slate-500 to-black rounded-b-full shadow-inner" />
          </div>

          {/* Subtle Quick-Flip Floating Indicator Badge */}
          <button
            type="button"
            id="tag-flip-pill-btn"
            onClick={toggleFlip}
            className="absolute -top-3 right-0 z-50 px-2 py-0.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-400 hover:text-white hover:bg-emerald-600 text-[9px] font-mono flex items-center gap-1 shadow-lg backdrop-blur-sm opacity-80 group-hover:opacity-100 transition-all cursor-pointer pointer-events-auto active:scale-95"
            title="Klik untuk membalik kartu (atau klik langsung pada kartu)"
          >
            <RotateCw className="w-2.5 h-2.5" />
            <span>{isBackVisible ? 'FRONT' : 'INFO'}</span>
          </button>

          {/* ================= CARD FRONT FACE (CLEAN ACRYLIC WITH TILT-BASED FROSTED GLARE) ================= */}
          <div 
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              pointerEvents: !isBackVisible ? 'auto' : 'none',
              borderColor: `rgba(255, 255, 255, ${0.08 + rimLightOpacity})`,
            }}
            className="absolute inset-0 w-full h-full rounded-2xl border-[1.5px] bg-[#070a10] shadow-[0_24px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(34,197,94,0.15)] p-2 flex flex-col overflow-hidden transition-[border-color] duration-100"
          >
            {/* Real Acrylic Specular Glare & Silau Sheen (Matches Reference Image 1 when tilted; 0% when flat like Reference Image 2) */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-2xl z-30 transition-opacity duration-150"
              style={{
                opacity: glareIntensity,
                background: `
                  radial-gradient(ellipse at ${frontGlareX}% ${frontGlareY}%, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.40) 45%, rgba(255, 255, 255, 0.12) 80%, rgba(255, 255, 255, 0) 100%),
                  linear-gradient(${frontGlareAngle}deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.40) 100%)
                `,
                mixBlendMode: 'screen',
              }}
            />

            {/* Subtle Frosted White Diffuse Layer on Extreme Tilt */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-2xl z-25 bg-white transition-opacity duration-150"
              style={{
                opacity: glareIntensity * 0.28,
                mixBlendMode: 'screen',
              }}
            />

            {/* Subtle Acrylic Glass Rim Border */}
            <div className="absolute inset-0 rounded-2xl border border-white/5 pointer-events-none z-20 shadow-inner" />

            {/* Full Photo + Tech Overlay */}
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#070a10] border border-white/5 shadow-inner group/photo pointer-events-none">
              
              {/* Top Circular Hole Punch through the card (as in reference image) */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-black border border-white/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] z-40 pointer-events-none flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
              </div>

              <img
                src={photoUrl}
                alt={profile.name || "Backend Developer"}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter contrast-105 brightness-105 pointer-events-none select-none"
              />

              {/* Cinematic Dark Vignette at Bottom for Typography Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070a10] via-[#070a10]/35 via-35% to-transparent opacity-95 pointer-events-none" />

              {/* Bottom Profession Title matching reference aesthetic */}
              <div className="absolute bottom-5 left-0 right-0 px-3 text-center pointer-events-none z-10">
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-lg font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] leading-none">
                    FullStack
                  </h3>
                  <h4 className="text-sm font-bold tracking-tight text-slate-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] mt-1">
                    Web Developer
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* ================= CARD BACK FACE (CLEAN ACRYLIC WITH TILT-BASED FROSTED GLARE) ================= */}
          <div 
            style={{ 
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              pointerEvents: isBackVisible ? 'auto' : 'none',
              borderColor: `rgba(34, 197, 94, ${0.2 + rimLightOpacity})`,
            }}
            className="absolute inset-0 w-full h-full rounded-2xl border-[1.5px] bg-[#070a10] shadow-[0_24px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(34,197,94,0.25)] p-3 flex flex-col justify-between overflow-hidden"
          >
            {/* Real Acrylic Specular Glare & Silau Sheen for Back Face (Tilt-based!) */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-2xl z-30 transition-opacity duration-150"
              style={{
                opacity: glareIntensity,
                background: `
                  radial-gradient(ellipse at ${backGlareX}% ${backGlareY}%, rgba(255, 255, 255, 0.70) 0%, rgba(255, 255, 255, 0.38) 45%, rgba(255, 255, 255, 0.12) 80%, rgba(255, 255, 255, 0) 100%),
                  linear-gradient(${backGlareAngle}deg, rgba(255, 255, 255, 0.50) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.38) 100%)
                `,
                mixBlendMode: 'screen',
              }}
            />

            {/* Subtle Frosted White Diffuse Layer on Back Face */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-2xl z-25 bg-white transition-opacity duration-150"
              style={{
                opacity: glareIntensity * 0.25,
                mixBlendMode: 'screen',
              }}
            />

            {/* Background Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(rgba(34, 197, 94, 0.4) 1px, transparent 1px)`,
                backgroundSize: '12px 12px'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10 pointer-events-none" />

            {/* Top Header: Badge Identifier */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#22c55e]" />
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
                  DEV ID PASS
                </span>
              </div>
              <span className="text-[8px] font-mono text-slate-400 tracking-wider">
                ACTIVE
              </span>
            </div>

            {/* Identity & Core Details */}
            <div className="relative z-10 flex flex-col gap-1.5 mt-1">
              <div className="flex items-center gap-2">
                {/* Mini Profile Thumbnail */}
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-500/40 bg-slate-900 shrink-0 shadow-md">
                  <img 
                    src={photoUrl} 
                    alt={profile.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="text-xs font-bold text-white truncate flex items-center gap-1">
                    {profile.name || "Jupri Eka Pratama"}
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400/90 truncate">
                    {profile.handle || "@juprieka"}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono truncate">
                    FullStack Web Developer
                  </span>
                </div>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] font-mono font-medium text-emerald-300 truncate">
                  Available for High-Scale Projects
                </span>
              </div>

              {/* Core Skill Chips */}
              <div className="flex flex-wrap gap-1 mt-0.5">
                {['React', 'TypeScript', 'Node.js', 'Go', 'PostgreSQL', 'Docker'].map((tag) => (
                  <span 
                    key={tag} 
                    className="px-1.5 py-0.5 text-[8px] font-mono bg-white/5 border border-white/10 rounded text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Contact Meta */}
              <div className="flex flex-col gap-1 text-[9px] text-slate-300 font-mono bg-slate-900/60 rounded-lg p-1.5 border border-white/5">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{profile.location || "Jakarta, ID"} (UTC+7)</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{profile.email || "jupriekapratama@gmail.com"}</span>
                </div>
              </div>
            </div>

            {/* Bottom Barcode & Action */}
            <div className="relative z-10 pt-1.5 border-t border-white/10 flex items-center justify-between">
              {/* Decorative Tech Barcode */}
              <div className="flex flex-col">
                <div className="flex items-center gap-0.5 h-4 opacity-75">
                  <div className="w-1 h-full bg-slate-300" />
                  <div className="w-0.5 h-full bg-slate-500" />
                  <div className="w-1.5 h-full bg-slate-300" />
                  <div className="w-0.5 h-full bg-slate-600" />
                  <div className="w-1 h-full bg-slate-300" />
                  <div className="w-2 h-full bg-slate-400" />
                  <div className="w-0.5 h-full bg-slate-500" />
                  <div className="w-1.5 h-full bg-slate-300" />
                  <div className="w-0.5 h-full bg-slate-500" />
                  <div className="w-1 h-full bg-slate-400" />
                </div>
                <span className="text-[7px] font-mono text-slate-500 tracking-wider">
                  AUTH#8829-PRO
                </span>
              </div>

              {/* Hire Action Trigger */}
              {onOpenHireModal ? (
                <button
                  type="button"
                  id="tag-hire-me-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFx.playClick();
                    onOpenHireModal();
                  }}
                  className="px-2.5 py-1 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black text-[9px] font-mono font-bold flex items-center gap-1 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer pointer-events-auto"
                >
                  <Send className="w-2.5 h-2.5" />
                  <span>HIRE ME</span>
                </button>
              ) : (
                <div className="text-[8px] font-mono text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>VERIFIED</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
