'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Cinzel, Cormorant_Garamond } from 'next/font/google';
import { type Dream, type Constellation } from '../data/dreams';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-cinzel',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin-ext'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

// ── Derived constants ─────────────────────────────────────────────
const STATUS_COLOR: Record<string, string> = {
  dream: '#9eb8ff',
  ongoing: '#ffd060',
  done: '#ffffff',
};
const STATUS_LABEL: Record<string, string> = {
  dream: 'Rêve',
  ongoing: 'En cours',
  done: 'Accompli',
};
const CONST_LABEL: Record<string, string> = {
  mercurius: "Constellation Mercurius · L'Entrepreneur",
  peregrina: 'Constellation Peregrina · Le Voyageur',
  musea: 'Constellation Musea · La Muse',
  sophia: 'Constellation Sophia · Le Savoir',
};

// ── Component ─────────────────────────────────────────────────────
export default function CielDesReves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modalDream, setModalDream] = useState<Dream | null>(null);

  // Stable ref so canvas click handler can open modal without stale closures
  const openModalRef = useRef(setModalDream);
  openModalRef.current = setModalDream;

  // Dynamic data loaded from /dreams/dreams.json
  const dreamsRef = useRef<Dream[]>([]);
  const constsRef = useRef<Record<string, Constellation>>({});
  const [stats, setStats] = useState({ total: 0, ongoing: 0, done: 0 });

  useEffect(() => {
    fetch('/dreams/dreams.json')
      .then(r => r.json())
      .then(data => {
        dreamsRef.current = data.dreams ?? [];
        constsRef.current = data.constellations ?? {};
        setStats({
          total: dreamsRef.current.length,
          ongoing: dreamsRef.current.filter((d: Dream) => d.status === 'ongoing').length,
          done: dreamsRef.current.filter((d: Dream) => d.status === 'done').length,
        });
      });
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setModalDream(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ── Canvas setup ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, dpr = 1;
    let t = 0;
    let rafId = 0;

    interface BgStar {
      x: number; y: number; r: number;
      alpha: number; speed: number; phase: number;
    }
    interface Shooter {
      x: number; y: number; vx: number; vy: number;
      len: number; life: number; maxLife: number;
    }

    const bgStars: BgStar[] = [];
    const shooters: Shooter[] = [];
    let mx = -9999, my = -9999;
    let px = 0, py = 0;
    let hoveredDream: Dream | null = null;

    // ── Resize ────────────────────────────────────────────────
    function initBgStars() {
      bgStars.length = 0;
      const count = Math.floor((W * H) / 2400);
      for (let i = 0; i < count; i++) {
        bgStars.push({
          x: Math.random(), y: Math.random(),
          r: Math.random() * 1.0 + 0.15,
          alpha: Math.random() * 0.55 + 0.12,
          speed: 0.0005 + Math.random() * 0.002,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function resize() {
      if (!canvas) return;
      dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.scale(dpr, dpr);
      initBgStars();
    }

    // ── Shooting stars ─────────────────────────────────────────
    let shooterTimer: ReturnType<typeof setTimeout>;

    function spawnShooter() {
      shooters.push({
        x: Math.random() * 0.6 + 0.05,
        y: Math.random() * 0.25,
        vx: 0.0045 + Math.random() * 0.003,
        vy: 0.002 + Math.random() * 0.0015,
        len: 100 + Math.random() * 100,
        life: 0,
        maxLife: 55 + Math.random() * 35,
      });
    }

    function scheduleShooter() {
      shooterTimer = setTimeout(() => {
        spawnShooter();
        scheduleShooter();
      }, 4000 + Math.random() * 9000);
    }

    // ── Events ────────────────────────────────────────────────
    function findHovered(cx: number, cy: number): Dream | null {
      for (const d of dreamsRef.current) {
        const hitR = d.size * (d.status === 'done' ? 1.5 : 1.0) + 14;
        if (Math.hypot(cx - d.x * W, cy - d.y * H) < hitR) return d;
      }
      return null;
    }

    function onMouseMove(e: MouseEvent) {
      mx = e.clientX; my = e.clientY;
      px = (e.clientX / W - 0.5) * 14;
      py = (e.clientY / H - 0.5) * 10;
      hoveredDream = findHovered(mx, my);
      canvas.style.cursor = hoveredDream ? 'pointer' : 'default';
    }

    function onMouseLeave() {
      hoveredDream = null;
      canvas.style.cursor = 'default';
    }

    function onClick() {
      if (hoveredDream) openModalRef.current(hoveredDream);
    }

    let touchX = 0, touchY = 0;

    function onTouchStart(e: TouchEvent) {
      if (!e.touches.length) return;
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
      hoveredDream = findHovered(touchX, touchY);
    }

    function onTouchEnd(e: TouchEvent) {
      const dx = Math.abs((e.changedTouches[0]?.clientX ?? touchX) - touchX);
      const dy = Math.abs((e.changedTouches[0]?.clientY ?? touchY) - touchY);
      if (dx < 10 && dy < 10 && hoveredDream) openModalRef.current(hoveredDream);
      hoveredDream = null;
    }

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('resize', resize);

    // ── Draw helpers ──────────────────────────────────────────
    function starColor(status: string): [number, number, number] {
      if (status === 'done') return [255, 255, 255];
      if (status === 'ongoing') return [255, 215, 75];
      return [148, 178, 255];
    }

    function drawNebulaEllipse(
      cx: number, cy: number, rx: number, ry: number,
      r: number, g: number, b: number, alpha = 0.22,
    ) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(rx, ry);
      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      grd.addColorStop(0,    `rgba(${r},${g},${b},${alpha})`);
      grd.addColorStop(0.55, `rgba(${r},${g},${b},${alpha * 0.35})`);
      grd.addColorStop(1,    `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(0, 0, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawStarGlyph(
      x: number, y: number, r: number,
      [rc, gc, bc]: [number, number, number],
      intensity = 1, isHovered = false,
    ) {
      const tw = 0.75 + 0.25 * intensity;

      // Outer atmosphere
      const atmR = r * (isHovered ? 7.5 : 5);
      const atm = ctx.createRadialGradient(x, y, 0, x, y, atmR);
      atm.addColorStop(0,   `rgba(${rc},${gc},${bc},${0.17 * tw})`);
      atm.addColorStop(0.4, `rgba(${rc},${gc},${bc},${0.06 * tw})`);
      atm.addColorStop(1,   `rgba(${rc},${gc},${bc},0)`);
      ctx.fillStyle = atm;
      ctx.beginPath(); ctx.arc(x, y, atmR, 0, Math.PI * 2); ctx.fill();

      // Core glow
      const coreR = r * 2.4;
      const core = ctx.createRadialGradient(x, y, 0, x, y, coreR);
      core.addColorStop(0,    `rgba(255,255,255,${0.92 * tw})`);
      core.addColorStop(0.25, `rgba(${rc},${gc},${bc},${0.78 * tw})`);
      core.addColorStop(1,    `rgba(${rc},${gc},${bc},0)`);
      ctx.fillStyle = core;
      ctx.beginPath(); ctx.arc(x, y, coreR, 0, Math.PI * 2); ctx.fill();

      // Hard center
      ctx.fillStyle = `rgba(255,255,255,${0.97 * tw})`;
      ctx.beginPath(); ctx.arc(x, y, r * 0.55, 0, Math.PI * 2); ctx.fill();

      // Diffraction spikes — 4 main axes
      const spikeLen    = r * (isHovered ? 6.2 : 4.2);
      const diagLen     = r * (isHovered ? 3.8 : 2.6);
      const spikeAlpha  = isHovered ? 0.62 : 0.33;

      for (const angle of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) {
        const ex = x + Math.cos(angle) * spikeLen;
        const ey = y + Math.sin(angle) * spikeLen;
        const sp = ctx.createLinearGradient(x, y, ex, ey);
        sp.addColorStop(0,   `rgba(${rc},${gc},${bc},${spikeAlpha * tw})`);
        sp.addColorStop(0.6, `rgba(${rc},${gc},${bc},${spikeAlpha * 0.28 * tw})`);
        sp.addColorStop(1,   `rgba(${rc},${gc},${bc},0)`);
        ctx.strokeStyle = sp;
        ctx.lineWidth = r * 0.36;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x - Math.cos(angle) * r * 0.3, y - Math.sin(angle) * r * 0.3);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      }

      // Diagonal secondary spikes for larger stars
      if (r >= 8) {
        for (const angle of [Math.PI / 4, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75]) {
          const ex = x + Math.cos(angle) * diagLen;
          const ey = y + Math.sin(angle) * diagLen;
          const sp = ctx.createLinearGradient(x, y, ex, ey);
          sp.addColorStop(0, `rgba(${rc},${gc},${bc},${spikeAlpha * 0.5 * tw})`);
          sp.addColorStop(1, `rgba(${rc},${gc},${bc},0)`);
          ctx.strokeStyle = sp;
          ctx.lineWidth = r * 0.19;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }
      }
    }

    function drawConstellationLines() {
      const groups: Record<string, Dream[]> = {};
      for (const d of dreamsRef.current) {
        if (!groups[d.constellation]) groups[d.constellation] = [];
        groups[d.constellation].push(d);
      }

      for (const [cid, stars] of Object.entries(groups)) {
        const cdef = constsRef.current[cid];
        if (!cdef) continue;
        const [cr, cg, cb] = cdef.color;

        const links = cdef.links
          .map(([a, b]) => [stars[a], stars[b]] as [Dream, Dream])
          .filter(([a, b]) => a && b);

        for (const [a, b] of links) {
          const ax = a.x * W, ay = a.y * H;
          const bx = b.x * W, by = b.y * H;

          // Solid faint glow line
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.09)`;
          ctx.lineWidth = 1.3;
          ctx.setLineDash([]);
          ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();

          // Animated travelling dashes
          ctx.save();
          ctx.setLineDash([3, 10]);
          ctx.lineDashOffset = -(t * 0.25);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.24)`;
          ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
          ctx.restore();
        }

        // Constellation label at centroid
        const cx = stars.reduce((s, d) => s + d.x, 0) / stars.length;
        const cy = stars.reduce((s, d) => s + d.y, 0) / stars.length;
        ctx.save();
        ctx.font = '300 8.5px "Cinzel", serif';
        ctx.fillStyle = `rgba(${cr},${cg},${cb},0.27)`;
        ctx.textAlign = 'center';
        ctx.fillText(`${cdef.name}  ·  ${cdef.label}`.toUpperCase(), cx * W, cy * H + 52);
        ctx.restore();
      }
    }

    function drawBgStars() {
      for (const s of bgStars) {
        const tw = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.speed * 90 + s.phase));
        ctx.fillStyle = `rgba(215,225,255,${s.alpha * tw})`;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawShooters() {
      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i];
        s.life++;
        const prog  = s.life / s.maxLife;
        const alpha = prog < 0.25 ? prog / 0.25 : (1 - (prog - 0.25) / 0.75);
        s.x += s.vx; s.y += s.vy;

        const ex = s.x * W, ey = s.y * H;
        const sx2 = ex - s.vx * s.len * 55;
        const sy2 = ey - s.vy * s.len * 55;

        const grd = ctx.createLinearGradient(sx2, sy2, ex, ey);
        grd.addColorStop(0,   `rgba(210,225,255,0)`);
        grd.addColorStop(0.7, `rgba(220,235,255,${alpha * 0.52})`);
        grd.addColorStop(1,   `rgba(240,248,255,${alpha * 0.88})`);
        ctx.strokeStyle = grd;
        ctx.lineWidth = 0.9;
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(sx2, sy2); ctx.lineTo(ex, ey); ctx.stroke();

        ctx.fillStyle = `rgba(240,248,255,${alpha * 0.72})`;
        ctx.beginPath(); ctx.arc(ex, ey, 1.3, 0, Math.PI * 2); ctx.fill();

        if (s.life >= s.maxLife || s.x > 1.15 || s.y > 1.1) shooters.splice(i, 1);
      }
    }

    // ── Aurora borealis (new enhancement) ────────────────────
    function drawAurora() {
      const bands = [
        { yOff: 0.00, h: 0.30, r: 18,  g: 95,  b: 210, a: 0.065, sp: 0.80, ph: 0.0 },
        { yOff: 0.04, h: 0.20, r: 50,  g: 175, b: 155, a: 0.048, sp: 1.10, ph: 1.4 },
        { yOff: 0.01, h: 0.14, r: 115, g: 55,  b: 225, a: 0.038, sp: 0.60, ph: 2.8 },
      ];
      for (const band of bands) {
        const amp = band.a * (0.55 + 0.45 * Math.sin(t * 0.007 * band.sp + band.ph));
        const g   = ctx.createLinearGradient(0, H * band.yOff, 0, H * (band.yOff + band.h));
        g.addColorStop(0,    `rgba(${band.r},${band.g},${band.b},0)`);
        g.addColorStop(0.35, `rgba(${band.r},${band.g},${band.b},${amp})`);
        g.addColorStop(0.70, `rgba(${band.r},${band.g},${band.b},${amp * 0.38})`);
        g.addColorStop(1,    `rgba(${band.r},${band.g},${band.b},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, H * band.yOff, W, H * band.h);
      }
    }

    function drawHoverLabel(d: Dream) {
      const x = d.x * W, y = d.y * H;
      const [rc, gc, bc] = starColor(d.status);
      const labelY = y - d.size * 3.5 - 16;

      ctx.save();
      ctx.font = '300 13px "Cormorant Garamond", serif';
      ctx.textAlign = 'center';

      const tw  = ctx.measureText(d.title).width;
      const pad = 14;
      const bx  = x - tw / 2 - pad;
      const by  = labelY - 14;
      const bw  = tw + pad * 2;
      const bh  = 22;

      // Pill background
      ctx.fillStyle = 'rgba(4,10,28,0.78)';
      ctx.beginPath();
      (ctx as unknown as { roundRect: (...a: number[]) => void })
        .roundRect(bx, by, bw, bh, 6);
      ctx.fill();
      ctx.strokeStyle = `rgba(${rc},${gc},${bc},0.24)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Label text
      ctx.fillStyle = `rgba(${Math.min(rc + 80, 255)},${Math.min(gc + 80, 255)},${Math.min(bc + 80, 255)},0.9)`;
      ctx.fillText(d.title, x, labelY);
      ctx.restore();
    }

    // ── Render loop ───────────────────────────────────────────
    function render() {
      t++;
      ctx.clearRect(0, 0, W, H);

      // Deep space background
      const bg = ctx.createRadialGradient(W * 0.4, H * 0.35, 0, W * 0.5, H * 0.5, Math.max(W, H));
      bg.addColorStop(0,    '#0d1632');
      bg.addColorStop(0.35, '#060a14');
      bg.addColorStop(1,    '#020408');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Aurora
      drawAurora();

      // Constellation nebulae (one per zone, slightly more vivid than original)
      drawNebulaEllipse(W * 0.25, H * 0.32, W * 0.22, H * 0.20, 48,  32,  8,   0.23); // mercurius — amber
      drawNebulaEllipse(W * 0.78, H * 0.28, W * 0.20, H * 0.22, 8,   42,  68,  0.21); // peregrina — blue
      drawNebulaEllipse(W * 0.22, H * 0.74, W * 0.20, H * 0.18, 42,  10,  68,  0.20); // musea — violet
      drawNebulaEllipse(W * 0.72, H * 0.72, W * 0.20, H * 0.18, 8,   55,  44,  0.20); // sophia — teal

      // Milky way band
      ctx.save();
      const mw = ctx.createLinearGradient(0, H * 0.1, W, H * 0.9);
      mw.addColorStop(0,   'rgba(20,25,60,0)');
      mw.addColorStop(0.3, 'rgba(20,25,58,0.08)');
      mw.addColorStop(0.5, 'rgba(22,28,68,0.14)');
      mw.addColorStop(0.7, 'rgba(20,25,58,0.08)');
      mw.addColorStop(1,   'rgba(20,25,60,0)');
      ctx.fillStyle = mw;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      drawBgStars();
      drawShooters();

      // Parallax layer (dreams + constellations)
      ctx.save();
      ctx.translate(px, py);
      drawConstellationLines();

      for (const d of dreamsRef.current) {
        const isHov = hoveredDream === d;
        const sc    = starColor(d.status);
        const tw    = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(t * 0.018 + d.id * 2.1));
        drawStarGlyph(d.x * W, d.y * H, d.size, sc, tw, isHov);
      }

      if (hoveredDream) drawHoverLabel(hoveredDream);
      ctx.restore();

      rafId = requestAnimationFrame(render);
    }

    resize();
    scheduleShooter();
    render();

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(shooterTimer);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // ── Modal derived values ───────────────────────────────────────
  const cColor     = modalDream ? constsRef.current[modalDream.constellation]?.color : null;
  const cColorStr  = cColor
    ? `rgba(${cColor[0]},${cColor[1]},${cColor[2]},0.72)`
    : 'rgba(158,184,255,0.72)';

  const totalDreams   = stats.total;
  const ongoingDreams = stats.ongoing;
  const doneDreams    = stats.done;

  // ── Render ─────────────────────────────────────────────────────
  return (
    <main
      className={`${cinzel.variable} ${cormorant.variable}`}
      style={{
        width: '100vw', height: '100vh', overflow: 'hidden',
        background: '#02050d', position: 'relative',
        fontFamily: 'var(--font-cinzel), serif',
      }}
    >
      {/* ── Keyframe animations ── */}
      <style>{`
        @keyframes reves-fadeIn {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        @keyframes reves-slideUp {
          from { transform: translateY(28px) scale(0.95); opacity: 0 }
          to   { transform: translateY(0)    scale(1);    opacity: 1 }
        }
        .reves-back-btn:hover {
          color: rgba(190,210,255,0.75) !important;
          border-color: rgba(150,175,255,0.28) !important;
          background: rgba(10,20,50,0.6) !important;
        }
        .reves-modal-close:hover {
          color: rgba(200,215,255,0.7) !important;
        }
      `}</style>

      {/* ── Canvas ── */}
      <canvas
        ref={canvasRef}
        style={{ display: 'block', position: 'absolute', inset: 0 }}
      />

      {/* ── Back to portfolio ── */}
      <Link
        href="/"
        className="reves-back-btn"
        style={{
          position: 'fixed', top: '2rem', left: '2.2rem',
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          fontFamily: 'var(--font-cinzel), serif',
          fontSize: '8px', fontWeight: 300, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: 'rgba(150,175,255,0.35)',
          textDecoration: 'none', zIndex: 20,
          padding: '9px 16px',
          border: '0.5px solid rgba(150,175,255,0.12)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          background: 'rgba(5,10,30,0.4)',
          transition: 'color 0.25s ease, border-color 0.25s ease, background 0.25s ease',
        }}
      >
        ← Portfolio
      </Link>

      {/* ── Header title ── */}
      <header
        style={{
          position: 'fixed', top: '2.2rem', left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center', pointerEvents: 'none', zIndex: 10,
        }}
      >
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: '1rem', fontWeight: 300, fontStyle: 'italic',
          color: 'rgba(190,205,255,0.32)',
          letterSpacing: '0.15em', margin: 0,
        }}>
          Mon Ciel des Rêves
        </h1>
      </header>

      {/* ── Stats bar ── */}
      <div style={{
        position: 'fixed', bottom: '2rem', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: '2rem',
        pointerEvents: 'none', zIndex: 10,
      }}>
        {([
          { n: totalDreams,   l: 'Rêves'    },
          null,
          { n: ongoingDreams, l: 'En cours' },
          null,
          { n: doneDreams,    l: 'Accomplis' },
        ] as ({ n: number; l: string } | null)[]).map((item, i) =>
          item === null
            ? <div key={i} style={{ width: '0.5px', height: '26px', background: 'rgba(150,168,220,0.1)' }} />
            : (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontSize: '1.6rem', fontWeight: 300,
                  color: 'rgba(200,218,255,0.58)', lineHeight: 1,
                }}>
                  {item.n}
                </div>
                <div style={{
                  fontSize: '7px', fontWeight: 300,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: 'rgba(130,148,195,0.32)', marginTop: '4px',
                }}>
                  {item.l}
                </div>
              </div>
            )
        )}
      </div>

      {/* ── Legend ── */}
      <div style={{
        position: 'fixed', bottom: '2rem', right: '2.2rem',
        display: 'flex', flexDirection: 'column', gap: '8px',
        pointerEvents: 'none', zIndex: 10,
      }}>
        {([
          { color: '#9eb8ff', shadow: 'rgba(120,155,255,0.5)', label: 'Rêve'     },
          { color: '#ffd060', shadow: 'rgba(255,200,50,0.6)',  label: 'En cours' },
          { color: '#ffffff', shadow: 'rgba(255,255,255,0.7)', label: 'Accompli' },
        ]).map(({ color, shadow, label }) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: '9px',
            fontSize: '7.5px', fontWeight: 300, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'rgba(130,148,195,0.36)',
          }}>
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: color, boxShadow: `0 0 6px ${shadow}`, flexShrink: 0,
            }} />
            {label}
          </div>
        ))}
      </div>

      {/* ── Touch / mouse hint ── */}
      <div style={{
        position: 'fixed', bottom: '2rem', left: '2.2rem',
        fontSize: '7.5px', fontWeight: 300, letterSpacing: '0.2em',
        textTransform: 'uppercase', color: 'rgba(130,148,195,0.22)',
        pointerEvents: 'none', zIndex: 10,
      }}>
        Cliquer sur une étoile
      </div>

      {/* ── Dream modal ── */}
      {modalDream && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setModalDream(null); }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(1,3,10,0.68)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100,
            animation: 'reves-fadeIn 0.3s ease',
          }}
        >
          <div style={{
            maxWidth: '440px', width: '90%',
            position: 'relative',
            padding: '2.8rem 3.2rem 2.4rem',
            borderRadius: '18px',
            borderTop:    `2px solid ${cColorStr}`,
            borderRight:  '0.5px solid rgba(160,185,255,0.13)',
            borderBottom: '0.5px solid rgba(160,185,255,0.13)',
            borderLeft:   '0.5px solid rgba(160,185,255,0.13)',
            background: 'linear-gradient(148deg, rgba(8,16,42,0.97) 0%, rgba(3,7,20,0.99) 100%)',
            boxShadow: [
              '0 0 0 0.5px rgba(160,185,255,0.07)',
              '0 40px 80px rgba(0,0,0,0.72)',
              'inset 0 1px 0 rgba(160,185,255,0.07)',
            ].join(', '),
            animation: 'reves-slideUp 0.45s cubic-bezier(0.22,1,0.36,1)',
          }}>

            {/* Close button */}
            <button
              className="reves-modal-close"
              onClick={() => setModalDream(null)}
              style={{
                position: 'absolute', top: '1.3rem', right: '1.5rem',
                background: 'none', border: 'none',
                color: 'rgba(150,165,215,0.28)',
                fontSize: '14px', cursor: 'pointer',
                fontFamily: 'var(--font-cinzel), serif',
                padding: '4px', lineHeight: 1,
                transition: 'color 0.2s ease',
              }}
            >
              ✕
            </button>

            {/* Constellation tag */}
            <div style={{
              fontSize: '8px', fontWeight: 300, letterSpacing: '0.3em',
              textTransform: 'uppercase', color: cColorStr,
              marginBottom: '0.65rem',
            }}>
              {CONST_LABEL[modalDream.constellation]}
            </div>

            {/* Dream title */}
            <h2 style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: '2.2rem', fontWeight: 300, fontStyle: 'italic',
              color: '#dde8ff', lineHeight: 1.15, margin: '0 0 1.2rem',
            }}>
              {modalDream.title}
            </h2>

            {/* Decorative rule */}
            <div style={{
              width: '36px', height: '0.5px',
              background: `linear-gradient(90deg, transparent, ${cColorStr}, transparent)`,
              marginBottom: '1.2rem',
            }} />

            {/* Description */}
            <p style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: '1.05rem', fontWeight: 300, lineHeight: 1.85,
              color: 'rgba(195,210,255,0.62)',
              margin: '0 0 1.8rem',
            }}>
              {modalDream.desc}
            </p>

            {/* Footer: status + date */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: STATUS_COLOR[modalDream.status],
                  boxShadow: `0 0 7px ${STATUS_COLOR[modalDream.status]}`,
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: '8px', fontWeight: 300, letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: 'rgba(160,178,235,0.52)',
                }}>
                  {STATUS_LABEL[modalDream.status]}
                </span>
              </div>
              <span style={{
                fontSize: '8px', fontWeight: 300, letterSpacing: '0.15em',
                color: 'rgba(130,148,195,0.32)', textTransform: 'uppercase',
              }}>
                {modalDream.date}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
