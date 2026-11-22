import React, { useRef, useEffect, useState } from 'react';
import { playClick } from '../utils/audio';

interface PlantVisualizerProps {
  day?: number; // 1, 5, 10, 15
  isScanning?: boolean;
  interactiveHotspots?: boolean;
  onHotspotClick?: (hotspot: { id: string; title: string; description: string; detail: string }) => void;
  selectedHotspotId?: string | null;
  cropType?: string;
  showArGrid?: boolean;
}

export const PlantVisualizer: React.FC<PlantVisualizerProps> = ({
  day = 10,
  isScanning = false,
  interactiveHotspots = false,
  onHotspotClick,
  selectedHotspotId,
  showArGrid = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle interactive rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - rotation.y, y: e.clientY - rotation.x });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newY = (e.clientX - dragStart.x) * 0.4;
    const newX = (e.clientY - dragStart.y) * 0.4;
    setRotation({
      x: Math.max(-25, Math.min(25, newX)),
      y: Math.max(-45, Math.min(45, newY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Canvas biological leaf & lesion rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let scanY = 0;
    let scanDirection = 1;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Save transform
      ctx.save();
      ctx.translate(width / 2, height / 2);

      // Subtle 3D tilt transformation
      const radX = (rotation.x * Math.PI) / 180;
      const radY = (rotation.y * Math.PI) / 180;
      ctx.transform(
        Math.cos(radY),
        Math.sin(radX) * 0.2,
        0,
        Math.cos(radX),
        0,
        0
      );

      // 1. Draw glowing background aura
      const auraGrad = ctx.createRadialGradient(0, 0, 40, 0, 0, 240);
      auraGrad.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
      auraGrad.addColorStop(0.7, 'rgba(6, 78, 59, 0.05)');
      auraGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 240, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Leaf Contour (Organic curvature)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, -180); // Leaf Tip
      ctx.bezierCurveTo(110, -120, 150, 40, 40, 160); // Right side
      ctx.bezierCurveTo(20, 180, 0, 190, 0, 200); // Petiole base
      ctx.bezierCurveTo(0, 190, -20, 180, -40, 160);
      ctx.bezierCurveTo(-150, 40, -110, -120, 0, -180); // Left side
      ctx.closePath();

      // Leaf base color according to Day & Chlorophyll degradation
      const leafGrad = ctx.createLinearGradient(0, -180, 0, 200);
      if (day === 1) {
        leafGrad.addColorStop(0, '#10B981'); // Vibrant emerald
        leafGrad.addColorStop(0.5, '#059669');
        leafGrad.addColorStop(1, '#047857');
      } else if (day === 5) {
        leafGrad.addColorStop(0, '#34D399');
        leafGrad.addColorStop(0.5, '#10B981');
        leafGrad.addColorStop(1, '#065F46');
      } else if (day === 10) {
        leafGrad.addColorStop(0, '#84CC16'); // Yellowing chlorosis
        leafGrad.addColorStop(0.4, '#10B981');
        leafGrad.addColorStop(0.7, '#CA8A04');
        leafGrad.addColorStop(1, '#713F12');
      } else {
        // Day 15 severe
        leafGrad.addColorStop(0, '#65A30D');
        leafGrad.addColorStop(0.3, '#A16207');
        leafGrad.addColorStop(0.7, '#451A03'); // Necrotic brown
        leafGrad.addColorStop(1, '#292524');
      }

      ctx.fillStyle = leafGrad;
      ctx.fill();

      // Subtle translucent leaf rim
      ctx.strokeStyle = day === 15 ? 'rgba(217, 119, 6, 0.4)' : 'rgba(52, 211, 153, 0.6)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 3. Central Midrib & Lateral Veins
      ctx.strokeStyle = day >= 10 ? 'rgba(254, 240, 138, 0.45)' : 'rgba(167, 243, 208, 0.5)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, 200);
      ctx.lineTo(0, -170);
      ctx.stroke();

      // Lateral veins
      const veinOffsets = [-120, -70, -20, 30, 80, 130];
      ctx.lineWidth = 1.8;
      veinOffsets.forEach((y, i) => {
        const span = 90 - Math.abs(y) * 0.35;
        // Right vein
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.quadraticCurveTo(span * 0.5, y - 15, span, y - 25 + (i % 2) * 5);
        ctx.stroke();

        // Left vein
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.quadraticCurveTo(-span * 0.5, y - 15, -span, y - 25 + (i % 2) * 5);
        ctx.stroke();
      });

      // 4. Biological Disease Lesions (Concentric rings for Early Blight)
      if (day >= 5) {
        // Main lesion cluster (Mid-right leaf zone)
        const lesionX = 45;
        const lesionY = -20;
        const lesionRadius = day === 5 ? 16 : day === 10 ? 38 : 58;

        // Chlorotic yellow halo
        const haloGrad = ctx.createRadialGradient(lesionX, lesionY, lesionRadius * 0.4, lesionX, lesionY, lesionRadius * 1.3);
        haloGrad.addColorStop(0, 'rgba(234, 179, 8, 0.8)');
        haloGrad.addColorStop(0.7, 'rgba(250, 204, 21, 0.4)');
        haloGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(lesionX, lesionY, lesionRadius * 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Concentric target-board rings
        const ringCount = day === 5 ? 2 : day === 10 ? 4 : 6;
        for (let r = ringCount; r >= 1; r--) {
          const rad = (lesionRadius / ringCount) * r;
          ctx.beginPath();
          ctx.arc(lesionX, lesionY, rad, 0, Math.PI * 2);
          ctx.fillStyle = r % 2 === 0 ? '#451A03' : '#78350F';
          ctx.fill();
          ctx.strokeStyle = '#D97706';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Secondary smaller lesions for Day 10 & 15
        if (day >= 10) {
          const secondarySpots = [
            { x: -35, y: -70, r: day === 10 ? 14 : 28 },
            { x: -50, y: 50, r: day === 10 ? 18 : 34 },
            { x: 30, y: 80, r: day === 10 ? 12 : 24 }
          ];

          secondarySpots.forEach(spot => {
            // Halo
            const secHalo = ctx.createRadialGradient(spot.x, spot.y, spot.r * 0.3, spot.x, spot.y, spot.r * 1.2);
            secHalo.addColorStop(0, 'rgba(234, 179, 8, 0.7)');
            secHalo.addColorStop(1, 'transparent');
            ctx.fillStyle = secHalo;
            ctx.beginPath();
            ctx.arc(spot.x, spot.y, spot.r * 1.2, 0, Math.PI * 2);
            ctx.fill();

            // Necrotic center
            ctx.beginPath();
            ctx.arc(spot.x, spot.y, spot.r * 0.7, 0, Math.PI * 2);
            ctx.fillStyle = '#3E1F0E';
            ctx.fill();
            ctx.strokeStyle = '#B45309';
            ctx.lineWidth = 1;
            ctx.stroke();
          });
        }
      }

      ctx.restore(); // Restore leaf clip/mask

      // 5. Laser Scanner Animation
      if (isScanning) {
        scanY += 3 * scanDirection;
        if (scanY > 160) scanDirection = -1;
        if (scanY < -160) scanDirection = 1;

        ctx.save();
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.9)';
        ctx.shadowColor = '#34D399';
        ctx.shadowBlur = 15;
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.moveTo(-160, scanY);
        ctx.lineTo(160, scanY);
        ctx.stroke();

        // Scan particles
        for (let p = 0; p < 8; p++) {
          const px = -140 + p * 40 + Math.sin(Date.now() * 0.005 + p) * 10;
          ctx.fillStyle = '#86EFAC';
          ctx.beginPath();
          ctx.arc(px, scanY, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      ctx.restore(); // Final restore

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [day, isScanning, rotation]);

  const hotspots = [
    {
      id: 'affected-area',
      title: 'Affected Area (Necrotic Lesion)',
      description: 'Concentric ring lesion caused by Alternaria solani',
      detail: 'These dark circular spots with concentric rings are the hallmark of Early Blight. The pathogen secretes alternariol toxin which destroys host cell membranes.',
      top: '42%',
      left: '60%',
      type: 'critical'
    },
    {
      id: 'chlorosis-halo',
      title: 'Chlorotic Yellow Halo',
      description: 'Chlorophyll breakdown zone',
      detail: 'The yellow margin around the dead spot is where chlorophyll molecules are actively degraded by fungal enzymes, stopping photosynthesis.',
      top: '36%',
      left: '68%',
      type: 'warning'
    },
    {
      id: 'healthy-vein',
      title: 'Primary Midrib (Xylem & Phloem)',
      description: 'Vascular nutrient transport pipeline',
      detail: 'The midrib transports water from roots via xylem and distributes photosynthesized sugars via phloem. Fungal blockage here wilts upper leaf sections.',
      top: '52%',
      left: '50%',
      type: 'info'
    },
    {
      id: 'healthy-margin',
      title: 'Healthy Upper Epidermis',
      description: 'Waxy cuticle & stomatal respiration',
      detail: 'Intact green tissue with full chlorophyll density (98%). Microscopic stomata regulate transpiration and gas exchange with atmospheric CO₂.',
      top: '22%',
      left: '38%',
      type: 'healthy'
    }
  ];

  return (
    <div 
      className={`relative w-full h-full min-h-[380px] md:min-h-[460px] flex items-center justify-center overflow-hidden rounded-2xl select-none cursor-grab active:cursor-grabbing ${
        showArGrid ? 'ar-grid' : ''
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Visual Canvas Element */}
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="max-w-full max-h-full drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
      />

      {/* AR Viewport Corner Brackets */}
      {showArGrid && (
        <div className="absolute inset-4 pointer-events-none">
          <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-emerald-400/80 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-emerald-400/80 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-emerald-400/80 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-emerald-400/80 rounded-br-lg"></div>
        </div>
      )}

      {/* Interactive AR Hotspots */}
      {interactiveHotspots && (
        <div className="absolute inset-0 pointer-events-none">
          {hotspots.map((hs) => {
            const isSelected = selectedHotspotId === hs.id;
            return (
              <div
                key={hs.id}
                style={{ top: hs.top, left: hs.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClick();
                    if (onHotspotClick) onHotspotClick(hs);
                  }}
                  className={`group relative flex items-center justify-center w-8 h-8 rounded-full transition-transform active:scale-95 ${
                    isSelected ? 'scale-125' : 'hover:scale-110'
                  }`}
                >
                  {/* Pulsing ring */}
                  <span
                    className={`absolute inset-0 rounded-full animate-ping opacity-60 ${
                      hs.type === 'critical'
                        ? 'bg-amber-500'
                        : hs.type === 'warning'
                        ? 'bg-yellow-400'
                        : 'bg-emerald-400'
                    }`}
                  ></span>

                  {/* Core badge */}
                  <span
                    className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg ${
                      hs.type === 'critical'
                        ? 'bg-amber-500 text-black border border-amber-300'
                        : hs.type === 'warning'
                        ? 'bg-yellow-400 text-black border border-yellow-200'
                        : 'bg-emerald-500 text-black border border-emerald-300'
                    }`}
                  >
                    {hs.type === 'critical' ? '!' : hs.type === 'warning' ? '?' : 'i'}
                  </span>

                  {/* Tooltip on Hover */}
                  <span className="absolute left-full ml-2 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-emerald-500/40 text-[11px] font-semibold text-emerald-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                    {hs.title}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating 3D Hint */}
      <div className="absolute bottom-3 right-4 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-emerald-500/20 text-[10px] text-emerald-400/80 font-mono pointer-events-none flex items-center space-x-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Drag to rotate 3D preview</span>
      </div>
    </div>
  );
};
