import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Pen, Award, Palette, Highlighter, Package, Star } from 'lucide-react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: d, ease: [0.22,1,0.36,1] } }),
};

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} variants={fadeUp} custom={delay} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
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
    x.set(0); y.set(0);
  }

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
    >
      <div style={{ transform: 'translateZ(30px)', width: '100%', height: '100%' }}>
        {children}
      </div>
    </motion.div>
  );
}

const BRANDS = [
  {
    name: 'Auram',
    tagline: 'Premium Ball Pen',
    tag: 'Premium',
    icon: <Pen size={32}/>,
    accent: '#c9a84c',
    specs: ['0.7mm Fine Tip', 'Nickel Silver Tip', 'Smooth Ink Flow', '10 PCS / Box'],
    desc: 'The Auram is Nikan\'s flagship premium writing instrument. Designed for the discerning professional, it features a gold-accented cap, precision-machined nickel silver tip, and ultra-smooth ink distribution. Available in blue and black ink.',
    categories: ['Professional', 'Gifting', 'Export'],
  },
  {
    name: 'Aventus',
    tagline: 'Signature Ball Pen',
    tag: 'Signature',
    icon: <Award size={32}/>,
    accent: '#6b8cba',
    specs: ['1.0mm Broad Tip', 'Nickel Silver Tip', 'Bold Stroke', '10 Units'],
    desc: 'Aventus is engineered for bold, confident writing. The 1.0mm tip creates a rich, full stroke preferred by executives and presenters. The sleek body with technical-blue finish and gold accents commands attention on any desk.',
    categories: ['Executive', 'Corporate', 'Export'],
  },
  {
    name: 'Chisel',
    tagline: 'Washable Marker',
    tag: 'Markers',
    icon: <Palette size={32}/>,
    accent: '#4a9e6e',
    specs: ['Chisel Tip', 'Washable Formula', '10 Bold Colours', 'Non-Toxic'],
    desc: 'Chisel markers combine vivid colour output with a water-washable formula — safe for children and ideal for classrooms, art projects, and presentations. 10 bold shades per pack, in durable packaging.',
    categories: ['Education', 'Art & Craft', 'Retail'],
  },
  {
    name: 'Pentastic',
    tagline: 'Everyday Ball Pen',
    tag: 'Everyday',
    icon: <Pen size={32}/>,
    accent: '#a070c0',
    specs: ['0.7mm Fine Tip', 'Transparent Body', 'Multicolour Pack', 'Smooth Flow'],
    desc: 'Pentastic offers professional-grade smooth writing at an accessible price. Its clear barrel lets users track ink levels at a glance, and the 0.7mm fine tip suits everything from note-taking to exam use.',
    categories: ['Daily Use', 'Student', 'Retail'],
  },
  {
    name: 'Neo',
    tagline: 'Super Smooth Ball Pen',
    tag: 'Smooth Write',
    icon: <Highlighter size={32}/>,
    accent: '#4aaebd',
    specs: ['Ball Pen', 'Pastel Body', 'Super Smooth', '12 Units'],
    desc: 'Neo\'s distinctive pastel body makes it a favourite display item for retailers. Underneath the aesthetic is an engineered ball-point mechanism delivering consistently smooth flow, perfect for sustained writing sessions.',
    categories: ['Student', 'Retail', 'Gifting'],
  },
  {
    name: 'Kiddo',
    tagline: 'Student Ball Pen',
    tag: 'Student',
    icon: <Package size={32}/>,
    accent: '#e07850',
    specs: ['Ball Pen', 'Fun Design', 'Ergonomic Grip', '20 PCS / Box'],
    desc: 'Designed specifically for young writers, Kiddo pens feature an ergonomic body, friendly character artwork, and a smooth-flow ink mechanism that\'s easy for children to control. Sold in 20-unit consumer packs.',
    categories: ['Primary School', 'Student', 'Retail'],
  },
  {
    name: 'Aviator',
    tagline: 'Ball Point Pen',
    tag: 'Bold',
    icon: <Star size={32}/>,
    accent: '#e06040',
    specs: ['Ball Point', 'Metal Tip', 'Multi-Colour', '10 PCS'],
    desc: 'The Aviator line takes its cues from precision engineering. A bold aviation-inspired identity, metallic body finish, and a reliable ball-point mechanism make it one of the most recognisable Nikan lines in the market.',
    categories: ['Retail', 'Everyday', 'Student'],
  },
];

export default function Brands() {
  const [active, setActive] = useState(null);

  return (
    <div className="page-brands">
      <Navbar />

      {/* ── PAGE HERO ─────────────────────── */}
      <section className="page-hero page-hero--brands" style={{ background: 'linear-gradient(165deg, #fffdf7 40%, #fff4d6 100%)', borderBottom: 'var(--border-thick)' }}>
        <div className="page-hero-bg" style={{ opacity: 0.1 }} />
        <div className="page-hero-content">
          <motion.span className="label" variants={fadeUp} custom={0} initial="hidden" animate="visible">
            Our Portfolio
          </motion.span>
          <motion.h1 className="page-hero-title" variants={fadeUp} custom={0.1} initial="hidden" animate="visible" style={{ fontSize: 'clamp(3rem, 5vw, 4.2rem)' }}>
            Seven Brands.<br /><em>One Standard</em> of Quality.
          </motion.h1>
          <motion.p className="page-hero-desc" variants={fadeUp} custom={0.2} initial="hidden" animate="visible" style={{ fontSize: '1.2rem' }}>
            The Nikan portfolio spans every market segment — from premium gifting to school stationery — 
            each sub-brand engineered to own its category.
          </motion.p>
        </div>
      </section>

      {/* ── BRAND CARDS ─────────────────────── */}
      <section className="section brands-page-section">
        <div className="brands-page-grid">
          {BRANDS.map((brand, i) => (
            <Reveal key={brand.name} delay={i * 0.06}>
              <TiltCard className="brand-tilt-wrapper">
                <div
                  className={`brand-page-card${active === brand.name ? ' brand-page-card--open' : ''}`}
                  style={{ '--brand-accent': brand.accent }}
                  onClick={() => setActive(active === brand.name ? null : brand.name)}
                >
                  <div className="brand-page-card-header">
                    <div className="brand-page-icon">{brand.icon}</div>
                    <div>
                      <div className="brand-page-card-tag">{brand.tag}</div>
                      <div className="brand-page-card-name">{brand.name}</div>
                      <div className="brand-page-card-tagline">{brand.tagline}</div>
                    </div>
                    <div className="brand-page-expand">
                      <ArrowRight size={20} style={{ transform: active === brand.name ? 'rotate(90deg)' : 'none', transition: '0.3s' }} />
                    </div>
                  </div>

                  <div className="brand-page-specs">
                    {brand.specs.map(s => <span key={s} className="spec-pill">{s}</span>)}
                  </div>

                  {active === brand.name && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.4 }}>
                      <p className="brand-page-desc">{brand.desc}</p>
                      <div className="brand-page-cats">
                        {brand.categories.map(c => <span key={c} className="cat-tag">{c}</span>)}
                      </div>
                    </motion.div>
                  )}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>


      <Footer />
    </div>
  );
}
