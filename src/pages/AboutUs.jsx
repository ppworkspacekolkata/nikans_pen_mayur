import { motion, useInView, useScroll, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ShieldCheck, Award, Globe, Factory, Target, Heart, Eye, Users, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import sunilPhoto from '../assets/photos/Sunil Kumar.jpg';
import nitinPhoto from '../assets/photos/Nitin Kanodia.jpg';
import nishantPhoto from '../assets/photos/Nishant Kanodia.jpg';
import infra1 from '../assets/photos/img331.jpg';
import infra2 from '../assets/photos/img379.jpg';
import infra3 from '../assets/photos/img349.jpg';
import infra4 from '../assets/photos/img408.jpg';
import infra5 from '../assets/photos/img1644.jpg';
import infra6 from '../assets/photos/img740.jpg';
import legacyPen from '../assets/legacy-pen-art.png';
import logo from '../assets/logo.png';

// Inline SVGs for Brand Icons
const LinkedInIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] } }),
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

function AnimatedPath({ scrollYProgress }) {
  const pathLength = useSpring(scrollYProgress, { stiffness: 300, damping: 30 });
  return (
    <svg className="timeline-svg" viewBox="0 0 10 100" preserveAspectRatio="none" style={{ position: 'absolute', left: '110px', top: 0, bottom: 0, width: '2px', height: '100%', zIndex: 1 }}>
      <motion.line x1="5" y1="0" x2="5" y2="100" stroke="var(--gold)" strokeWidth="2" style={{ pathLength }} />
    </svg>
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
      <div style={{ transform: 'translateZ(20px)', width: '100%', height: '100%' }}>
        {children}
      </div>
    </motion.div>
  );
}

const VALUES = [
  { icon: <ShieldCheck size={22} />, title: 'Uncompromising Quality', desc: 'Every product line undergoes rigorous QC aligned with ISO 9001:2015 standards before reaching our customers.' },
  { icon: <Globe size={22} />, title: 'Global Perspective', desc: 'We think beyond borders — engineering products that meet the expectations of buyers across four continents.' },
  { icon: <Target size={22} />, title: 'Innovation-Led Design', desc: 'From ergonomic grips to nickel-silver tips, every design decision is rooted in a better writing experience.' },
  { icon: <Factory size={22} />, title: 'Manufacturing Integrity', desc: 'Our West Bengal facility operates with precision manufacturing protocols, monitored at every production stage.' },
  { icon: <Heart size={22} />, title: 'Purpose for Every Writer', desc: 'From a child holding their first pen to a professional signing a deal — we make writing instruments for every life stage.' },
  { icon: <Award size={22} />, title: 'Recognised Excellence', desc: 'Honoured as a DGFT One Star Export House by the Ministry of Commerce & Industry, Government of India.' },
];

const TIMELINE = [
  { year: 'Founded', text: 'Tirupati Colour Pens Pvt. Ltd. established in West Bengal with a singular focus on writing instruments.' },
  { year: 'ISO Cert.', text: 'Achieved ISO 9001:2015 certification through ROHS Certification Pvt. Ltd., validating our quality management systems.' },
  { year: 'Nikan Brand', text: 'Launched the Nikan sub-brand with the tagline "Just Write It" — creating a unified consumer identity across product lines.' },
  { year: 'Export Growth', text: 'Recognised as a One Star Export House by DGFT, marking active distribution across the Middle East, Africa, Asia, and Europe.' },
  { year: 'Today', text: 'Serving 20+ countries with 50+ product SKUs spanning premium, everyday, and student writing instrument categories.' },
];

export default function AboutUs() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <div className="page-about" ref={containerRef}>
      <Navbar />

      {/* ── PAGE HERO ─────────────────────── */}
      <section className="page-hero-premium">
        <div className="page-hero-content">
          <motion.span className="label-gold" variants={fadeUp} custom={0} initial="hidden" animate="visible">
            Our Legacy
          </motion.span>
          <motion.h1 className="page-hero-title" variants={fadeUp} custom={0.1} initial="hidden" animate="visible">
            Crafting the Tools<br />That <em>Shape Ideas</em>
          </motion.h1>
          <motion.p className="page-hero-desc" variants={fadeUp} custom={0.2} initial="hidden" animate="visible">
            For over a decade, Nikan has been engineering precision writing instruments
            that blend Indian manufacturing heritage with global quality benchmarks.
          </motion.p>
        </div>
        <div className="page-hero-scroll-hint">
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── LEGACY BROCHURE SECTION ───────── */}
      <section className="about-legacy-section">
        <div className="legacy-header">
          <div className="legacy-logo-box">
            <img src={logo} alt="Nikan Logo" style={{ height: '65px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <h2 className="legacy-header-title">About the Company</h2>
        </div>

        <div className="legacy-content legacy-grid-container">
          <div className="leadership-portrait-wrap">
            <Reveal>
              <div style={{ position: 'relative', padding: '10px', background: '#fff', border: '1px solid var(--border)', boxShadow: '15px 15px 0px var(--gold-dim)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ borderLeft: '4px solid var(--gold)', paddingLeft: '2rem' }}>
                  <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    "When I began this journey, the objective was simple—to build a manufacturing organization driven by precision, discipline, and long-term reliability."
                  </p>
                  <p className="label" style={{ marginTop: '1rem', color: 'var(--gold)' }}>Sunil Kumar Kanodia, Founder</p>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="legacy-text-col" style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              <span className="legacy-highlight" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Tirupati Colour Pens Pvt. Ltd.</span>, established in 2008, is a manufacturer of writing and coloring instruments with a strong foundation in precision engineering and process-driven production.
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              The company operates through its established domestic brand BALAJI and its global-facing brand NIKAN, designed to serve the evolving requirements of international importers and bulk distributors.
            </p>
            <p>
              Under the leadership of Mr. Sunil Kumar Kanodia, the organization has developed an integrated manufacturing ecosystem focused on efficiency, consistency, and scalability. With direct control over production processes and a streamlined operational structure, the company ensures uniform quality across large volumes.
            </p>
          </div>
        </div>

        <div className="legacy-content legacy-grid-container" style={{ marginTop: '0' }}>
          <div className="legacy-text-col" style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            <Reveal>
              <div>
                <p style={{ marginBottom: '1.5rem' }}>
                  The manufacturing facility, based in Kolkata, India, is equipped for in-house production of key components and this level of vertical integration, supported by sourcing from leading suppliers, enables tight control over product performance and long-term consistency.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                  Production is driven through automated assembly lines, ensuring precision, repeatability, and reliability across every batch.
                </p>
                <p>
                  The company follows ISO 9001:2015 certified processes, and its key product categories comply with EN71 and BIS standards, reinforcing its commitment to quality, safety, and compliance for global markets.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="legacy-illust-wrap">
            <Reveal delay={0.2}>
              <div style={{ position: 'relative' }}>
                <motion.img
                  src={legacyPen}
                  alt="Artistic Pen Illustration"
                  className="legacy-illust"
                  initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                  whileInView={{ opacity: 0.95, scale: 1, rotate: -2 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ width: '100%', maxWidth: '300px', opacity: 0.6 }}
                />
              </div>
            </Reveal>
          </div>
        </div>
        <div className="legacy-footer-line" />
      </section>

      <section className="about-timeline-section" style={{ padding: '8rem 0', background: 'var(--bg)', overflow: 'hidden' }}>
        <div className="section-header timeline-header-centered" style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <Reveal>
            <span className="label">Our Journey</span>
            <h2 className="section-title">A Legacy of<br /><em>Constant Growth</em></h2>
          </Reveal>
        </div>

        <div className="timeline-container-pro" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem', position: 'relative' }}>
          {/* Vertical Line Background */}
          <div className="timeline-line-main" style={{ 
            position: 'absolute', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            top: 0, 
            bottom: 0, 
            width: '2px', 
            background: 'var(--border-dim)',
            zIndex: 1
          }} />
          
          {/* Animated Line Overlay */}
          <motion.div 
            style={{ 
              position: 'absolute', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              top: 0, 
              width: '2px', 
              background: 'var(--gold)',
              height: '100%',
              scaleY: scrollYProgress,
              transformOrigin: 'top',
              zIndex: 2,
              boxShadow: '0 0 15px var(--gold)'
            }} 
          />

          <div className="timeline-items-wrap">
            {TIMELINE.map((item, i) => (
              <Reveal key={item.year} delay={i * 0.1}>
                <div className={`timeline-item-pro ${i % 2 === 0 ? 'left' : 'right'}`}>
                  <div className="timeline-content-card">
                    <span className="timeline-year-tag">{item.year}</span>
                    <p className="timeline-text-pro">{item.text}</p>
                  </div>
                  <div className="timeline-dot-pro" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION, VISION AND VALUES ────────── */}
      <section className="brochure-section" style={{ background: 'var(--bg-secondary)', padding: '8rem 0' }}>
        <div className="brochure-inner" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="brochure-header" style={{ marginBottom: '6rem', background: 'var(--bg-dark-pro)', borderTop: '4px solid var(--gold)', padding: '2rem 3rem', boxShadow: 'var(--shadow-3d)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
            <img src={logo} alt="Nikan Logo" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
            <h2 className="brochure-header-title" style={{ color: '#fff', margin: 0 }}>Mission, Vision & Values</h2>
          </div>

          <div className="mvv-grid-new">
            <Reveal delay={0.1}>
              <div className="glass-card-pro" style={{ padding: '3.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="serif" style={{ fontSize: '1.8rem', color: 'var(--gold)', marginBottom: '1.5rem' }}>Mission</div>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1rem' }}>
                  <li style={{ marginBottom: '1rem' }}>Serving diverse customers with an efficient range of exquisite writing instruments.</li>
                  <li>Offering premium quality products globally at accessible and reasonable price rates.</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="glass-card-pro" style={{ background: 'var(--bg-dark-pro)', color: '#fff', border: '2px solid var(--gold)', padding: '3.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="serif" style={{ fontSize: '1.8rem', color: 'var(--gold)', marginBottom: '1.5rem' }}>Vision</div>
                <ul style={{ paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.8', fontSize: '1rem' }}>
                  <li style={{ marginBottom: '1rem' }}>To be the go-to stationery brand by building efficient and lasting global solutions.</li>
                  <li style={{ marginBottom: '1rem' }}>Building deeper relationships with our customers, who are our greatest strength.</li>
                  <li>Contributing to the ecosystem through high-quality, sustainable stationery.</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="glass-card-pro" style={{ padding: '3.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="serif" style={{ fontSize: '1.8rem', color: 'var(--gold)', marginBottom: '1.5rem' }}>Values</div>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1rem' }}>
                  <li style={{ marginBottom: '1rem' }}>Empowering the future through education and active community support.</li>
                  <li style={{ marginBottom: '1rem' }}>Believing in the power of the written word to build a stronger and better nation.</li>
                  <li>Offering essential tools to underprivileged minds across India.</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── WHY US AND USPs ─────────────── */}
      <section className="section usps-section" style={{ background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Reveal>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <span className="label">Competitive Edge</span>
              <h2 className="section-title">The <em>Nikan</em> Advantage</h2>
            </div>
          </Reveal>

          <div className="usp-grid-pro">
            <Reveal delay={0.1}>
              <div className="usp-card-pro" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', height: '100%' }}>
                <div className="usp-icon-wrap" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--gold)' }}>🏭</div>
                <div className="serif" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>High-Capacity Manufacturing</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>Modern infrastructure with advanced high-speed automation.</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="usp-card-pro" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', height: '100%' }}>
                <div className="usp-icon-wrap" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--gold)' }}>✨</div>
                <div className="serif" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Premium & Diverse Range</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>Pioneering stationery designs that outperform industry peers.</p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="usp-card-pro" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', height: '100%' }}>
                <div className="usp-icon-wrap" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--gold)' }}>🎨</div>
                <div className="serif" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Superior Vibrancy</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>Consistent, high-quality ink across a massive array of categories.</p>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="usp-card-pro" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', height: '100%' }}>
                <div className="usp-icon-wrap" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--gold)' }}>📍</div>
                <div className="serif" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Kolkata Heritage</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>Headquartered in West Bengal, serving the global demand.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── EXECUTIVE GALLERY ────────────────── */}
      <section className="section executive-gallery" style={{ padding: '8rem 0', background: '#fff' }}>
        <Reveal>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <span className="label">Our Principals</span>
            <h2 className="section-title">The <em>Leadership</em> Board</h2>
          </div>
        </Reveal>

        <div className="leader-gallery-entries" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8rem' }}>

          {/* Sunil - Left Image */}
          <div className="pro-leader-entry">
            <TiltCard className="pro-leader-card">
              <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: 'var(--border-thick)', boxShadow: 'var(--shadow-3d)', maxWidth: '320px' }}>
                <img src={sunilPhoto} alt="Sunil Kumar Kanodia" style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover' }} />
              </div>
            </TiltCard>
            <Reveal delay={0.1}>
              <div className="pro-leader-info">
                <span className="label-gold" style={{ background: 'var(--gold-dim)', padding: '4px 12px', borderRadius: '4px' }}>Chairman</span>
                <h3 className="serif" style={{ fontSize: '2.5rem', margin: '1rem 0' }}>Mr. Sunil Kumar Kanodia</h3>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '2rem' }}>
                  A first-generation entrepreneur, Mr. Kanodia laid the foundation of Nikan back in the early 1990s.
                  His visionary approach to precision manufacturing has transformed Nikan
                  from a domestic refill supplier into one of India’s most respected export houses.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'inherit' }}>
                  <a href="#" style={{ color: 'var(--gold)' }}><LinkedInIcon size={22} /></a>
                  <a href="mailto:exports@tirupaticolorpens.com" style={{ color: 'var(--gold)' }}><Mail size={22} /></a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Nitin - Right Image */}
          <div className="pro-leader-entry">
            <Reveal delay={0.1}>
              <div className="pro-leader-info">
                <span className="label-gold" style={{ background: 'var(--gold-dim)', padding: '4px 12px', borderRadius: '4px' }}>Director</span>
                <h3 className="serif" style={{ fontSize: '2.5rem', margin: '1rem 0' }}>Mr. Nitin Kanodia</h3>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '2rem' }}>
                  A Chartered Accountant and Gold Medalist from SRCC Delhi, Nitin has pioneered Nikan's
                  global strategy. Under his leadership, the brand has expanded into 20+ countries,
                  blending analytical financial rigor with a bold vision for international trade.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'inherit' }}>
                  <a href="#" style={{ color: 'var(--gold)' }}><LinkedInIcon size={22} /></a>
                  <a href="#" style={{ color: 'var(--gold)' }}><TwitterIcon size={22} /></a>
                </div>
              </div>
            </Reveal>
            <TiltCard className="pro-leader-card">
              <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: 'var(--border-thick)', boxShadow: 'var(--shadow-3d)', maxWidth: '320px' }}>
                <img src={nitinPhoto} alt="Nitin Kanodia" style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover' }} />
              </div>
            </TiltCard>
          </div>

          {/* Nishant - Left Image */}
          <div className="pro-leader-entry">
            <TiltCard className="pro-leader-card">
              <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: 'var(--border-thick)', boxShadow: 'var(--shadow-3d)', maxWidth: '320px' }}>
                <img src={nishantPhoto} alt="Nishant Kanodia" style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover' }} />
              </div>
            </TiltCard>
            <Reveal delay={0.1}>
              <div className="pro-leader-info">
                <span className="label-gold" style={{ background: 'var(--gold-dim)', padding: '4px 12px', borderRadius: '4px' }}>Director</span>
                <h3 className="serif" style={{ fontSize: '2.5rem', margin: '1rem 0' }}>Mr. Nishant Kanodia</h3>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '2rem' }}>
                  As a Chartered Accountant with a focus on operational modernization, Nishant has
                  revolutionized Nikan’s manufacturing footprint. He leading the charge in new product category development.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'inherit' }}>
                  <a href="#" style={{ color: 'var(--gold)' }}><LinkedInIcon size={22} /></a>
                  <a href="mailto:exports@tirupaticolorpens.com" style={{ color: 'var(--gold)' }}><Mail size={22} /></a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ───────────────── */}
      <section className="section about-certs-section">
        <div className="certs-layout">
          <Reveal>
            <span className="label">Credentials</span>
            <h2 className="section-title" style={{ marginTop: '0.8rem' }}>Backed by Certification,<br /><em>Driven by Standards</em></h2>
            <p className="section-desc" style={{ marginTop: '1rem' }}>
              Our quality credentials are independently verified and government-recognised — giving buyers
              and partners the confidence to choose Nikan.
            </p>
          </Reveal>
          <div className="certs-cards">
            <Reveal delay={0.1}>
              <div className="cert-card">
                <div className="cert-card-top">
                  <div className="cert-logo">ISO</div>
                  <div className="cert-badge-tag">Certified</div>
                </div>
                <div className="cert-title">ISO 9001:2015</div>
                <div className="cert-issuer">Issued by ROHS Certification Pvt. Ltd.</div>
                <p className="cert-desc">
                  Our Quality Management System has been assessed and found to conform to ISO 9001:2015
                  for the manufacturing and marketing of fibre tip pens, markers, ball point pens and direct fill pens.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="cert-card">
                <div className="cert-card-top">
                  <div className="cert-logo" style={{ fontSize: '1rem' }}>DGFT</div>
                  <div className="cert-badge-tag">Recognised</div>
                </div>
                <div className="cert-title">One Star Export House</div>
                <div className="cert-issuer">Govt. of India — Ministry of Commerce &amp; Industry</div>
                <p className="cert-desc">
                  Recognised by the Directorate General of Foreign Trade under the Foreign Trade Policy 2023,
                  in accordance with the Book of Procedures.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
}