import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Award, Globe, ShieldCheck, Package,
  Pen, Palette, Highlighter, ChevronRight, Mail, MapPin,
  ArrowLeft, ChevronLeft, Layers
} from 'lucide-react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import heroBg from '../assets/hero-bg.png';
// Old slide imports removed

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PRODUCTS } from '../data/products';
import API_BASE_URL, { API_ENDPOINTS, getImageUrl } from '../config/api';


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



export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSettings, setHeroSettings] = useState(null);
  const [heroLoading, setHeroLoading] = useState(true);

  useEffect(() => {
    const fetchHeroSettings = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.HERO_SETTINGS);
        const data = await res.json();
        setHeroSettings(data);
      } catch (err) {
        console.error("Hero Settings Error:", err);
      } finally {
        setHeroLoading(false);
      }
    };
    fetchHeroSettings();
  }, []);

  useEffect(() => {
    if (heroSettings?.images?.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSettings.images.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [heroSettings?.images]);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [loading, setLoading] = useState(true);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.PRODUCTS);
        const data = await res.json();
        // Take last 6 products (newest first)
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
        setRecentProducts(sorted);
      } catch (err) {
        console.error("Fetch Products Error:", err);
      }
    };
    fetchRecentProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.CATEGORIES);
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) setActiveTab(data[0].name);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    const fetchSubCategories = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.SUB_CATEGORIES);
        const data = await res.json();
        setSubCategories(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    const loadData = async () => {
      await Promise.all([fetchCategories(), fetchSubCategories()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredSubCategories = subCategories.filter(s => (s.category?.name || s.category) === activeTab);

  return (
    <div>
      <Navbar />

      {/* ── HERO ────────────────────────── */}
      <section className="hero" style={{
        background: '#fffef5',
        minHeight: '100vh',
        paddingTop: 'calc(var(--nav-h) + 2rem)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container hero-container" style={{
          maxWidth: '1500px',
          margin: '0 auto',
          padding: '0 2rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>

          {/* Left Column: Text Content */}
          <div className="hero-content">
            <AnimatePresence mode="wait">
              <motion.div
                key="hero-text"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.1, duration: 0.6 } }
                }}
              >
                <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2.5rem' }}>
                  <div style={{ height: '3px', width: '25px', background: 'var(--gold)' }} />
                  <span style={{ color: '#1a1f2e', fontWeight: '800', letterSpacing: '0.1em', fontSize: '0.75rem', textTransform: 'uppercase' }}>ESTABLISHED EXCELLENCE</span>
                </motion.div>

                <motion.h1
                  className="page-hero-title"
                  variants={fadeUp}
                  style={{
                    lineHeight: '1.2',
                    marginBottom: '2rem',
                    color: '#1a1f2e',
                    fontWeight: '900',
                  }}
                >
                  {heroSettings?.title || "Mastering the Art of"}{" "}
                  <span style={{
                    color: 'var(--gold)',
                    fontWeight: '900'
                  }}>
                    {heroSettings?.subtitle || "Precision Writing"}
                  </span>
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  style={{
                    fontSize: '1rem',
                    color: '#64748b',
                    maxWidth: '650px',
                    marginBottom: '1.5rem',
                    lineHeight: '1.8',
                    fontWeight: '500'
                  }}
                >
                  {heroSettings?.description || "NIKAN, a global-facing brand of Tirupati Colour Pens Pvt. Ltd. (est. 2008), specializes in the manufacturing of writing and coloring instruments for international importers and bulk distributors."}
                </motion.p>
                {heroSettings?.description2 && (
                  <motion.p
                    variants={fadeUp}
                    style={{
                      fontSize: '1rem',
                      color: '#64748b',
                      maxWidth: '650px',
                      marginBottom: '3rem',
                      lineHeight: '1.8',
                      fontWeight: '500'
                    }}
                  >
                    {heroSettings.description2}
                  </motion.p>
                )}


                <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                  <Link to="/products" className="btn-primary" style={{
                    padding: '16px 40px',
                    borderRadius: '50px',
                    fontSize: '0.95rem',
                    fontWeight: '800',
                    background: 'var(--gold)',
                    color: '#fff',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 10px 25px rgba(212,175,55,0.2)'
                  }}>
                    EXPLORE PRODUCTS <ArrowRight size={18} />
                  </Link>
                  <Link to="/contact" style={{
                    textDecoration: 'none',
                    color: '#1a1f2e',
                    fontWeight: '700',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    Bulk Enquiries <ChevronRight size={20} />
                  </Link>
                </motion.div>

                {/* Simple White Stats Card with More Spacing */}
                <motion.div
                  className="hero-stats-card"
                  variants={fadeUp}
                >
                  {(heroSettings?.stats || [
                    { value: '20+', label: 'GLOBAL MARKETS' },
                    { value: '100+', label: 'PRECISION SKUS' },
                    { value: '15+', label: 'YEARS ACTIVE' }
                  ]).map((stat, idx) => (
                    <React.Fragment key={idx}>
                      <div className="hero-stat-item">
                        <div style={{ color: 'var(--gold)', fontSize: '2.2rem', fontWeight: '900', marginBottom: '5px' }}>
                          <CountUp target={parseInt(stat.value) || 0} suffix={stat.value.toString().includes('+') ? '+' : ''} />
                        </div>
                        <div style={{ fontSize: '0.6rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em' }}>{stat.label}</div>
                      </div>
                      {idx < 2 && <div className="hero-stat-divider" />}
                    </React.Fragment>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Slider Card */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <motion.div 
              variants={fadeUp} 
              initial="hidden"
              animate="visible"
              className="hero-slider-card"
              style={{
                width: '100%',
                maxWidth: '500px',
                margin: '0 auto',
                background: '#fff',
                borderRadius: '20px',
                boxShadow: 'var(--shadow-lg)',
                padding: '1.5rem',
                border: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                height: 'auto'
              }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', background: '#f8fafc', borderRadius: '15px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {heroSettings?.images?.length > 0 ? (
                      <img
                        src={getImageUrl(heroSettings.images[currentSlide])}
                        alt="Nikan Product"
                        style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain' }}
                      />
                    ) : (
                      <div style={{ color: '#cbd5e1' }}>No Slides Added</div>
                    )}
                  </motion.div>
                </AnimatePresence>
                
                <div style={{ position: 'absolute', top: '15px', left: '15px' }}>
                  <div style={{ background: 'var(--gold)', color: '#000', padding: '6px 12px', borderRadius: '4px', fontWeight: '800', fontSize: '0.65rem' }}>
                    MADE IN INDIA
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                   <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                     <span style={{ fontSize: '0.5rem', fontWeight: '900' }}>0.7</span>
                     <span style={{ fontSize: '0.35rem', color: '#94a3b8' }}>TIP</span>
                   </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(heroSettings?.images || [1, 2, 3, 4, 5, 6, 7]).map((_, i) => (
                    <div key={i} style={{ width: '6px', height: '6px', background: i === currentSlide ? 'var(--gold)' : '#cbd5e1', borderRadius: '50%', transition: '0.3s' }} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
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

      {/* ── NEW COLLECTIONS PREVIEW ────────────── */}
      <section className="section brands-section" id="brands" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-dim)', padding: '6rem 0' }}>
        <AnimatedSection>
          <div className="section-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <motion.span className="label" variants={fadeUp} custom={0} style={{ background: 'var(--gold)', color: '#000', padding: '4px 12px', borderRadius: '4px', fontWeight: '800' }}>OUR COLLECTIONS</motion.span>
            <motion.h2 className="section-title" style={{ fontSize: '3rem', marginTop: '1.2rem' }} variants={fadeUp} custom={0.1}>Explore Our <em>Versatile Range</em></motion.h2>

            {/* Category Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem', flexWrap: 'wrap' }}>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => setActiveTab(c.name)}
                  style={{
                    padding: '12px 32px',
                    borderRadius: '50px',
                    border: '1px solid',
                    borderColor: activeTab === c.name ? 'var(--gold)' : 'var(--border-dim)',
                    background: activeTab === c.name ? 'var(--gold)' : 'transparent',
                    color: activeTab === c.name ? '#000' : 'var(--text-secondary)',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: activeTab === c.name ? '0 10px 20px rgba(212,175,55,0.2)' : 'none'
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <div className="container" style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 2rem' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}
            >
              {filteredSubCategories.map((sub, i) => (
                <Link to={`/products?subCategory=${sub.slug}`} key={sub._id} className="product-card-link" style={{ textDecoration: 'none' }}>
                  <TiltCard>
                    <div className="brand-card" style={{ height: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <div style={{ height: '180px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', background: '#f8f8f8', borderRadius: '12px', padding: '1rem' }}>
                        {sub.image ? (
                          <img src={getImageUrl(sub.image)} alt={sub.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                        ) : (
                          <Layers size={64} color="var(--gold)" opacity={0.5} />
                        )}
                      </div>
                      <span className="brand-card-tag" style={{ background: 'var(--gold-dim)', color: 'var(--gold)', padding: '2px 8px', fontSize: '0.65rem', textTransform: 'uppercase' }}>Sub-Category</span>
                      <h3 className="serif" style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: '0.8rem 0 0.4rem', fontWeight: '800' }}>{sub.name}</h3>
                      {sub.description && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{sub.description}</p>
                      )}

                      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', fontWeight: '700', fontSize: '0.85rem' }}>
                        View Products <ChevronRight size={16} />
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link to="/products" className="btn-primary" style={{ padding: '14px 44px' }}>
              Browse Full Catalogue <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>


      {/* ── OUR PREFERENCE PRODUCTS ────────────── */}
      <section className="section pref-products-section" style={{ background: '#fff', padding: '6rem 0' }}>
        <AnimatedSection>
          <div className="section-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <motion.span className="label" variants={fadeUp} custom={0} style={{ color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px' }}>EXPERT CHOICES</motion.span>
            <motion.h2 className="section-title" style={{ fontSize: '3rem', marginTop: '1rem' }} variants={fadeUp} custom={0.1}>Our <em>Preference Products</em></motion.h2>
          </div>
        </AnimatedSection>

        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '2.5rem',
            rowGap: '4rem' 
          }}>
            {recentProducts.map((p, i) => (
              <AnimatedSection key={p._id}>
                <Link to={`/product/${p.slug}`} className="product-card-link" style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                  <div className="product-card glass-card-pro" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease' }}>
                    <div className="product-card-image" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-dim)', marginBottom: '1.5rem', background: '#fff' }}>
                      <img src={getImageUrl(p.mainImage)} alt={p.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'contain', padding: '1.2rem' }} />
                    </div>
                    
                    <div className="product-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="label-gold" style={{ margin: 0 }}>{p.skuCode}</span>
                      <span className="product-card-cat" style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--gold)' }}>{p.subCategory?.name || p.category?.name}</span>
                    </div>

                    <div className="product-card-name" style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: '0.8rem', color: 'var(--text-primary)', fontWeight: '800' }}>{p.name}</div>
                    <p className="product-card-desc" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem', flexGrow: 1 }}>{p.description?.substr(0, 85)}...</p>
                    
                    <div className="product-card-specs" style={{ background: 'var(--bg-secondary)', padding: '1rem 1.2rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid var(--border-dim)' }}>
                      <div className="product-spec" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Material</span>
                        <span style={{ fontWeight: '700' }}>{p.material}</span>
                      </div>
                      <div className="product-spec" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Tip Size</span>
                        <span style={{ fontWeight: '700' }}>{p.tip}</span>
                      </div>
                      <div className="product-spec" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Pack</span>
                        <span style={{ fontWeight: '700' }}>{p.primaryPack}</span>
                      </div>
                    </div>

                    <div className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem', padding: '12px' }}>
                      View Enterprise Specs <ArrowRight size={14} style={{ marginLeft: '8px' }}/>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <Link to="/products" className="btn-primary" style={{ padding: '16px 48px' }}>
              View All Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>


      {/* ── CREDENTIALS ───────────────── */}
      <section className="section creds-section" id="credentials" style={{ background: '#fff' }}>
        <AnimatedSection>
          <div className="creds-layout" style={{ display: 'block', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <div className="creds-text-col" style={{ paddingRight: 0 }}>
              <span className="label" style={{ color: 'var(--gold)', fontWeight: '800' }}>WHY PARTNER WITH US</span>
              <h2 className="section-title" style={{ marginTop: '1rem', fontSize: '2.8rem' }}>Certified Quality, <em>Global Trust</em></h2>
              <p className="section-desc" style={{ maxWidth: '700px', margin: '1.2rem auto 0', color: 'var(--text-muted)' }}>
                Tirupati Colour Pens Pvt. Ltd. is a DGFT-recognised One Star Export House
                with ISO 9001:2015 certification, ensuring every pen meets international standards.
              </p>
              <div className="creds-list" style={{
                marginTop: '3.5rem',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: '2rem',
                flexWrap: 'wrap'
              }}>
                {CREDS.map((c, i) => (
                  <motion.div key={c.title} className="cred-item" variants={fadeUp} custom={i * 0.1}
                    style={{
                      flex: '1',
                      minWidth: '280px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      padding: '2.5rem 1.5rem',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-dim)',
                      borderRadius: 'var(--radius-lg)'
                    }}>
                    <div className="cred-icon" style={{
                      width: '60px',
                      height: '60px',
                      background: 'var(--gold)',
                      color: '#000',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem'
                    }}>
                      {c.icon}
                    </div>
                    <div>
                      <div className="cred-item-title" style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{c.title}</div>
                      <div className="cred-item-desc" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* <div className="creds-image-wrap" style={{ position: 'relative' }}>
              <img className="creds-image" src={heroBg} alt="Nikan manufacturing" style={{ height: '520px', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} />
              <div className="creds-badge" style={{ padding: '1.5rem', boxShadow: 'var(--shadow-lg)', bottom: '20px', right: '20px' }}>
                <div className="creds-badge-num" style={{ fontSize: '2.2rem', fontWeight: '800' }}>ISO</div>
                <div className="creds-badge-text" style={{ fontSize: '0.7rem', fontWeight: '700' }}>9001:2015<br />CERTIFIED</div>
              </div>
            </div> */}
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
