import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Heart,
  Music,
  VolumeX,
  MessageCircle,
  Globe,
  Send,
  Sparkles,
  Sun,
  ArrowRight,
  PenLine,
} from "lucide-react";
import HeartCanvas from "./components/HeartCanvas";
import DodgeButton from "./components/DodgeButton";

/* ---------------------------------- data --------------------------------- */

const CARD_TEXT = [
  {
    kicker: "Вопрос № 1",
    title: "У тебя есть 5 минут?",
    body: "Понадобится всего пара минут, чтобы пройти одну маленькую анкету. Обещаю — скучно не будет :)",
    cta: "Да, конечно!",
  },
  {
    kicker: "Вопрос № 2",
    title: "Если готова — начнём",
    body: "Не спеши. Каждый вопрос здесь не случаен…",
    cta: "Начнём",
  },
  {
    kicker: "Немного честности…",
    title: "Я увидел тебя…",
    body: "…и не смог пройти мимо. Захотелось сделать что-то особенное — так появилась эта анкета. Только для тебя.",
    cta: "Дальше",
  },
  {
    kicker: "Честно говоря…",
    title: "Твоя красота ослепительна",
    body: "Не заметить её просто невозможно. Ты сияешь, как солнце, освещающее весь мир :)",
    cta: "Продолжаем…",
    sun: true,
  },
  {
    kicker: "Главный вопрос",
    title: "Если ты свободна…",
    body: "Я долго набирал этот текст и стирал… Так вот: если ты свободна — может, познакомимся?",
    cta: "Да, давай!",
    final: true,
  },
];

const LINKS = [
  {
    id: "max",
    label: "MAX",
    sub: "напиши мне сюда",
    href: "https://max.ru/u/f9LHodD0cOJJMjGKsDwgGo72AXMaVTXGjDsfjelpw_L1-RVPxH3ixBldcqI",
    icon: MessageCircle,
  },
  {
    id: "vk",
    label: "ВКонтакте",
    sub: "vk.com/yura.original",
    href: "https://vk.com/yura.original",
    icon: Globe,
  },
  {
    id: "tg",
    label: "Telegram",
    sub: "@siktimbay",
    href: "https://t.me/siktimbay",
    icon: Send,
  },
];

/* ------------------------------ heart burst ------------------------------ */

function HeartBurst() {
  const reduce = useReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const angle = (i / 22) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const dist = 130 + Math.random() * 200;
        return {
          id: i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist * 0.85,
          size: 10 + Math.random() * 16,
          delay: Math.random() * 0.12,
          color: ["#fb7185", "#f9a8d4", "#fbbf24"][i % 3],
        };
      }),
    []
  );
  if (reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, scale: [0, 1.1, 0.6], opacity: [1, 1, 0], rotate: Math.random() * 240 - 120 }}
          transition={{ duration: 1.5 + Math.random() * 0.7, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
          className="absolute"
        >
          <Heart size={p.size} fill={p.color} color={p.color} strokeWidth={0} />
        </motion.span>
      ))}
    </div>
  );
}

/* --------------------------------- app ---------------------------------- */

export default function App() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [autoplayFailed, setAutoplayFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  /* Müzik: sayfa açılır açılmaz başlat — tarayıcı engellerse ilk dokunuşta çal */
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.8;

    const tryPlay = () => {
      if (a.paused && !a.error) {
        a.play()
          .then(() => {
            setPlaying(true);
            setAutoplayFailed(false);
          })
          .catch(() => {
            setPlaying(false);
            setAutoplayFailed(true);
          });
      }
    };

    tryPlay();
    const unlock = () => tryPlay();
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock);
    window.addEventListener("touchstart", unlock, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const card = CARD_TEXT[step] ?? null;
  const isFinal = step === 5;

  return (
    <main className="grain relative flex min-h-dvh flex-col overflow-hidden bg-night font-sans text-cream">
      {/* Arka plan: gece geçişleri + aurora ışıkları */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,#241028_0%,#170b1d_45%,#0c060f_100%)]" />
        <div className="absolute -left-[20%] top-[-25%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(251,113,133,0.16)_0%,transparent_60%)] blur-3xl animate-aurora-1" />
        <div className="absolute -right-[25%] top-[10%] h-[65vmax] w-[65vmax] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.13)_0%,transparent_60%)] blur-3xl animate-aurora-2" />
        <div className="absolute bottom-[-30%] left-[15%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.10)_0%,transparent_60%)] blur-3xl animate-aurora-3" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_55%,transparent_40%,rgba(5,2,8,0.7)_100%)]" />
      </div>

      <HeartCanvas />

      {/* Üst bar */}
      <header className="relative z-20 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-6">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-rose-100/50">
          <Sparkles size={13} className="text-rose-300/70" />
          <span className="hidden sm:inline">анкета · для тебя</span>
        </div>

        {/* İlerleme kalpleri */}
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
          {CARD_TEXT.map((_, i) => (
            <motion.span key={i} animate={step === i ? { scale: [1, 1.35, 1] } : {}} transition={{ duration: 0.5 }}>
              <Heart
                size={14}
                className={step >= i ? "text-rose-soft drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]" : "text-white/15"}
                fill={step >= i ? "currentColor" : "none"}
              />
            </motion.span>
          ))}
        </div>

        <button
          onClick={toggleMusic}
          aria-label={playing ? "Выключить музыку" : "Включить музыку"}
          className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-rose-100/80 backdrop-blur-md transition-all hover:border-rose-300/40 hover:bg-white/10 hover:text-rose-200"
        >
          {playing ? (
            <>
              <Music size={17} className="animate-heartbeat" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.9)] animate-glow-pulse" />
            </>
          ) : (
            <VolumeX size={17} className="opacity-70" />
          )}
        </button>
      </header>

      {/* Kart sahnesi */}
      <section className="relative z-10 flex flex-1 items-center justify-center px-5 pb-16 pt-4">
        <AnimatePresence mode="wait">
          {!isFinal ? (
            <motion.div
              key={`card-${step}`}
              data-card-area
              initial={{ opacity: 0, y: 46, rotate: -1.2, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, y: -34, rotate: 1, scale: 0.97, transition: { duration: 0.32 } }}
              transition={{ type: "spring", stiffness: 90, damping: 16 }}
              className="glass relative w-full max-w-xl rounded-[2rem] px-7 py-12 text-center sm:px-12 sm:py-16"
            >
              {/* Büyük numara filigranı */}
              <span className="pointer-events-none absolute right-6 top-4 select-none font-serif text-[6rem] font-bold leading-none text-white/[0.045] sm:text-[8rem]">
                {String(step + 1).padStart(2, "0")}
              </span>

              {/* Dekoratif üst kalp */}
              <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-rose-400/20 to-pink-500/10 shadow-[0_0_40px_-5px_rgba(251,113,133,0.5)]">
                {card?.sun ? (
                  <Sun size={24} className="text-gold animate-spin-slower" style={{ animationDuration: "18s" }} />
                ) : (
                  <Heart size={22} className="text-rose-soft animate-heartbeat" fill="currentColor" />
                )}
              </div>

              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.4em] text-rose-200/60">{card?.kicker}</p>

              <h1 className="font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
                {card?.sun ? (
                  <span className="bg-gradient-to-r from-amber-200 via-rose-200 to-rose-400 bg-clip-text text-transparent text-glow-gold">
                    {card?.title}
                  </span>
                ) : (
                  <span className="bg-gradient-to-br from-rose-50 via-rose-100 to-rose-300/80 bg-clip-text text-transparent">
                    {card?.title}
                  </span>
                )}
              </h1>

              <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-rose-100/70 sm:text-base">
                {card?.body}
              </p>

              {card?.sun && (
                <div className="pointer-events-none absolute inset-x-0 top-8 -z-10 mx-auto h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.22)_0%,transparent_70%)] blur-2xl animate-glow-pulse" />
              )}

              {/* Butonlar */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={next}
                  className="btn-sheen group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-9 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_10px_40px_-8px_rgba(244,63,94,0.65)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_16px_50px_-6px_rgba(244,63,94,0.8)] active:scale-[0.98]"
                >
                  {card?.cta}
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                {card?.final && <DodgeButton />}
              </div>

              {card?.final && (
                <p className="mt-6 text-xs italic text-rose-100/40">(кнопка «нет» немного стесняется…)</p>
              )}
            </motion.div>
          ) : (
            /* ------------------------------ final ------------------------------ */
            <motion.div
              key="final"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 80, damping: 16 }}
              className="relative w-full max-w-2xl"
            >
              <HeartBurst />

              <div className="glass relative z-10 rounded-[2rem] px-7 py-12 text-center sm:px-12 sm:py-14">
                <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-rose-400/25 to-amber-400/15 shadow-[0_0_40px_-5px_rgba(251,113,133,0.6)]">
                  <Heart size={24} className="text-rose-soft animate-heartbeat" fill="currentColor" />
                </div>

                <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.4em] text-rose-200/60">
                  она сказала «да»
                </p>

                <h1 className="font-serif text-4xl font-bold leading-[1.08] sm:text-5xl">
                  <span className="bg-gradient-to-r from-amber-200 via-rose-200 to-rose-400 bg-clip-text text-transparent text-glow-rose">
                    Тогда это судьба :)
                  </span>
                </h1>

                <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-rose-100/70 sm:text-base">
                  Пиши мне, где тебе удобнее — я уже проверяю телефон каждые пять секунд…
                </p>

                {/* İletişim linkleri */}
                <div className="mt-9 grid gap-3 sm:grid-cols-3">
                  {LINKS.map((l, i) => (
                    <motion.a
                      key={l.id}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + i * 0.12, type: "spring", stiffness: 120, damping: 15 }}
                      whileHover={{ y: -5, scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="btn-sheen group flex flex-col items-center gap-2.5 rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-6 backdrop-blur-md transition-colors hover:border-rose-300/40 hover:bg-white/[0.09]"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400/25 to-pink-500/15 text-rose-300 transition-colors group-hover:text-rose-200">
                        <l.icon size={19} />
                      </span>
                      <span className="text-sm font-semibold tracking-wide text-rose-50">{l.label}</span>
                      <span className="break-all text-[11px] leading-snug text-rose-100/45">{l.sub}</span>
                    </motion.a>
                  ))}
                </div>

                {/* İmza */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="mt-10 flex flex-col items-center gap-1"
                >
                  <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.45em] text-rose-100/40">
                    <PenLine size={11} />
                    signed with love
                  </span>
                  <span className="font-script text-5xl text-glow-rose bg-gradient-to-r from-rose-300 via-pink-300 to-amber-200 bg-clip-text text-transparent sm:text-6xl">
                    Yura
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Alt imza — kalıcı */}
      <footer className="relative z-20 flex items-center justify-center pb-5 text-[10px] uppercase tracking-[0.4em] text-rose-100/30">
        <span>от&nbsp;</span>
        <span className="font-script text-base normal-case tracking-normal text-rose-300/60">Yura</span>
      </footer>

      {/* Müzik uyarı tostu — tarayıcı otomatik oynatmayı engellediyse */}
      <AnimatePresence>
        {autoplayFailed && !playing && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="pointer-events-none fixed bottom-16 left-1/2 z-30 -translate-x-1/2"
          >
            <div className="flex items-center gap-2.5 rounded-full border border-white/15 bg-plum/80 px-5 py-2.5 text-xs text-rose-100/80 shadow-2xl backdrop-blur-xl">
              <Music size={13} className="text-rose-300" />
              коснись экрана — включится музыка
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Şarkı: dosyayı public/music/song.mp3 olarak ekle */}
      <audio ref={audioRef} src="/music/song.mp3" loop preload="auto" playsInline />
    </main>
  );
}
