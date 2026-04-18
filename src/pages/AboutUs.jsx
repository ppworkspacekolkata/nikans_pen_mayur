import { motion, useInView, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { ShieldCheck, Award, Globe, Factory, Target, Heart, Eye, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import sunilPhoto from '../assets/photos/Sunil Kumar.jpg';
import infra1 from '../assets/photos/img331.jpg';
import infra2 from '../assets/photos/img379.jpg';
import infra3 from '../assets/photos/img349.jpg';
import infra4 from '../assets/photos/img408.jpg';
import infra5 from '../assets/photos/img1644.jpg';
import infra6 from '../assets/photos/img740.jpg';
import legacyPen from '../assets/legacy-pen-art.png';

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

function AnimatedPath({ scrollYProgress }) {
  const pathLength = useSpring(scrollYProgress, { stiffness: 300, damping: 30 });
  return (
    <svg className="timeline-svg" viewBox="0 0 10 100" preserveAspectRatio="none" style={{ position: 'absolute', left: '110px', top: 0, bottom: 0, width: '2px', height: '100%', zIndex: 1 }}>
      <motion.line x1="5" y1="0" x2="5" y2="100" stroke="var(--gold)" strokeWidth="2" style={{ pathLength }} />
    </svg>
  );
}

const VALUES = [
  { icon: <ShieldCheck size={22}/>, title: 'Uncompromising Quality', desc: 'Every product line undergoes rigorous QC aligned with ISO 9001:2015 standards before reaching our customers.' },
  { icon: <Globe size={22}/>, title: 'Global Perspective', desc: 'We think beyond borders — engineering products that meet the expectations of buyers across four continents.' },
  { icon: <Target size={22}/>, title: 'Innovation-Led Design', desc: 'From ergonomic grips to nickel-silver tips, every design decision is rooted in a better writing experience.' },
  { icon: <Factory size={22}/>, title: 'Manufacturing Integrity', desc: 'Our West Bengal facility operates with precision manufacturing protocols, monitored at every production stage.' },
  { icon: <Heart size={22}/>, title: 'Purpose for Every Writer', desc: 'From a child holding their first pen to a professional signing a deal — we make writing instruments for every life stage.' },
  { icon: <Award size={22}/>, title: 'Recognised Excellence', desc: 'Honoured as a DGFT One Star Export House by the Ministry of Commerce & Industry, Government of India.' },
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
            <div className="nav-logo" style={{ fontSize: '1.4rem' }}>ni<span>k</span>an <span className="nav-reg">®</span></div>
          </div>
          <h2 className="legacy-header-title">About the Company</h2>
        </div>

        <div className="legacy-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
          <div className="leadership-portrait-wrap">
            <Reveal>
              <div style={{ position: 'relative', padding: '10px', background: '#fff', border: '1px solid var(--border)', boxShadow: '15px 15px 0px var(--gold-dim)', borderRadius: 'var(--radius-sm)' }}>
                <img src={sunilPhoto} alt="Mr. Sunil Kumar Kanodia" style={{ width: '100%', display: 'block' }} />
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <h4 className="serif" style={{ fontSize: '1.4rem' }}>Mr. Sunil Kumar Kanodia</h4>
                  <p className="label" style={{ fontSize: '0.65rem' }}>Chairman & Founder</p>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="legacy-text-col" style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              <span className="legacy-highlight" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Tirupati Colour Pens Pvt. Ltd.</span> was 
              established in 2008, bringing a decade of excellence to the world of writing instruments.
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              Renowned under the brand name 'BALAJI' and now 'Nikan', we provide precision-engineered 
              tools that suit celebrations and corporate requirements alike.
            </p>
            <p>
              Under the leadership of Mr. Sunil Kumar Kanodia, we have eliminated middlemen, 
              streamlined manufacturing, and reached global summits in Stationery excellence.
            </p>
          </div>
        </div>

        <div className="legacy-content" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '4rem', alignItems: 'start', marginTop: '4rem' }}>
          <div className="legacy-text-col" style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            <Reveal>
              <div>
                <p style={{ marginBottom: '1.5rem' }}>
                  Located in the City of Joy, the facility has manufacturing of Ink 
                  Reservoirs, fibre tips and all water-based inks. Our raw materials 
                  are obtained from the largest companies of India and thus have the 
                  consistency over time.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                  With the guarantee of a longer shelf-life, our products have been 
                  winning hearts across the Indian market. We distribute through our 
                  own marketing setup that includes super stockists, distributors, 
                  direct dealers, salespersons and more, keeping the selling price 
                  affordable for all.
                </p>
                <p>
                  Our domestic presence has inspired us more to step towards 
                  international markets as soon as possible.
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

      <section className="about-timeline-section" style={{ padding: '7rem 0', background: 'var(--bg)' }}>
        <div className="section-header" style={{ padding: '0 6rem 4rem' }}>
          <span className="label">Our Journey</span>
          <h2 className="section-title">A Legacy of<br /><em>Constant Growth</em></h2>
        </div>
        
        <div className="timeline" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="timeline-line-bg" style={{ position: 'absolute', left: '110px', top: 0, bottom: 0, width: '1px', background: 'var(--border-dim)' }} />
          <AnimatedPath scrollYProgress={scrollYProgress} />
          
          {TIMELINE.map((item, i) => (
            <Reveal key={item.year} delay={i * 0.1}>
              <div className="timeline-item">
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-dot" />
                <div className="timeline-text">{item.text}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── MISSION, VISION AND VALUES ────────── */}
      <section className="brochure-section" style={{ background: 'var(--bg-secondary)', padding: '8rem 0' }}>
        <div className="brochure-inner" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
           <div className="brochure-header" style={{ marginBottom: '6rem', background: 'var(--bg-dark-pro)', borderTop: '4px solid var(--gold)', padding: '2rem 3rem', boxShadow: 'var(--shadow-3d)' }}>
              <div className="nav-logo" style={{ fontSize: '1.4rem', color: '#fff' }}>ni<span>k</span>an <span className="nav-reg" style={{ color: 'rgba(255,255,255,0.4)' }}>®</span></div>
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

      {/* ── INDUSTRIAL GALLERY ─────────── */}
      <section className="section about-gallery-section" style={{ padding: '8rem 0', background: 'var(--bg)' }}>
        <Reveal>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <span className="label">Industrial Excellence</span>
            <h2 className="section-title">A Legacy Written in <em>Precision</em></h2>
            <p className="section-desc" style={{ marginInline: 'auto' }}>
              Our manufacturing facilities in West Bengal utilize fully automatic Japanese and German machinery 
              to ensure sub-micron precision across every nib and ink reservoir.
            </p>
          </div>
        </Reveal>
        <div className="about-gallery-grid">
          {[infra1, infra2, infra3, infra4, infra5, infra6].map((img, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="gallery-item-wrap" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-dim)', aspectRatio: '4/3', filter: 'grayscale(10%) contrast(1.05)' }}>
                <img src={img} alt={`Infrastructure ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
