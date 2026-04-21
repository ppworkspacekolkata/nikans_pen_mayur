import { useEffect, useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Award, Globe, ShieldCheck, Package,
  Pen, Palette, Highlighter, ChevronRight, Mail, MapPin,
  ArrowLeft, ChevronLeft
} from 'lucide-react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import heroBg from '../assets/hero-bg.png';
// Old slide imports removed

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PRODUCTS } from '../data/products';


const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] } }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (d = 0) => ({ opacity: 1, transition: { duration: 0.6, delay: d } }),
};

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
}

function TiltCard({ children, className = '' }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 });

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
    >
      <div style={{ transform: 'translateZ(20px)', width: '100%', height: '100%' }}>
        {children}
      </div>
    </motion.div>
  );
}

function CountUp({ target, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef();
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

const TICKER_ITEMS = [
  'ISO 9001:2015 Certified', 'BIS Certified Categories', 'Automated Manufacturing',
  'In-House Production', 'Custom Solutions', 'Built for Global Bulk Supply'
];

const BRANDS = [
  { icon: <Pen size={20} />, name: 'Auram', tag: 'Premium', desc: 'Flagship ball pen with nickel-silver tip and smooth 0.7mm ink flow for professionals.' },
  { icon: <Award size={20} />, name: 'Aventus', tag: 'Signature', desc: '1.0mm broad-stroke pen with gold-accented body and nickel silver tip for executives.' },
  { icon: <Palette size={20} />, name: 'Chisel', tag: 'Markers', desc: 'Bold washable chisel-tip markers in 10 vivid colours — non-toxic, classroom-safe.' },
  { icon: <Pen size={20} />, name: 'Pentastic', tag: 'Everyday', desc: 'Affordable transparency-body 0.7mm ball pens in multicolour packs for daily use.' },
  { icon: <Highlighter size={20} />, name: 'Neo', tag: 'Smooth Write', desc: 'Super smooth pastel-body ball pen in a 12-unit retail pack format.' },
  { icon: <Package size={20} />, name: 'Kiddo', tag: 'Student', desc: 'Child-friendly ergonomic pens in 20-unit packs for young writers.' },
];

const CREDS = [
  { icon: <ShieldCheck size={18} />, title: 'ISO 9001:2015 Certified', desc: 'QMS verified by ROHS Certification Pvt. Ltd. for fibre tip pens, markers, and ball point pens.' },
  { icon: <Award size={18} />, title: 'One Star Export House', desc: 'DGFT-recognised under FTP 2023 — Ministry of Commerce & Industry, Govt. of India.' },
  { icon: <Globe size={18} />, title: 'Global Distribution', desc: 'Products exported to 20+ countries across the Middle East, Africa, Asia, and Europe.' },
];

const EXPORTS = [
  { flag: '🇦🇪', region: 'Middle East', countries: 'UAE · Saudi Arabia · Qatar' },
  { flag: '🌍', region: 'Africa', countries: 'Nigeria · Kenya · Ghana' },
  { flag: '🌏', region: 'South & SE Asia', countries: 'Bangladesh · Nepal · Sri Lanka' },
  { flag: '🌎', region: 'Expanding', countries: 'Active market development' },
];

function ProductCarousel() {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (dir) => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth } = containerRef.current;
      const amount = clientWidth * 0.8;
      containerRef.current.scrollTo({
        left: dir === 'left' ? scrollLeft - amount : scrollLeft + amount,
        behavior: 'smooth'
      });
    }
  };

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          containerRef.current.scrollTo({ left: scrollLeft + 300, behavior: 'smooth' });
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={containerRef}
        onScroll={checkScroll}
        style={{
          display: 'flex',
          gap: '2rem',
          overflowX: 'auto',
          padding: '2rem 0',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        className="no-scrollbar"
      >
        {PRODUCTS.slice(0, 10).map((p, i) => (
          <div key={p.id} style={{ flex: '0 0 350px', scrollSnapAlign: 'start' }}>
            <Link to={`/product/${p.id}`} className="product-card-link" style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
              <div className="product-card glass-card-pro" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease', background: '#fff' }}>
                <div className="product-card-image" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-dim)', marginBottom: '1.5rem', background: '#fff' }}>
                  <img src={p.img} alt={p.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'contain', padding: '1rem' }} />
                </div>
                <div className="product-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="label-gold" style={{ margin: 0, fontSize: '0.6rem' }}>{p.tag}</span>
                  <span className="product-card-cat" style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-muted)' }}>{p.cat}</span>
                </div>
                <div className="product-card-name" style={{ fontFamily: 'DM Serif Display', fontSize: '1.4rem', marginBottom: '0.8rem', color: 'var(--text-primary)' }}>{p.name}</div>
                <p className="product-card-desc" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem', flexGrow: 1, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.desc}</p>

                <div className="product-card-specs" style={{ background: 'var(--bg-secondary)', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '4px', border: '1px solid var(--border-dim)' }}>
                  <div className="product-spec" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}><span style={{ color: 'var(--text-muted)' }}>Tip</span><span style={{ fontWeight: '700' }}>{p.tip}</span></div>
                  <div className="product-spec" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}><span style={{ color: 'var(--text-muted)' }}>Colours</span><span style={{ fontWeight: '700' }}>{p.colours}</span></div>
                </div>

                <div className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.7rem', padding: '8px', background: 'var(--gold)', color: '#000' }}>
                  View Details <ArrowRight size={14} style={{ marginLeft: '8px' }} />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Nav Buttons */}
      <button
        onClick={() => scroll('left')}
        style={{
          position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)',
          width: '50px', height: '50px', borderRadius: '50%', background: '#fff',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: canScrollLeft ? 'flex' : 'none',
          alignItems: 'center', justifyContent: 'center', zIndex: 10, border: '1px solid var(--border-dim)'
        }}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => scroll('right')}
        style={{
          position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)',
          width: '50px', height: '50px', borderRadius: '50%', background: '#fff',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: canScrollRight ? 'flex' : 'none',
          alignItems: 'center', justifyContent: 'center', zIndex: 10, border: '1px solid var(--border-dim)'
        }}
      >
        <ChevronRight size={24} />
      </button>

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}


export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    '/product/auram 1.png',
    '/product/aventus 2.png',
    '/product/aviator 1.png',
    '/product/bold mark 1.png',
    '/product/chisel marker 1.png',
    '/product/grip 1.png',
    '/product/pentastic 1.png',
    '/product/trikon 1.png'
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div>
      <Navbar />

      {/* ── HERO ────────────────────────── */}
      <section className="hero" style={{ background: 'linear-gradient(165deg, #ffffff 50%, #fff9e6 100%)', minHeight: '85vh', paddingTop: 'calc(var(--nav-h) + 2rem)' }}>
        <motion.div
          className="hero-bg-glow"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="hero-content">
          <motion.div className="hero-eyebrow" variants={fadeUp} custom={0} initial="hidden" animate="visible">
            <div className="hero-eyebrow-line" style={{ height: '3px', width: '24px', background: 'var(--gold)' }} />
            <span className="label" style={{ color: 'var(--text-primary)', fontWeight: '800', letterSpacing: '0.2em' }}>ESTABLISHED EXCELLENCE</span>
          </motion.div>
          <motion.h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', letterSpacing: '-0.04em', lineHeight: '1.1', marginBottom: '1.2rem' }} variants={fadeUp} custom={0.1} initial="hidden" animate="visible">
            Mastering the Art of<br />
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Precision Writing</em>
          </motion.h1>
          <motion.p className="hero-desc" style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '1rem', lineHeight: '1.8' }} variants={fadeUp} custom={0.2} initial="hidden" animate="visible">
            NIKAN, a global-facing brand of Tirupati Colour Pens Pvt. Ltd. (est. 2008), specializes in the manufacturing of writing and coloring instruments for international importers and bulk distributors.
          </motion.p>
          <motion.p className="hero-desc" style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '2.5rem', lineHeight: '1.8' }} variants={fadeUp} custom={0.25} initial="hidden" animate="visible">
            Backed by ISO 9001:2015 certified processes, BIS-certified product categories, and automated assembly line production, we deliver consistent quality at scale. With integrated manufacturing of key components and a strong focus on precision and reliability, NIKAN is built to be a dependable partner for global supply.
          </motion.p>

          <motion.div className="hero-actions" variants={fadeUp} custom={0.3} initial="hidden" animate="visible">
            <Link to="/products" className="btn-primary" style={{ boxShadow: 'var(--shadow-gold)', padding: '14px 32px' }}>Explore Products <ArrowRight size={18} /></Link>
            <Link to="/contact" className="btn-ghost" style={{ borderBottom: '2px solid var(--gold)', borderRadius: '0', padding: '8px 4px', fontWeight: '600' }}>
              Bulk Enquiries <span className="btn-ghost-arrow"><ChevronRight size={18} /></span>
            </Link>
          </motion.div>

          <motion.div className="hero-stats" variants={fadeIn} custom={0.5} initial="hidden" animate="visible">
            <div style={{ flex: 1 }}>
              <div className="hero-stat-number" style={{ color: 'var(--gold)', fontSize: '2.2rem' }}><CountUp target={20} suffix="+" /></div>
              <div className="hero-stat-label" style={{ fontSize: '0.65rem' }}>Global Markets</div>
            </div>
            <div style={{ flex: 1, borderLeft: '1px solid var(--border-dim)', paddingLeft: '2rem' }}>
              <div className="hero-stat-number" style={{ color: 'var(--gold)', fontSize: '2.2rem' }}><CountUp target={100} suffix="+" /></div>
              <div className="hero-stat-label" style={{ fontSize: '0.65rem' }}>Precision SKUs</div>
            </div>
            <div style={{ flex: 1, borderLeft: '1px solid var(--border-dim)', paddingLeft: '2rem' }}>
              <div className="hero-stat-number" style={{ color: 'var(--gold)', fontSize: '2.2rem' }}><CountUp target={15} suffix="+" /></div>
              <div className="hero-stat-label" style={{ fontSize: '0.65rem' }}>Years Active</div>
            </div>
          </motion.div>
        </div>
        <motion.div className="hero-slider-container" variants={fadeIn} custom={0.4} initial="hidden" animate="visible">
          <motion.div
            className="slider-content-wrap"
            whileHover={{ rotateY: 5, rotateX: -2, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide}
                src={slides[currentSlide]}
                alt={`Nikan Pen slide ${currentSlide + 1}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="slider-main-img"
              />
            </AnimatePresence>
            <div className="slider-badge">
              MADE IN INDIA
            </div>

            <div className="slider-dots-wrap">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`slider-dot ${i === currentSlide ? 'active' : ''}`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── TRUST STRIP ─────────────────────── */}
      <div className="ticker-wrapper" aria-hidden="true" style={{ background: 'var(--bg-dark-pro)', border: 'none', padding: '1.2rem 0' }}>
        <div className="ticker-track" style={{ animationDuration: '40s' }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} className="ticker-item" style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: '700' }}>
              {item}
              <span className="ticker-dot" style={{ background: 'var(--gold)', opacity: 0.3 }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── BRANDS PREVIEW ────────────── */}
      <section className="section brands-section" id="brands" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-dim)', padding: '5rem 0' }}>
        <AnimatedSection>
          <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <motion.span className="label" variants={fadeUp} custom={0} style={{ background: 'var(--gold)', color: '#000', padding: '4px 10px', borderRadius: '4px', fontWeight: '800' }}>OUR COLLECTIONS</motion.span>
            <motion.h2 className="section-title" style={{ fontSize: '2.8rem', marginTop: '1rem' }} variants={fadeUp} custom={0.1}>A Range Built for<br /><em style={{ color: 'var(--gold)' }}>Every Persona</em></motion.h2>
            <motion.p className="section-desc" style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: '0.5rem auto 0', maxWidth: '600px' }} variants={fadeUp} custom={0.2}>
              From executive luxury to student essentials — Nikan engineering serves every segment with world-class precision.
            </motion.p>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <div className="brands-grid">
            {BRANDS.map((brand, i) => (
              <TiltCard key={brand.name} className="brand-card-tilt-wrap">
                <motion.div
                  className="brand-card"
                  variants={fadeUp}
                  custom={i * 0.07}
                >
                  <div className="brand-card-icon">{brand.icon}</div>
                  <div className="brand-card-name">{brand.name}</div>
                  <span className="brand-card-tag">{brand.tag}</span>
                  <div className="brand-card-desc">{brand.desc}</div>
                  <div className="brand-card-explore">
                    Explore Collection <ArrowRight size={14} />
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link to="/brands" className="btn-primary" style={{ padding: '14px 36px' }}>Explore Full Portfolio <ArrowRight size={18} /></Link>
          </div>
        </AnimatedSection>
      </section>

      {/* ── FEATURED PRODUCTS ────────── */}
      <section className="section featured-products" style={{ background: '#fff', padding: '5rem 0', overflow: 'hidden' }}>
        <AnimatedSection>
          <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <motion.span className="label" variants={fadeUp} custom={0} style={{ color: 'var(--gold)', fontWeight: '800' }}>OUR BESTSELLERS</motion.span>
            <motion.h2 className="section-title" style={{ fontSize: '2.8rem', marginTop: '1rem' }} variants={fadeUp} custom={0.1}>Featured <em>Writing</em> Instruments</motion.h2>
          </div>
        </AnimatedSection>

        <div className="container-fluid" style={{ padding: '0 4rem' }}>
          <ProductCarousel />
        </div>
      </section>

      {/* ── CREDENTIALS ───────────────── */}
      <section className="section creds-section" id="credentials" style={{ background: '#fff', padding: '6rem 0' }}>
        <AnimatedSection>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span className="label" style={{ color: 'var(--gold)', fontWeight: '800' }}>WHY PARTNER WITH US</span>
              <h2 className="section-title" style={{ marginTop: '1rem', fontSize: '2.8rem' }}>Certified Quality, <em>Global Trust</em></h2>
              <p className="section-desc" style={{ marginTop: '1.2rem', color: 'var(--text-muted)', maxWidth: '750px', margin: '1.2rem auto 0' }}>
                Tirupati Colour Pens Pvt. Ltd. is a DGFT-recognised One Star Export House
                with ISO 9001:2015 certification, ensuring every pen meets international standards.
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {CREDS.map((c, i) => (
                <motion.div key={c.title} variants={fadeUp} custom={i * 0.1}
                  style={{ padding: '2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s' }}>
                  <div style={{ width: '64px', height: '64px', background: 'var(--gold)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 10px 20px rgba(212,175,55,0.3)' }}>
                    {c.icon}
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '1.3rem', marginBottom: '0.8rem', color: 'var(--text-primary)' }}>{c.title}</div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>{c.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>


      {/* ── CTA ───────────────────────── */}
      <section className="cta-section" id="contact" style={{ background: 'var(--bg-dark-pro)', color: '#fff', padding: '6rem 0' }}>
        <AnimatedSection>
          <motion.span className="label" variants={fadeUp} custom={0} style={{ color: 'var(--gold)', fontWeight: '800' }}>GLOBAL PARTNERSHIPS</motion.span>
          <motion.h2 className="section-title serif" variants={fadeUp} custom={0.1} style={{ color: '#fff', fontSize: '3rem', marginTop: '1rem' }}>Let's Build Something<br /><em style={{ color: 'var(--gold)' }}>Meaningful</em></motion.h2>
          <motion.p className="section-desc" style={{ margin: '1.2rem auto 0', textAlign: 'center', color: 'rgba(255,255,255,0.7)', maxWidth: '580px' }} variants={fadeUp} custom={0.2}>
            We invite distributors and institutional buyers worldwide to join the Nikan family.
            Experience engineering excellence in every stroke.
          </motion.p>
          <motion.div className="cta-actions" variants={fadeUp} custom={0.3} style={{ marginTop: '3rem' }}>
            <Link to="/contact" className="btn-primary" style={{ background: '#fff', color: '#000', padding: '14px 32px' }}><Mail size={16} /> Contact Sales</Link>
            <Link to="/exports" className="btn-ghost" style={{ color: '#fff' }}><Globe size={16} /> Export Markets <span className="btn-ghost-arrow"><ChevronRight size={15} /></span></Link>
          </motion.div>
          <motion.div variants={fadeIn} custom={0.5}
            style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
            <MapPin size={14} /> BISHNUPUR, SOUTH 24 PARGANAS, WB — 743503, INDIA
          </motion.div>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
}
