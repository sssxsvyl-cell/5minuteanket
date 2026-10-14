import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  phase: number;
  rot: number;
  rotSpeed: number;
  alpha: number;
  hue: number; // 0 = rose, 1 = pink, 2 = gold
  kind: "heart" | "spark";
};

function drawHeart(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath();
  ctx.moveTo(0, s * 0.35);
  ctx.bezierCurveTo(0, 0, -s * 0.6, -s * 0.25, -s * 0.6, s * 0.12);
  ctx.bezierCurveTo(-s * 0.6, s * 0.55, -s * 0.12, s * 0.85, 0, s * 1.1);
  ctx.bezierCurveTo(s * 0.12, s * 0.85, s * 0.6, s * 0.55, s * 0.6, s * 0.12);
  ctx.bezierCurveTo(s * 0.6, -s * 0.25, 0, 0, 0, s * 0.35);
  ctx.closePath();
}

const PALETTE = [
  { core: "rgba(251,113,133,", glow: "rgba(251,113,133," }, // rose
  { core: "rgba(249,168,212,", glow: "rgba(244,114,182," }, // pink
  { core: "rgba(251,191,36,", glow: "rgba(251,191,36," }, // gold
];

export default function HeartCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];

    const spawn = (initial: boolean): Particle => {
      const kind: Particle["kind"] = Math.random() < 0.62 ? "heart" : "spark";
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 30,
        size: kind === "heart" ? 5 + Math.random() * 10 : 1 + Math.random() * 2.2,
        speed: 0.25 + Math.random() * 0.7,
        drift: 0.4 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
        rot: (Math.random() - 0.5) * 0.7,
        rotSpeed: (Math.random() - 0.5) * 0.01,
        alpha: 0.14 + Math.random() * 0.4,
        hue: Math.random() < 0.72 ? 0 : Math.random() < 0.6 ? 1 : 2,
        kind,
      };
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.min(64, Math.floor((w * h) / 24000));
      particles = Array.from({ length: count }, () => spawn(true));
    };

    let t = 0;
    const tick = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speed;
        p.x += Math.sin(t * p.drift + p.phase) * 0.35;
        p.rot += p.rotSpeed;

        if (p.y < -40) {
          particles[i] = spawn(false);
          continue;
        }

        const tw = 0.75 + Math.sin(t * 2 + p.phase) * 0.25;
        const a = p.alpha * tw;
        const col = PALETTE[p.hue];

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        if (p.kind === "heart") {
          ctx.shadowBlur = 18;
          ctx.shadowColor = `${col.glow}${0.55 * a})`;
          ctx.fillStyle = `${col.core}${a})`;
          drawHeart(ctx, p.size);
          ctx.fill();
        } else {
          ctx.shadowBlur = 10;
          ctx.shadowColor = `${col.glow}${a})`;
          ctx.fillStyle = `${col.core}${a})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[2]" aria-hidden="true" />;
}
