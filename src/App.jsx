import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'

/* ────────────────────────────────────────────────────────────
   CONFIG & DATA  (edit these to change content)
──────────────────────────────────────────────────────────── */
const BRAND = 'Famoxe Beauty Lab'
const PHONE = '2349019090370'
const PHONE_DISPLAY = '+234 901 909 0370'
const TIKTOK = 'https://www.tiktok.com/@famoxe_beauty_lab'
const MAP_QUERY = 'Lagos, Nigeria' // replace with the exact street address for a precise pin
const MAP = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=11&output=embed`
const DIRECTIONS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`

const wa = (text = `Hello ${BRAND}, I'd like to book an appointment.`) =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`

const EASE = [0.22, 1, 0.36, 1]
const SLIDE_MS = 5200

const navLinks = [
  ['Services', 'services'],
  ['Spotlight', 'lab'],
  ['Gallery', 'gallery'],
  ['Booking', 'booking'],
  ['Visit', 'location'],
]

const heroSlides = [
  { img: 'volume', tag: 'Volume Lashes' },
  { img: 'spine', tag: 'Permanent Tattoos' },
  { img: 'brace1', tag: 'Fashion Braces' },
  { img: 'whiten1', tag: 'Teeth Whitening' },
  { img: 'cluster', tag: 'Cluster Lashes' },
  { img: 'forearm', tag: 'Tattoo Art' },
  { img: 'pinkbraces', tag: 'Tooth Gems' },
  { img: 'neck', tag: 'Neck Tattoo' },
]

const services = [
  { t: 'Brows', d: 'Clean, defined brows that frame your face.', img: 'lash2', msg: 'brows' },
  { t: 'Brow Lamination & Tint', d: 'Fuller, brushed-up brows with a rich tint.', img: 'lash3', msg: 'brow lamination and tint' },
  { t: 'Lash Extensions', d: 'Hybrid, volume and cluster sets for every look.', img: 'volume', msg: 'lash extensions' },
  { t: 'Teeth Whitening', d: 'A brighter smile with a whitening session.', img: 'whiten1', msg: 'teeth whitening' },
  { t: 'Scaling & Polishing', d: 'A fresh, clean and polished smile.', img: 'smile', msg: 'scaling and polishing' },
  { t: 'Permanent Tattoos', d: 'Meaningful designs, from scripts to illustrations.', img: 'spine', msg: 'a permanent tattoo' },
  { t: 'Semi-Permanent Tattoos', d: 'Delicate designs that fade over time.', img: 'waist', msg: 'a semi-permanent tattoo' },
  { t: 'Fashion Braces & Tooth Gems', d: 'Colourful braces and sparkling gems for your smile.', img: 'brace1', msg: 'fashion braces / tooth gems' },
]

const panels = [
  {
    key: 'Lashes',
    sub: 'Hybrid · Volume · Cluster',
    title: 'Lashes with drama, or a natural touch',
    body: 'From soft hybrid sets to full volume cluster lashes, every set is applied to suit your eyes and your style.',
    pts: ['Hybrid sets & hybrid cluster lashes', 'Volume cluster lashes', 'Brow lamination & tint to match'],
    imgs: ['volume', 'cluster', 'hybrid', 'lash1'],
    msg: 'lash extensions',
    cta: 'Book Lashes',
  },
  {
    key: 'Tattoos',
    sub: 'Permanent · Semi-permanent',
    title: 'Ink that tells your story',
    body: 'Choose permanent tattoos for a lasting statement or semi-permanent designs for a softer commitment - from spine scripts and neck lettering to detailed illustrations and waistline pieces.',
    pts: ['Permanent tattoos', 'Semi-permanent tattoos', 'Custom drawings & lettering'],
    imgs: ['spine', 'forearm', 'waist', 'neck'],
    msg: 'a tattoo',
    cta: 'Book a Tattoo',
  },
  {
    key: 'Smile Lab',
    sub: 'Whitening · Braces · Gems',
    title: 'Upgrade your smile',
    body: 'A professional whitening session, a fresh scale and polish, or colourful fashion braces and sparkling tooth gems - pick what suits you.',
    pts: ['Teeth whitening', 'Scaling & polishing', 'Fashion braces & tooth gems'],
    imgs: ['whiten1', 'brace1', 'pinkbraces', 'smile'],
    msg: 'a smile upgrade',
    cta: 'Book Smile Lab',
  },
]

const gallery = [
  { img: 'spine', t: 'Permanent Spine Tattoo', c: 'Tattoos' }, { img: 'volume', t: 'Volume Cluster Lashes', c: 'Lashes' },
  { img: 'brace1', t: 'Fashion Braces', c: 'Braces & Gems' }, { img: 'waist', t: 'Semi-Permanent Waistline Tattoo', c: 'Tattoos' },
  { img: 'whiten1', t: 'Teeth Whitening Session', c: 'Whitening' }, { img: 'cluster', t: 'Hybrid Cluster Lashes', c: 'Lashes' },
  { img: 'forearm', t: 'Permanent Tattoo', c: 'Tattoos' }, { img: 'pinkbraces', t: 'Pink Fashion Braces', c: 'Braces & Gems' },
  { img: 'hybrid', t: 'Hybrid Lash Set', c: 'Lashes' }, { img: 'neck', t: 'Neck Tattoo', c: 'Tattoos' },
  { img: 'smile', t: 'Smile Upgrade', c: 'Whitening' }, { img: 'brace2', t: 'Braces with Crystal Details', c: 'Braces & Gems' },
  { img: 'lash1', t: 'Dramatic Lashes', c: 'Lashes' }, { img: 'lash2', t: 'Lash Close-Up', c: 'Lashes' }, { img: 'lash3', t: 'Lash Set', c: 'Lashes' },
]
const cats = ['All', 'Tattoos', 'Lashes', 'Whitening', 'Braces & Gems']

const marqueeWords = ['Lash Extensions', 'Brows', 'Brow Lamination', 'Teeth Whitening', 'Scaling & Polishing', 'Permanent Tattoos', 'Semi-Permanent Tattoos', 'Fashion Braces', 'Tooth Gems']

const steps = [
  ['Choose your service', 'Browse the gallery and pick lashes, brows, tattoo, whitening or braces.'],
  ['Message us', 'Tap WhatsApp, share your idea and your preferred date.'],
  ['Visit the lab', 'Come in, relax and leave feeling amazing.'],
]

/* ────────────────────────────────────────────────────────────
   STYLE TOKENS
──────────────────────────────────────────────────────────── */
const BTN_WA =
  'inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#25d366] to-[#128c4a] font-semibold text-white shadow-lg shadow-green-900/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-green-500/30'
const BTN_INK =
  'inline-flex items-center justify-center gap-2 rounded-full bg-ink font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-rose'
const BTN_LINE =
  'inline-flex items-center justify-center rounded-full border border-ink/30 font-semibold transition duration-300 hover:border-ink hover:bg-ink hover:text-white'
const EYEBROW = 'text-xs font-semibold uppercase tracking-[.28em] text-rose'
const H2 = 'font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.08] tracking-tight'

/* ────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────── */
function WhatsAppIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l1.8.9c.3.1.5.2.5.4.1.1.1.7-.1 1.3z" />
    </svg>
  )
}

function useBodyLock(locked) {
  useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [locked])
}

function Reveal({ children, className = '', delay = 0, y = 40, x = 0, as = 'div' }) {
  const Tag = motion[as] || motion.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Tag>
  )
}

/** Each line slides up out of a mask. */
function MaskLines({ lines, className = '', delay = 0, animate }) {
  const trigger = animate === undefined ? { whileInView: { y: 0 }, viewport: { once: true } } : { animate: animate ? { y: 0 } : {} }
  return (
    <>
      {lines.map(([text, cls], k) => (
        <span key={k} className={`block overflow-hidden pb-[.14em] ${className}`}>
          <motion.span
            className={`block ${cls || ''}`}
            initial={{ y: '110%' }}
            {...trigger}
            transition={{ duration: 1.1, delay: delay + k * 0.12, ease: EASE }}
          >
            {text}
          </motion.span>
        </span>
      ))}
    </>
  )
}

/** Whole photo, never cropped: sharp image fitted inside, blurred copy fills the spare space. */
function FullImg({ src, alt, ratio = 'aspect-[4/5]', className = '', priority = false }) {
  return (
    <div className={`relative overflow-hidden bg-sand ${ratio} ${className}`}>
      <img src={src} alt="" aria-hidden="true" loading={priority ? 'eager' : 'lazy'} className="absolute inset-0 h-full w-full scale-125 object-cover opacity-70 blur-2xl" />
      <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} draggable="false" className="relative h-full w-full select-none object-contain" />
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   PRELOADER
──────────────────────────────────────────────────────────── */
function Preloader({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="pre"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink text-ivory"
        >
          <div className="overflow-hidden pb-2">
            <motion.p initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE }} className="font-display text-5xl font-semibold tracking-tight sm:text-7xl">
              famoxe<span className="text-rose-soft">.</span>
            </motion.p>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-2 text-[11px] uppercase tracking-[.4em] text-ivory/60">Beauty Lab · Lagos</motion.p>
          <div className="mt-10 h-px w-40 overflow-hidden bg-ivory/20">
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} transition={{ duration: 1.2, ease: 'easeInOut' }} className="h-full bg-rose-soft" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ────────────────────────────────────────────────────────────
   NAVBAR
──────────────────────────────────────────────────────────── */
function Navbar({ ready }) {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const [active, setActive] = useState('')
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  useBodyLock(open)

  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    navLinks.forEach(([, id]) => {
      const el = document.getElementById(id)
      el && io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -90 }}
        animate={{ y: ready ? 0 : -90 }}
        transition={{ duration: 0.8, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-[90] transition-[background-color,box-shadow] duration-500 ${solid && !open ? 'bg-ivory/85 shadow-[0_1px_0_rgba(24,17,15,.08)] backdrop-blur-xl' : ''}`}
      >
        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-5">
          <a href="#home" onClick={() => setOpen(false)} className="font-display text-2xl font-semibold tracking-tight">
            famoxe<span className="text-rose">.</span>
          </a>

          <LayoutGroup>
            <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
              {navLinks.map(([t, id]) => (
                <a key={id} href={`#${id}`} className="relative rounded-full px-4 py-2 transition-colors hover:text-rose">
                  {active === id && <motion.span layoutId="nav-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} className="absolute inset-0 rounded-full bg-blush" />}
                  <span className="relative">{t}</span>
                </a>
              ))}
            </nav>
          </LayoutGroup>

          <div className="flex items-center gap-2">
            <a href={wa()} target="_blank" rel="noreferrer" className={`${BTN_WA} hidden px-5 py-2.5 text-sm sm:inline-flex`}>
              <WhatsAppIcon size={18} /> Book now
            </a>
            <button
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white md:hidden"
            >
              <span className="relative block h-3.5 w-5">
                <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${open ? 'top-[6px] rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${open ? 'top-[6px] -rotate-45' : 'top-[12px]'}`} />
              </span>
            </button>
          </div>
        </div>
        <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-rose to-rose-soft" />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[85] flex flex-col justify-center overflow-y-auto bg-ink px-8 pb-10 pt-24 text-ivory md:hidden"
          >
            {navLinks.map(([t, id], k) => (
              <motion.a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + k * 0.07, duration: 0.6, ease: EASE }}
                className="flex items-baseline gap-4 border-b border-ivory/10 py-4 font-display text-4xl font-semibold"
              >
                <span className="font-sans text-xs text-rose-soft">0{k + 1}</span>
                {t}
              </motion.a>
            ))}
            <div className='flex justify-center'>
              <motion.a href={wa()} target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className={`${BTN_WA} w-44 mt-8 py-4 text-lg`}>
              <WhatsAppIcon /> Book Now
            </motion.a>
            </div>
            <p className="mt-5 text-center text-sm text-ivory/60">{PHONE_DISPLAY}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ────────────────────────────────────────────────────────────
   HERO  (headline + full-photo slider)
──────────────────────────────────────────────────────────── */
function Hero({ ready }) {
  const [i, setI] = useState(0)
  const [tick, setTick] = useState(0)
  const x0 = useRef(null)
  const ref = useRef(null)
  const n = heroSlides.length
  const s = heroSlides[i]
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const cardY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])

  const go = useCallback((k) => {
    setI(((k % n) + n) % n)
    setTick((t) => t + 1)
  }, [n])

  useEffect(() => {
    if (!ready) return
    const id = setInterval(() => setI((c) => (c + 1) % n), SLIDE_MS)
    return () => clearInterval(id)
  }, [tick, ready, n])

  const up = (d) => ({
    initial: { opacity: 0, y: 28 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { delay: d, duration: 0.9, ease: EASE },
  })

  return (
    <section id="home" ref={ref} className="relative overflow-hidden bg-ivory px-5 pb-10 md:pb-14 pt-24 sm:pt-32 lg:flex lg:min-h-[100svh] lg:items-center lg:pb-14">
      <div className="pointer-events-none absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-blush/80 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[26rem] w-[26rem] rounded-full bg-sand blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
        <motion.div style={{ y: textY }}>
          <motion.p {...up(0.1)} className="hidden md:block  items-center gap-2 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[.22em] backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25d366] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#25d366]" />
            </span>
            Lagos · Now booking
          </motion.p>

          <h1 className="mt-6 font-display text-[clamp(2.9rem,8.4vw,6.2rem)] font-semibold leading-[1] tracking-tight">
            <MaskLines animate={ready} delay={0.15} lines={[['Lashes, ink'], ['& your best'], ['smile.', 'italic text-rose']]} />
          </h1>

          <motion.p {...up(0.8)} className="mt-6 max-w-md text-base text-ink/70 sm:text-lg">
            Brows, lash extensions, permanent and semi-permanent tattoos, teeth whitening and fashion braces - all at {BRAND}.
          </motion.p>

          <motion.div {...up(1)} className="mt-8 flex flex-wrap items-center gap-3">
            <a href={wa()} target="_blank" rel="noreferrer" className={`${BTN_WA} px-8 py-4`}>
              <WhatsAppIcon size={20} /> Book Now
            </a>
            <a href="#gallery" className="group inline-flex items-center gap-2 px-4 py-4 font-semibold">
              See the gallery <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </a>
          </motion.div>
        </motion.div>

        {/* slider – the whole photo is always visible */}
        <motion.div
          style={{ y: cardY }}
          initial={{ opacity: 0, y: 50 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 1.1, ease: EASE }}
          className="relative mx-auto w-full max-w-[440px] lg:ml-auto lg:mr-0"
          onTouchStart={(e) => (x0.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const d = e.changedTouches[0].clientX - x0.current
            if (Math.abs(d) > 50) go(i + (d < 0 ? 1 : -1))
          }}
        >
          <div className="absolute -inset-3 translate-x-3 translate-y-3 rounded-[2.2rem] border border-rose/40" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sand shadow-2xl shadow-ink/20">
            <AnimatePresence initial={false}>
              <motion.div
                key={s.img}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 0.9 }, scale: { duration: 1.4, ease: EASE } }}
                className="absolute inset-0"
              >
                <img src={`/images/${s.img}.jpg`} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-70 blur-2xl" />
                <img src={`/images/${s.img}.jpg`} alt={s.tag} draggable="false" className="relative h-full w-full select-none object-contain" />
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/40 to-transparent" />
            <AnimatePresence mode="wait">
              <motion.span key={s.tag} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="absolute bottom-4 left-4 rounded-full bg-ivory/95 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
                {s.tag}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {heroSlides.map((_, k) => (
                <button key={k} aria-label={`Slide ${k + 1}`} onClick={() => go(k)} className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-500 ${k === i ? 'w-8 bg-ink/15' : 'w-1.5 bg-ink/30'}`}>
                  {k === i && <motion.span key={`${tick}-${i}`} initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }} className="absolute inset-y-0 left-0 bg-rose" />}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-display text-sm tracking-widest text-ink/60">0{i + 1} / 0{n}</span>
              {[['←', -1], ['→', 1]].map(([c, d]) => (
                <button key={c} aria-label={d < 0 ? 'Previous photo' : 'Next photo'} onClick={() => go(i + d)} className="h-11 w-11 rounded-full border border-ink/25 text-lg transition hover:bg-ink hover:text-white">
                  {c}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   MARQUEE
──────────────────────────────────────────────────────────── */
function Marquee() {
  const row = [...marqueeWords, ...marqueeWords]
  return (
    <div className="overflow-hidden bg-ink py-5 text-ivory" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-xl italic sm:text-2xl">
        {[...row, ...row].map((w, k) => (
          <span key={k} className="flex items-center gap-10">
            {w}
            <span className="not-italic text-rose-soft">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   SERVICES  (responsive grid · full photos)
──────────────────────────────────────────────────────────── */
function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-5 py-16 md:py-20 sm:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className={EYEBROW}>Our services</p>
        <h2 className={`${H2} mt-3`}>Everything you need, <span className="italic text-rose">one lab</span></h2>
        <p className="mt-4 text-ink/70">Pick a service and message us on WhatsApp to book your slot.</p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((s, k) => (
          <Reveal key={s.t} delay={(k % 4) * 0.08}>
            <a
              href={wa(`Hello ${BRAND}, I'd like to book ${s.msg}.`)}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-ink/5 transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose/15"
            >
              <div className="overflow-hidden">
                <FullImg src={`/images/${s.img}.jpg`} alt={s.t} ratio="aspect-[4/5]" className="transition duration-700 group-hover:scale-[1.04]" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold uppercase tracking-[.25em] text-rose">0{k + 1}</p>
                <h3 className="mt-1 font-display text-xl font-semibold leading-snug">{s.t}</h3>
                <p className="mt-2 flex-1 text-sm text-ink/65">{s.d}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-rose">
                  Book this <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   SPOTLIGHT  (tabs · text + natural-ratio photos)
──────────────────────────────────────────────────────────── */
function Lab() {
  const [a, setA] = useState(0)
  const p = panels[a]
  return (
    <section id="lab" className="bg-blush/50 px-5 py-16 md:py-20 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center">
          <p className={EYEBROW}>Spotlight</p>
          <h2 className={`${H2} mt-3`}>Pick your <span className="italic text-rose">glow-up</span></h2>
        </Reveal>

        <Reveal className="mt-8 flex flex-wrap justify-center gap-2">
          <LayoutGroup id="lab">
            {panels.map((t, k) => (
              <button key={t.key} onClick={() => setA(k)} className={`relative rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${a === k ? 'text-white' : 'bg-white/70 hover:bg-white'}`}>
                {a === k && <motion.span layoutId="lab-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} className="absolute inset-0 rounded-full bg-ink" />}
                <span className="relative">{t.key}</span>
              </button>
            ))}
          </LayoutGroup>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={p.key}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-12 grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16"
          >
            <div>
              <p className={EYEBROW}>{p.sub}</p>
              <h3 className="mt-3 font-display text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.1] tracking-tight">{p.title}</h3>
              <p className="mt-4 text-ink/70">{p.body}</p>
              <ul className="mt-6 space-y-3">
                {p.pts.map((t, k) => (
                  <motion.li key={t} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + k * 0.08, duration: 0.5, ease: EASE }} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose/15 text-rose">✦</span>
                    {t}
                  </motion.li>
                ))}
              </ul>
              <a href={wa(`Hello ${BRAND}, I'd like to book ${p.msg}.`)} target="_blank" rel="noreferrer" className={`${BTN_WA} mt-8 px-8 py-4`}>
                <WhatsAppIcon size={20} /> {p.cta}
              </a>
            </div>

            {/* natural ratio – nothing is cropped */}
            <div className="columns-2 gap-3 sm:gap-4">
              {p.imgs.map((im, k) => (
                <motion.div
                  key={im}
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1 + k * 0.09, duration: 0.7, ease: EASE }}
                  className="mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-lg shadow-ink/10 sm:mb-4"
                >
                  <img src={`/images/${im}.jpg`} alt={p.key} loading="lazy" className="block h-auto w-full" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   GALLERY  (masonry – every photo shown whole) + LIGHTBOX
──────────────────────────────────────────────────────────── */
function Lightbox({ list, index, setIndex, onClose }) {
  const dragged = useRef(false)
  const item = list[index]
  const step = useCallback((d) => setIndex((s) => (s + d + list.length) % list.length), [list.length, setIndex])
  useBodyLock(true)

  useEffect(() => {
    const f = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [step, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => !dragged.current && onClose()}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-ink/95 p-4 text-white"
      role="dialog"
      aria-modal="true"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={item.img}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.3 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          onDragStart={() => (dragged.current = true)}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.x) > 80) step(info.offset.x < 0 ? 1 : -1)
            setTimeout(() => (dragged.current = false), 80)
          }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full cursor-grab text-center active:cursor-grabbing"
        >
          <img src={`/images/${item.img}.jpg`} alt={item.t} draggable="false" className="mx-auto max-h-[72svh] max-w-full select-none rounded-2xl object-contain" />
          <p className="mt-4 font-display text-xl">{item.t}</p>
          <p className="text-xs uppercase tracking-widest text-rose-soft">{item.c} · {index + 1} / {list.length}</p>
          <a href={wa(`Hello ${BRAND}, I love the "${item.t}". I'd like to book it.`)} target="_blank" rel="noreferrer" className={`${BTN_WA} mt-4 px-6 py-3 text-sm`}>
            <WhatsAppIcon size={18} /> Book this look
          </a>
        </motion.div>
      </AnimatePresence>
      <button aria-label="Close" onClick={onClose} className="absolute right-4 top-4 h-11 w-11 rounded-full bg-white/15 text-xl backdrop-blur hover:bg-white/30">✕</button>
      <button aria-label="Previous" onClick={(e) => { e.stopPropagation(); step(-1) }} className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 rounded-full bg-white/15 text-xl backdrop-blur hover:bg-white/30 sm:block">‹</button>
      <button aria-label="Next" onClick={(e) => { e.stopPropagation(); step(1) }} className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 rounded-full bg-white/15 text-xl backdrop-blur hover:bg-white/30 sm:block">›</button>
    </motion.div>
  )
}

function Gallery() {
  const [cat, setCat] = useState('All')
  const [sel, setSel] = useState(null)
  const list = gallery.filter((g) => cat === 'All' || g.c === cat)
  const closeBox = useCallback(() => setSel(null), [])

  return (
    <section id="gallery" className="mx-auto max-w-7xl px-5 py-16 md:py-20 sm:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className={EYEBROW}>Gallery</p>
        <h2 className={`${H2} mt-3`}>Fresh from the <span className="italic text-rose">lab</span></h2>
        <p className="mt-4 text-ink/70">Every photo shown in full. Tap one to enlarge it and book that exact look.</p>
      </Reveal>

      <Reveal className="mt-8 flex flex-wrap justify-center gap-2">
        <LayoutGroup id="gal">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${cat === c ? 'text-white' : 'bg-ink/5 hover:bg-ink/10'}`}>
              {cat === c && <motion.span layoutId="gal-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} className="absolute inset-0 rounded-full bg-ink" />}
              <span className="relative">{c}</span>
            </button>
          ))}
        </LayoutGroup>
      </Reveal>

      <div key={cat} className="mt-12 columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
        {list.map((g, k) => (
          <motion.button
            key={g.img}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -4% 0px' }}
            transition={{ duration: 0.8, ease: EASE, delay: (k % 4) * 0.06 }}
            onClick={() => setSel(k)}
            className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-sand text-left shadow-md shadow-ink/10 sm:mb-4"
            aria-label={`Open ${g.t}`}
          >
            <img src={`/images/${g.img}.jpg`} alt={g.t} loading="lazy" className="block h-auto w-full transition duration-700 group-hover:scale-[1.03]" />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 p-3 text-sm font-medium text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-4">
              {g.t}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {sel !== null && list[sel] && <Lightbox key="lb" list={list} index={sel} setIndex={setSel} onClose={closeBox} />}
      </AnimatePresence>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   BOOKING  (steps with a line that draws itself)
──────────────────────────────────────────────────────────── */
function Booking() {
  return (
    <section id="booking" className="bg-ink px-5 py-16 md:py-20 text-ivory sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className={`${EYEBROW} !text-rose-soft`}>Booking</p>
          <h2 className={`${H2} mt-3`}>Book in <span className="italic text-rose-soft">3 easy steps</span></h2>
        </Reveal>

        <div className="relative mt-8 md:mt-14 grid gap-6 md:grid-cols-3">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
            className="absolute left-[17%] right-[17%] top-9 hidden h-px origin-left border-t border-dashed border-rose-soft/60 md:block"
          />
          {steps.map(([t, d], k) => (
            <Reveal key={t} delay={k * 0.14}>
              <motion.div whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="relative h-full rounded-3xl bg-ivory/5 p-8 text-center ring-1 ring-ivory/10">
                <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-rose to-rose-soft font-display text-3xl font-semibold text-white shadow-lg shadow-rose/30">{k + 1}</div>
                <h3 className="mt-5 font-display text-xl font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-ivory/70">{d}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* <Reveal className="mt-12 text-center" delay={0.2}>
          <a href={wa()} target="_blank" rel="noreferrer" className={`${BTN_WA} px-8 py-4`}>
            <WhatsAppIcon size={20} /> Start on WhatsApp
          </a>
        </Reveal> */}
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   LOCATION
──────────────────────────────────────────────────────────── */
function Location() {
  return (
    <section id="location" className="mx-auto max-w-6xl px-5 py-16 sm:py-32">
      <div className="grid items-center gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Reveal>
            <p className={EYEBROW}>Find us</p>
            <h2 className={`${H2} mt-3`}>We're in <span className="italic text-rose">Lagos State</span></h2>
            <p className="mt-4 text-ink/70">{BRAND} serves clients across Lagos. Message us on WhatsApp for the exact address and directions before you come.</p>
            <div className="mt-6 space-y-3 text-sm">
              <p className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush">📍</span> Lagos State, Nigeria</p>
              <p className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush">📞</span> {PHONE_DISPLAY}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={DIRECTIONS} target="_blank" rel="noreferrer" className={`${BTN_INK} px-6 py-3 text-sm`}>Open in Maps</a>
              <a href={wa(`Hello ${BRAND}, please send me your exact address.`)} target="_blank" rel="noreferrer" className={`${BTN_WA} px-6 py-3 text-sm`}>Ask for address</a>
            </div>
          </Reveal>
        </div>
        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(8% 8% 8% 8% round 32px)' }}
          whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1.1, ease: EASE }}
          className="overflow-hidden shadow-2xl shadow-ink/15 lg:col-span-3"
        >
          <iframe title="Famoxe Beauty Lab - Lagos State" src={MAP} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[340px] w-full sm:h-[440px]" style={{ border: 0 }} allowFullScreen />
        </motion.div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   CONTACT
──────────────────────────────────────────────────────────── */
function Contact() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  return (
    <section id="contact" ref={ref} className="relative overflow-hidden bg-blush px-5 py-16 md:py-20 text-center sm:py-40">
      <motion.div style={{ y }} className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-rose/20 blur-3xl" />
      <motion.div style={{ y }} className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-white/70 blur-3xl" />
      <div className="relative mx-auto max-w-3xl">
        <Reveal>
          <p className={EYEBROW}>Let's talk</p>
        </Reveal>
        <h2 className="mt-3 font-display text-[clamp(2.6rem,8vw,5.5rem)] font-semibold leading-[1] tracking-tight">
          <MaskLines lines={[['Ready for'], ['your new look?', 'italic text-rose']]} />
        </h2>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-5 max-w-md text-ink/70">Message {BRAND} now to check availability and book your appointment.</p>
          <div className="relative mt-9 inline-block">
            <span className="absolute inset-0 animate-pulseRing rounded-full bg-[#25d366]" />
            <a href={wa()} target="_blank" rel="noreferrer" className={`${BTN_WA} relative px-10 py-5 text-lg`}>
              <WhatsAppIcon /> Chat Us
            </a>
          </div>
          <p className="mt-6 text-sm font-medium">{PHONE_DISPLAY}</p>
          <a href={TIKTOK} target="_blank" rel="noreferrer" className={`${BTN_LINE} mt-4 px-6 py-2.5 text-sm`}>Follow us on TikTok</a>
        </Reveal>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────
   FOOTER · FAB
──────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-ink px-5 pb-4 pt-8 md:pt-10 text-ivory">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
        <p className="font-display text-3xl font-semibold">famoxe<span className="text-rose-soft">.</span></p>
        <nav className="flex flex-wrap justify-center gap-x-7 gap-y-2 text-sm text-ivory/80">
          {navLinks.map(([t, id]) => (
            <a key={id} href={`#${id}`} className="transition hover:text-rose-soft">{t}</a>
          ))}
        </nav>
        <a href="#home" aria-label="Back to top" className="flex h-12 w-12 items-center justify-center rounded-full border border-ivory/25 text-lg transition hover:bg-rose">↑</a>
      </div>

      {/* Builder Credit */}
        <p className="mt-6 text-xs sm:text-sm opacity-80 flex items-center justify-center gap-2">
          <img
              src="/logos.jpg"
              alt="Elvionweb Logo"
              className="w-8 h-8 object-contain"
          />
          Built by{" "}
          <a
            href="https://www.elvionweb.com"
        target="_blank"
          rel="noopener noreferrer"
        className="font-semibold underline underline-offset-4 hover:opacity-100 transition-opacity"
          >
          Elvionweb
          </a>
          </p>
      <div className="mx-auto mt-4 md:mt-6 flex max-w-6xl flex-col items-center justify-between gap-2 border-t border-ivory/10 pt-6 text-xs text-ivory/50 sm:flex-row">
        <p>© {new Date().getFullYear()} {BRAND} · Lagos State</p>
        <a href={TIKTOK} target="_blank" rel="noreferrer" className="hover:text-rose-soft">TikTok @famoxe_beauty_lab</a>
      </div>
    </footer>
  )
}

function WhatsAppFab() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const f = () => setShow(window.scrollY > 300)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={wa()}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          initial={{ opacity: 0, scale: 0.4, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.4, y: 40 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center pb-[env(safe-area-inset-bottom)]"
        >
          <span className="absolute inset-0 animate-pulseRing rounded-full bg-[#25d366]" />
          <span className={`${BTN_WA} relative h-14 w-14`}>
            <WhatsAppIcon size={28} />
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}

/* ────────────────────────────────────────────────────────────
   APP
──────────────────────────────────────────────────────────── */
export default function App() {
  const [ready, setReady] = useState(false)
  useBodyLock(!ready)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <Preloader show={!ready} />
      <Navbar ready={ready} />
      <main className="overflow-x-clip">
        <Hero ready={ready} />
        <Marquee />
        <Services />
        <Lab />
        <Gallery />
        <Booking />
        <Location />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </MotionConfig>
  )
}
