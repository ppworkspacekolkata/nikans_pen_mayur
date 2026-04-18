import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe, ShieldCheck, Award, ArrowRight, FileText, Package } from 'lucide-react';
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

const REGIONS = [
  {
    flag: '🇦🇪', region: 'Middle East', accent: '#c47a3a',
    countries: ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman'],
    desc: 'Our strongest export market. Nikan writing instruments are distributed through established retail chains and stationery wholesalers across the GCC region.',
  },
  {
    flag: '🌍', region: 'Africa', accent: '#4a9e6e',
    countries: ['Nigeria', 'Kenya', 'Ghana', 'Tanzania', 'Ethiopia', 'Uganda'],
    desc: 'A rapidly growing market for Nikan\'s affordable everyday and student product lines. We partner with regional distributors to serve institutional and retail channels.',
  },
  {
    flag: '🌏', region: 'South & Southeast Asia', accent: '#4a7fbd',
    countries: ['Bangladesh', 'Nepal', 'Sri Lanka', 'Myanmar', 'Vietnam', 'Cambodia'],
    desc: 'Close geographic proximity positions Nikan as a cost-competitive alternative to European brands, with reliable supply chains into the subcontinent and ASEAN markets.',
  },
  {
    flag: '🌎', region: 'Expanding Markets', accent: '#a070c0',
    countries: ['East Europe (developing)', 'Central Asia (developing)', 'Latin America (pipeline)'],
    desc: 'Active market development underway. We welcome enquiries from prospective distributors in new geographies.',
  },
];

const CREDENTIALS = [
  { icon: <ShieldCheck size={24}/>, label: 'ISO 9001:2015', sub: 'Quality Management System' },
  { icon: <Award size={24}/>, label: 'One Star Export House', sub: 'DGFT — Govt. of India' },
  { icon: <Package size={24}/>, label: 'ROHS Certified', sub: 'Environmental Compliance' },
  { icon: <Globe size={24}/>, label: '20+ Countries', sub: 'Active export footprint' },
  { icon: <Award size={24}/>, label: 'FTP 2023', sub: 'Foreign Trade Policy Compliant' },
];

const PROCESS = [
  { step: '01', title: 'Initial Enquiry', desc: 'Contact us with your requirements — product lines, quantities, destination country, and any private-label preferences.' },
  { step: '02', title: 'Quotation & Samples', desc: 'We provide a formal quotation and dispatch product samples for quality review within 5–7 working days.' },
  { step: '03', title: 'Order Confirmation', desc: 'Upon sample approval and PO receipt, production is scheduled against agreed lead times.' },
  { step: '04', title: 'QC & Dispatch', desc: 'All export batches undergo pre-shipment quality inspection. We handle documentation — GR Waiver, SDF/FIRC, COO as required.' },
];

export default function Exports() {
  return (
    <div className="page-exports">
      <Navbar />

      {/* ── PAGE HERO ─────────────────────── */}
      <section className="page-hero-premium">
        <div className="page-hero-content">
          <motion.span className="label-gold" variants={fadeUp} custom={0} initial="hidden" animate="visible">
            Global Reach
          </motion.span>
          <motion.h1 className="page-hero-title" variants={fadeUp} custom={0.1} initial="hidden" animate="visible">
            From West Bengal<br />to the <em>World</em>
          </motion.h1>
          <motion.p className="page-hero-desc" variants={fadeUp} custom={0.2} initial="hidden" animate="visible">
            As a DGFT-recognised One Star Export House, Nikan actively supplies writing instruments 
            to distributors, retailers, and institutions across four continents.
          </motion.p>
        </div>
      </section>

      {/* ── CREDENTIALS STRIP ─────────────── */}
      <div className="exports-cred-strip">
        {CREDENTIALS.map((c, i) => (
          <div key={c.label} className="exports-cred-item">
            <span className="exports-cred-icon">{c.icon}</span>
            <div>
              <div className="exports-cred-label">{c.label}</div>
              <div className="exports-cred-sub">{c.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── REGIONS ─────────────────────── */}
      <section className="section exports-regions-section">
        <Reveal>
           <div className="section-header" style={{ textAlign: 'center', marginBottom: '6rem' }}>
              <span className="label">Markets We Serve</span>
              <h2 className="section-title">Active Export <em>Regions</em></h2>
           </div>
        </Reveal>
        <div className="exports-regions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
          {REGIONS.map((r, i) => (
            <Reveal key={r.region} delay={i * 0.1}>
              <div className="glass-card-pro" style={{ padding: '3rem', height: '100%', borderTop: `4px solid ${r.accent}` }}>
                <div className="export-region-flag" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{r.flag}</div>
                <div className="serif" style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{r.region}</div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>{r.desc}</p>
                <div className="export-region-countries" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {r.countries.map(c => <span key={c} style={{ fontSize: '0.7rem', fontWeight: '700', padding: '4px 10px', background: 'var(--bg)', borderRadius: '4px', border: '1px solid var(--border-dim)' }}>{c}</span>)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── EXPORT PROCESS ─────────────── */}
      <section className="section exports-process-section">
        <Reveal>
           <div className="section-header" style={{ textAlign: 'center', marginBottom: '6rem' }}>
              <span className="label">How We Work</span>
              <h2 className="section-title">Our Export <em>Process</em></h2>
           </div>
        </Reveal>
        <div className="exports-process-grid">
          {PROCESS.map((p, i) => (
            <Reveal key={p.step} delay={i * 0.1}>
              <div className="process-card">
                <div className="process-step">{p.step}</div>
                <h3 className="process-title">{p.title}</h3>
                <p className="process-desc">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────── */}
      <section className="section exports-cta-section" style={{ background: 'var(--bg-secondary)', padding: '8rem 0' }}>
        <Reveal>
          <div className="exports-cta-card">
            <Globe size={54} style={{ color: 'var(--gold)', marginBottom: '2rem' }} />
            <h2 className="exports-cta-title">Interested in Distributing Nikan?</h2>
            <p className="exports-cta-desc">
              We are actively seeking distribution partnerships in new markets. Share your region, 
              channel, and volume requirements — we'll respond with a capability and pricing overview.
            </p>
            <a href="/contact" className="btn-primary" style={{ boxShadow: 'var(--shadow-gold)' }}>
              Start a Conversation <ArrowRight size={18}/>
            </a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
