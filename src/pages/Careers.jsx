import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Users, Heart, Zap, MapPin, ArrowRight } from 'lucide-react';
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

const PERKS = [
  { icon: <Heart size={26}/>, title: 'People-First Culture', desc: 'We build careers, not just fill positions. Every team member is invested in as a long-term contributor to Nikan\'s growth.' },
  { icon: <Zap size={26}/>, title: 'Fast-Growing Business', desc: 'As an export-recognised manufacturer, we are actively expanding — creating new opportunities across functions.' },
  { icon: <Users size={26}/>, title: 'Collaborative Environment', desc: 'Small teams with big ownership. You work closely with leadership, directly impacting products and decisions.' },
  { icon: <Briefcase size={26}/>, title: 'Industry Exposure', desc: 'Gain hands-on exposure to manufacturing, export trade, and international distribution from within a growing Indian brand.' },
];

const OPENINGS = [
  {
    title: 'Export Sales Executive',
    dept: 'Sales & Business Development',
    type: 'Full-Time',
    location: 'West Bengal, India (with travel)',
    desc: 'Drive export sales by identifying and developing distributor networks in Middle East, Africa, and Asia. Manage existing accounts and close new territories.',
    reqs: ['3+ years export/B2B sales experience', 'Strong communication & negotiation', 'Knowledge of international trade documentation'],
  },
  {
    title: 'Quality Control Inspector',
    dept: 'Manufacturing & QC',
    type: 'Full-Time',
    location: 'Bishnupur, West Bengal',
    desc: 'Oversee incoming material inspection, in-process quality checks, and pre-shipment inspection aligned with ISO 9001:2015 standards.',
    reqs: ['2+ years QC in manufacturing', 'Familiarity with ISO QMS processes', 'Attention to detail & documentation discipline'],
  },
  {
    title: 'Graphic Designer – Packaging',
    dept: 'Marketing & Design',
    type: 'Full-Time',
    location: 'Remote / West Bengal',
    desc: 'Design product packaging, catalogue layouts, and marketing collateral for the Nikan range. Work closely with product and sales teams on new launches.',
    reqs: ['Proficiency in Adobe Illustrator & Photoshop', 'Packaging design portfolio', 'Understanding of print production processes'],
  },
  {
    title: 'Production Supervisor',
    dept: 'Manufacturing',
    type: 'Full-Time',
    location: 'Bishnupur, West Bengal',
    desc: 'Oversee daily production operations, coordinate with material planning, and ensure output targets are met with quality benchmarks.',
    reqs: ['5+ years in manufacturing supervision', 'Experience in plastics/stationery/FMCG a plus', 'Team leadership and shift management skills'],
  },
];

export default function Careers() {
  return (
    <div className="page-careers">
      <Navbar />

      {/* ── PAGE HERO ─────────────────────── */}
      <section className="page-hero-premium">
        <div className="page-hero-content">
          <motion.span className="label-gold" variants={fadeUp} custom={0} initial="hidden" animate="visible">
            Join Our Team
          </motion.span>
          <motion.h1 className="page-hero-title" variants={fadeUp} custom={0.1} initial="hidden" animate="visible">
            Build Your Career<br />at the <em>Tip of the Pen</em>
          </motion.h1>
          <motion.p className="page-hero-desc" variants={fadeUp} custom={0.2} initial="hidden" animate="visible">
            Nikan is growing — and we're looking for passionate, driven individuals to grow with us. 
            Build a career at an ISO-certified, export-recognised Indian manufacturer.
          </motion.p>
          <motion.div variants={fadeUp} custom={0.3} initial="hidden" animate="visible" style={{ marginTop: '2.5rem' }}>
            <a href="#openings" className="btn-primary" style={{ padding: '16px 36px', boxShadow: 'var(--shadow-gold)' }}>
              View Open Positions <ArrowRight size={18}/>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── WHY NIKAN ─────────────────────── */}
      <section className="section careers-perks-section">
        <Reveal>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <span className="label">Why Work With Us</span>
            <h2 className="section-title">More Than a Job.<br /><em>A Craft.</em></h2>
          </div>
        </Reveal>
        <div className="perks-grid">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <div className="perk-card">
                <div className="perk-icon">{p.icon}</div>
                <h3 className="perk-title">{p.title}</h3>
                <p className="perk-desc">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── OPENINGS ─────────────────────── */}
      <section className="section careers-openings-section" id="openings">
        <Reveal>
           <div className="section-header" style={{ textAlign: 'center', marginBottom: '6rem' }}>
              <span className="label">Opportunities</span>
              <h2 className="section-title">Open <em>Positions</em></h2>
           </div>
        </Reveal>
        <div className="openings-list" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          {OPENINGS.map((job, i) => (
            <Reveal key={job.title} delay={i * 0.1}>
              <div className="glass-card-pro" style={{ padding: '3rem' }}>
                <div className="opening-card-header">
                  <div>
                    <h3 className="serif" style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.8rem' }}>{job.title}</h3>
                    <div className="opening-meta" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                      <span className="label-gold" style={{ background: 'var(--gold-dim)', padding: '4px 12px', borderRadius: '4px', margin: 0 }}>{job.dept}</span>
                      <span className="opening-type" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>{job.type}</span>
                      <div className="opening-location" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}><MapPin size={16}/> {job.location}</div>
                    </div>
                  </div>
                  <a href="#apply" className="btn-primary" style={{ fontSize: '0.75rem', padding: '10px 24px' }}>Apply Now</a>
                </div>
                <p className="opening-desc" style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '2rem' }}>{job.desc}</p>
                <div className="opening-requirements">
                  <div className="label-gold" style={{ fontSize: '0.65rem', marginBottom: '0.8rem' }}>Key Requirements:</div>
                  <ul className="opening-req-list">
                    {job.reqs.map(r => <li key={r} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}><Zap size={12} style={{ color: 'var(--gold)' }}/> {r}</li>)}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── OPEN APPLICATION ─────────────── */}
      <section className="section careers-open-app-section" style={{ background: 'var(--bg-secondary)', padding: '8rem 0' }}>
        <Reveal>
          <div className="open-app-card" style={{ background: 'var(--bg-dark-pro)', color: '#fff', border: 'none', boxShadow: 'var(--shadow-3d)', maxWidth: '900px' }}>
            <h3 className="open-app-title serif" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Don't see a role that fits?</h3>
            <p className="open-app-desc" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
              We welcome open applications. If you're passionate about manufacturing, export trade, 
              design, or business development — send us your CV and a note about what you'd bring to Nikan.
            </p>
            <a href="mailto:exports@tirupaticolorpens.com" className="btn-primary" style={{ boxShadow: 'var(--shadow-gold)' }}>
              Send Open Application <ArrowRight size={18}/>
            </a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
