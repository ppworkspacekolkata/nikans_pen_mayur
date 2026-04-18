import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Mail } from 'lucide-react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import sunilPhoto from '../assets/photos/Sunil Kumar.jpg';
import nitinPhoto from '../assets/photos/Nitin Kanodia.jpg';
import nishantPhoto from '../assets/photos/Nishant Kanodia.jpg';

// Inline SVGs for Brand Icons
const LinkedInIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

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
      <div style={{ transform: 'translateZ(20px)', width: '100%', height: '100%' }}>
        {children}
      </div>
    </motion.div>
  );
}

const TEAM = [
  {
    name: 'Sunil Kumar Kanodia',
    role: 'Chairman & Managing Director',
    bio: 'The visionary leader behind Tirupati Colour Pens Pvt. Ltd., bringing over two decades of manufacturing and strategic expertise to the Nikan brand.',
    image: sunilPhoto,
    socials: { linkedin: '#', mail: 'mailto:info@nikan.com' }
  },
  {
    name: 'Nitin Kanodia',
    role: 'Director – Strategy & Exports',
    bio: 'An SRCC alumnus and Chartered Accountant driving Nikan\'s expansion into 20+ global territories and leading international joint ventures.',
    image: nitinPhoto,
    socials: { linkedin: '#', twitter: '#' }
  },
  {
    name: 'Nishant Kanodia',
    role: 'Director – Operations & Growth',
    bio: 'Chartered Accountant overseeing the modernization of manufacturing and revamping domestic business structures for exponential growth.',
    image: nishantPhoto,
    socials: { linkedin: '#', mail: '#' }
  }
];

export default function Team() {
  return (
    <div className="page-team">
      <Navbar />

      {/* ── HERO SECTION ─────────────────────── */}
      <section className="page-hero-premium">
        <div className="page-hero-content">
          <motion.span className="label-gold" variants={fadeUp} custom={0} initial="hidden" animate="visible">
            Corporate Leadership
          </motion.span>
          <motion.h1 className="page-hero-title" variants={fadeUp} custom={0.1} initial="hidden" animate="visible">
            The Visionaries Behind<br />Every <em>Precision Stroke</em>
          </motion.h1>
          <motion.p className="page-hero-desc" variants={fadeUp} custom={0.2} initial="hidden" animate="visible">
            Nikan's leadership is anchored by decades of manufacturing heritage and a 
            forward-looking commitment to Indian engineering excellence.
          </motion.p>
        </div>
      </section>

      {/* ── CHAIRMAN'S MESSAGE ──────────────── */}
      <section className="section chairman-message-section" style={{ background: '#fff', borderBottom: '1px solid var(--border-dim)', padding: '6rem 0' }}>
        <Reveal>
          <div className="quote-container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', padding: '0 2rem' }}>
             <div style={{ fontSize: '6rem', color: 'var(--gold)', opacity: 0.2, position: 'absolute', top: '-3rem', left: '0', fontFamily: 'serif' }}>“</div>
             <p className="chairman-quote serif" style={{ fontSize: '2rem', lineHeight: '1.4', color: 'var(--text-primary)', marginBottom: '2.5rem' }}>
                At Nikan, our mission transcends manufacturing. We are crafting the tools that 
                empower minds to learn, professionals to sign, and creators to dream.
             </p>
             <div className="chairman-signature flex-center-col">
                <div style={{ fontStyle: 'italic', fontSize: '1.6rem', color: 'var(--gold)', marginBottom: '0.2rem' }}>Sunil Kumar Kanodia</div>
                <div className="label" style={{ fontSize: '0.65rem' }}>Founder & Chairman</div>
             </div>
          </div>
        </Reveal>
      </section>

      {/* ── EXECUTIVE GALLERY ────────────────── */}
      <section className="section executive-gallery" style={{ padding: '8rem 0' }}>
         <Reveal>
           <div className="section-header" style={{ textAlign: 'center', marginBottom: '6rem' }}>
              <span className="label">Our Principals</span>
              <h2 className="section-title">The <em>Leadership</em> Board</h2>
           </div>
         </Reveal>

         <div className="leader-gallery-entries" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8rem' }}>
             
             {/* Sunil - Left Image */}
             <div className="pro-leader-entry" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '5rem', alignItems: 'center' }}>
                <TiltCard className="pro-leader-card">
                  <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: 'var(--border-thick)', boxShadow: 'var(--shadow-3d)' }}>
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
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                      <a href="#" style={{ color: 'var(--gold)' }}><LinkedInIcon size={22}/></a>
                      <a href="mailto:info@nikan.in" style={{ color: 'var(--gold)' }}><Mail size={22}/></a>
                    </div>
                  </div>
                </Reveal>
             </div>

             {/* Nitin - Right Image */}
             <div className="pro-leader-entry" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '5rem', alignItems: 'center' }}>
                <Reveal delay={0.1}>
                  <div className="pro-leader-info" style={{ order: 2 }}>
                    <span className="label-gold" style={{ background: 'var(--gold-dim)', padding: '4px 12px', borderRadius: '4px' }}>Director</span>
                    <h3 className="serif" style={{ fontSize: '2.5rem', margin: '1rem 0' }}>Mr. Nitin Kanodia</h3>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '2rem' }}>
                      A Chartered Accountant and Gold Medalist from SRCC Delhi, Nitin has pioneered Nikan's 
                      global strategy. Under his leadership, the brand has expanded into 20+ countries, 
                      blending analytical financial rigor with a bold vision for international trade.
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                      <a href="#" style={{ color: 'var(--gold)' }}><LinkedInIcon size={22}/></a>
                      <a href="#" style={{ color: 'var(--gold)' }}><TwitterIcon size={22}/></a>
                    </div>
                  </div>
                </Reveal>
                <TiltCard className="pro-leader-card" style={{ order: 1 }}>
                  <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: 'var(--border-thick)', boxShadow: 'var(--shadow-3d)' }}>
                    <img src={nitinPhoto} alt="Nitin Kanodia" style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover' }} />
                  </div>
                </TiltCard>
             </div>

             {/* Nishant - Left Image */}
             <div className="pro-leader-entry" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '5rem', alignItems: 'center' }}>
                <TiltCard className="pro-leader-card">
                  <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: 'var(--border-thick)', boxShadow: 'var(--shadow-3d)' }}>
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
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                      <a href="#" style={{ color: 'var(--gold)' }}><LinkedInIcon size={22}/></a>
                      <a href="#" style={{ color: 'var(--gold)' }}><Mail size={22}/></a>
                    </div>
                  </div>
                </Reveal>
             </div>

         </div>
      </section>

      {/* ── CULTURE SECTION ─────────────────── */}
      <section className="section team-culture-section" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', padding: '8rem 0' }}>
        <div className="culture-layout" style={{ maxWidth: '1200px', margin: '0 auto' }}>
           <Reveal>
              <div className="culture-text-card" style={{ background: '#fff', padding: '4rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-dim)', boxShadow: 'var(--shadow-lg)' }}>
                 <span className="label" style={{ color: 'var(--gold)' }}>Our Corporate Values</span>
                 <h2 className="section-title" style={{ marginTop: '1rem' }}>Driven by Integrity,<br /><em>United by Purpose</em></h2>
                 <p className="section-desc" style={{ color: 'var(--text-secondary)', marginTop: '1.5rem' }}>
                    Beyond engineering and manufacturing, our team is defined by a culture of 
                    excellence and mutual growth. We believe that a better writing experience 
                    starts with a better workspace.
                 </p>
                 <div className="culture-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '3rem' }}>
                    <div className="culture-stat">
                       <div className="serif culture-stat-num" style={{ color: 'var(--gold)', fontSize: '3.5rem' }}>500+</div>
                       <div className="label">Skilled Artisans</div>
                    </div>
                    <div className="culture-stat">
                       <div className="serif culture-stat-num" style={{ color: 'var(--gold)', fontSize: '3.5rem' }}>40%</div>
                       <div className="label">Female Workforce</div>
                    </div>
                 </div>
              </div>
           </Reveal>
           <Reveal delay={0.2}>
              <div className="culture-cta-card" style={{ background: 'var(--bg-dark-pro)', color: '#fff', padding: '4rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-3d)', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                  <span className="label" style={{ color: 'var(--gold)' }}>Human Resources</span>
                  <h3 className="serif" style={{ fontSize: '2.4rem', margin: '1rem 0' }}>Join Our Mission</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.8', marginBottom: '2.5rem' }}>
                    We are always looking for passionate individuals to help us shape the future of stationery. 
                    Build your career at an ISO-certified manufacturer.
                  </p>
                  <div style={{ marginTop: 'auto' }}>
                    <a href="/careers" className="btn-primary" style={{ width: 'fit-content' }}>View Open Positions</a>
                  </div>
              </div>
           </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
