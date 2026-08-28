import { useEffect, useRef, useState, MouseEvent } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Box, RefreshCw, Cpu, Layers } from 'lucide-react';
import { soundFx } from '../lib/audio';

interface Spline3DSceneProps {
  customSplineUrl?: string;
}

export function Spline3DScene({ customSplineUrl }: Spline3DSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewMode, setViewMode] = useState<'canvas' | 'spline'>('canvas');
  const [isWireframe, setIsWireframe] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Fallback or custom Spline URL
  const splineEmbedUrl = customSplineUrl || 'https://my.spline.design/cybermonolith-a3848b8138fb308adfe49b1ca830a84e/';

  useEffect(() => {
    if (viewMode !== 'canvas') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // 3D Polyhedron Vertices (Icosahedron + Dodecahedron cyber-core)
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVertices = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ];

    // Normalize
    const vertices = rawVertices.map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return [x / len, y / len, z / len];
    });

    // Edges
    const edges: [number, number][] = [];
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const [x1, y1, z1] = vertices[i];
        const [x2, y2, z2] = vertices[j];
        const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
        if (dist < 1.1) {
          edges.push([i, j]);
        }
      }
    }

    // Outer orbital particles
    const particleCount = 70;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: (Math.random() - 0.5) * 450,
      y: (Math.random() - 0.5) * 450,
      z: (Math.random() - 0.5) * 450,
      size: Math.random() * 2.5 + 0.8,
      speed: (Math.random() * 0.01 + 0.005),
      color: Math.random() > 0.5 ? '#ef4444' : '#dc2626',
      pulse: Math.random() * Math.PI * 2
    }));

    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;

    let currentMouseX = 0;
    let currentMouseY = 0;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      currentMouseX += (mousePos.targetX - currentMouseX) * 0.05;
      currentMouseY += (mousePos.targetY - currentMouseY) * 0.05;

      angleX += 0.008 * rotationSpeed + currentMouseY * 0.0003;
      angleY += 0.012 * rotationSpeed + currentMouseX * 0.0003;
      angleZ += 0.004 * rotationSpeed;

      const centerX = width / 2;
      const centerY = height / 2;
      const scale = Math.min(width, height) * 0.36;

      // Glow behind the 3D core
      const radialGlow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, scale * 1.5);
      radialGlow.addColorStop(0, 'rgba(239, 68, 68, 0.22)');
      radialGlow.addColorStop(0.5, 'rgba(220, 38, 38, 0.1)');
      radialGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // Orbiting particles
      particles.forEach((p) => {
        p.pulse += 0.03;
        const cosY = Math.cos(angleY * 0.5);
        const sinY = Math.sin(angleY * 0.5);
        const cosX = Math.cos(angleX * 0.5);
        const sinX = Math.sin(angleX * 0.5);

        // Rotate particle
        let px = p.x * cosY - p.z * sinY;
        let pz = p.x * sinY + p.z * cosY;
        let py = p.y * cosX - pz * sinX;
        pz = p.y * sinX + pz * cosX;

        const pFov = 400;
        const pScale = pFov / (pFov + pz + 200);
        const screenX = centerX + px * pScale;
        const screenY = centerY + py * pScale;

        if (pScale > 0) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, p.size * pScale * (1 + 0.3 * Math.sin(p.pulse)), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0.1, Math.min(0.8, pScale));
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      });

      // 3D Matrix Transformations for Icosahedron Core
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);

      const transformedVertices = vertices.map(([x, y, z]) => {
        // Rotate Y
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;

        // Rotate X
        let y2 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;

        // Rotate Z
        let x3 = x1 * cosZ - y2 * sinZ;
        let y3 = x1 * sinZ + y2 * cosZ;

        // Perspective Projection
        const fov = 4;
        const perspective = fov / (fov + z2);

        return {
          x: centerX + x3 * scale * perspective,
          y: centerY + y3 * scale * perspective,
          z: z2,
          orig: [x, y, z]
        };
      });

      // Outer Cyber Ring 1 (Horizontal)
      ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        const ringR = 1.45;
        let rx = ringR * Math.cos(theta);
        let ry = 0;
        let rz = ringR * Math.sin(theta);

        // Rotate Ring
        let rx1 = rx * cosY - rz * sinY;
        let rz1 = rx * sinY + rz * cosY;
        let ry2 = ry * cosX - rz1 * sinX;
        let rz2 = ry * sinX + rz1 * cosX;
        let rx3 = rx1 * cosZ - ry2 * sinZ;
        let ry3 = rx1 * sinZ + ry2 * cosZ;

        const ringFov = 4;
        const ringP = ringFov / (ringFov + rz2);
        const px = centerX + rx3 * scale * ringP;
        const py = centerY + ry3 * scale * ringP;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Edges
      edges.forEach(([i1, i2]) => {
        const v1 = transformedVertices[i1];
        const v2 = transformedVertices[i2];

        const avgZ = (v1.z + v2.z) / 2;
        const depthAlpha = Math.max(0.2, (avgZ + 1.5) / 2.5);

        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);

        const edgeGrad = ctx.createLinearGradient(v1.x, v1.y, v2.x, v2.y);
        edgeGrad.addColorStop(0, `rgba(239, 68, 68, ${depthAlpha * 0.9})`);
        edgeGrad.addColorStop(0.5, `rgba(220, 38, 38, ${depthAlpha * 0.8})`);
        edgeGrad.addColorStop(1, `rgba(185, 28, 28, ${depthAlpha * 0.9})`);

        ctx.strokeStyle = edgeGrad;
        ctx.lineWidth = isWireframe ? 1 : 2.2;
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = isWireframe ? 0 : 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw Glowing Nodes
      transformedVertices.forEach((v) => {
        const nodeAlpha = Math.max(0.3, (v.z + 1.2) / 2.2);
        ctx.beginPath();
        ctx.arc(v.x, v.y, 4.5 * (1 + v.z * 0.3), 0, Math.PI * 2);
        ctx.fillStyle = '#f87171';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 12;
        ctx.globalAlpha = nodeAlpha;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(v.x, v.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [viewMode, isWireframe, rotationSpeed, mousePos.targetX, mousePos.targetY]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos(prev => ({ ...prev, targetX: x, targetY: y }));
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[420px] md:h-[480px] rounded-3xl border border-red-500/20 bg-gradient-to-b from-[#160909]/90 to-[#0e0606]/95 backdrop-blur-2xl overflow-hidden group shadow-[0_0_50px_-15px_rgba(239,68,68,0.15)] flex flex-col justify-between p-4"
    >
      {/* Interactive Top Floating Control Bar */}
      <div className="relative z-20 flex items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <span className="text-xs font-mono font-medium text-red-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-red-400" />
            <span>3D_SPLINE_CORE.v2</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Canvas Mode / Spline Embed Toggle */}
          <button
            id="toggle-3d-canvas-btn"
            onClick={() => {
              soundFx.playClick();
              setViewMode(viewMode === 'canvas' ? 'spline' : 'canvas');
            }}
            className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'canvas'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            {viewMode === 'canvas' ? (
              <>
                <Box className="w-3 h-3" />
                <span>WebGL Canvas</span>
              </>
            ) : (
              <>
                <Layers className="w-3 h-3" />
                <span>Spline.design</span>
              </>
            )}
          </button>

          {/* Wireframe toggle */}
          {viewMode === 'canvas' && (
            <button
              id="toggle-wireframe-btn"
              onClick={() => {
                soundFx.playClick();
                setIsWireframe(!isWireframe);
              }}
              title="Toggle Wireframe"
              className={`p-1.5 rounded-lg border transition-all text-xs ${
                isWireframe
                  ? 'bg-red-500 text-black border-red-400 font-bold'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Speed switch */}
          {viewMode === 'canvas' && (
            <button
              id="toggle-speed-btn"
              onClick={() => {
                soundFx.playClick();
                setRotationSpeed(rotationSpeed === 1 ? 2.5 : rotationSpeed === 2.5 ? 0.4 : 1);
              }}
              title="Change rotation speed"
              className="p-1.5 rounded-lg border bg-white/5 border-white/10 text-slate-300 hover:text-white transition-all text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main 3D Canvas / Spline Scene Viewport */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
        {viewMode === 'canvas' ? (
          <>
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            />
            {/* Holographic overlay watermark */}
            <div className="pointer-events-none absolute bottom-3 left-4 text-[10px] font-mono text-red-400/60 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              <span>Interactive Monolith • Drag to rotate</span>
            </div>
          </>
        ) : (
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-purple-500/30">
            <iframe
              src={splineEmbedUrl}
              frameBorder="0"
              width="100%"
              height="100%"
              title="Spline 3D Scene"
              className="w-full h-full pointer-events-auto"
            />
            <div className="pointer-events-none absolute bottom-3 right-4 text-[10px] font-mono text-purple-300/80 bg-purple-950/80 px-2 py-1 rounded-md border border-purple-500/30">
              Spline.design 3D Model
            </div>
          </div>
        )}
      </div>

      {/* Bottom Technical Telemetry Bar */}
      <div className="relative z-20 flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="text-red-400">60.0 FPS</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline">PBR Shader Shading</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-emerald-400 font-medium">Real-time WebGL</span>
        </div>
      </div>
    </div>
  );
}
