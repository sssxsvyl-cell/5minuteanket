import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";

const PHRASES = [
  "Нет",
  "Точно нет?",
  "А может, да?",
  "Ты меня не поймаешь :)",
  "Ну нет — значит нет…",
  "Упс, я убегаю!",
];

export default function DodgeButton() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dodges, setDodges] = useState(0);
  const btnRef = useRef<HTMLButtonElement>(null);
  const fleeing = useRef(false);

  const dodge = useCallback(() => {
    if (fleeing.current) return;
    fleeing.current = true;
    setTimeout(() => (fleeing.current = false), 180);

    const btn = btnRef.current;
    if (!btn) return;
    const parent = btn.closest("[data-card-area]") as HTMLElement | null;
    const maxX = parent ? parent.clientWidth / 2 - 70 : 140;
    const maxY = parent ? parent.clientHeight / 2 - 40 : 120;

    const x = (Math.random() - 0.5) * 2 * Math.max(90, maxX);
    const y = (Math.random() - 0.5) * 2 * Math.max(70, maxY) * 0.6;
    setPos({ x, y });
    setDodges((d) => Math.min(d + 1, PHRASES.length - 1));
  }, []);

  return (
    <motion.button
      ref={btnRef}
      type="button"
      aria-label="Нет"
      animate={{ x: pos.x, y: pos.y, scale: Math.max(0.62, 1 - dodges * 0.08), rotate: dodges % 2 ? -4 : 4 }}
      transition={{ type: "spring", stiffness: 500, damping: 24 }}
      onPointerEnter={dodge}
      onTouchStart={(e) => {
        e.preventDefault();
        dodge();
      }}
      onClick={dodge}
      className="relative z-10 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 font-sans text-sm font-medium tracking-wide text-rose-100/80 backdrop-blur-md transition-colors hover:border-white/30 hover:bg-white/10"
    >
      {PHRASES[dodges]}
    </motion.button>
  );
}
