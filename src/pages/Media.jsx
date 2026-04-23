import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FileText, Download, Image, Newspaper, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
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



export default function Media() {
  return (
    <div className="page-media">
      <Navbar />

      {/* ── PAGE HERO ─────────────────────── */}
      <section className="page-hero-premium">
        <div className="page-hero-content">
          <motion.span className="label-gold" variants={fadeUp} custom={0} initial="hidden" animate="visible">
            Media & Press
          </motion.span>
          <motion.h1 className="page-hero-title" variants={fadeUp} custom={0.1} initial="hidden" animate="visible">
            News, Resources<br />&amp; <em>Brand Assets</em>
          </motion.h1>
          <motion.p className="page-hero-desc" variants={fadeUp} custom={0.2} initial="hidden" animate="visible">
            Explore Nikan’s world-class manufacturing in action through our corporate films 
            and get in touch with our media relations team for export enquiries.
          </motion.p>
        </div>
      </section>

      {/* ── CORPORATE VIDEOS ───────────────── */}
      <section className="section media-video-section" style={{ background: '#fff', padding: '8rem 0' }}>
        <Reveal>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="label">Corporate Videos</span>
            <h2 className="section-title">Nikan <em>Facilities</em> In Action</h2>
          </div>
          
          <div className="videos-grid">
            {/* First Video */}
            <div className="video-container glass-card-pro" style={{ 
              overflow: 'hidden', 
              position: 'relative', 
              aspectRatio: '16/9', 
              background: '#000',
              borderRadius: '24px',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <video 
                controls 
                width="100%" 
                height="100%" 
                style={{ objectFit: 'cover' }}
                poster="/team/sunil_chairman.png"
              >
                <source src="/team_media/video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Second Video */}
            <div className="video-container glass-card-pro" style={{ 
              overflow: 'hidden', 
              position: 'relative', 
              aspectRatio: '16/9', 
              background: '#000',
              borderRadius: '24px',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <video 
                controls 
                width="100%" 
                height="100%" 
                style={{ objectFit: 'cover' }}
              >
                <source src="/team_media/video 1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </Reveal>
      </section>




      {/* ── MEDIA CONTACT ─────────────── */}
      <section className="section media-contact-section" style={{ background: 'var(--bg-secondary)', padding: '8rem 0' }}>
        <Reveal>
          <div className="media-contact-card">
            <Newspaper size={48} style={{ color: 'var(--gold)', marginBottom: '2rem' }} />
            <h3 className="media-contact-title">Media & Export Enquiries</h3>
            <p className="media-contact-desc">
              For press enquiries, export opportunities, or access to brand materials, 
              please contact our communications team directly.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <a href="mailto:exports@tirupaticolorpens.com" className="btn-primary" style={{ boxShadow: 'var(--shadow-gold)', width: 'fit-content' }}>
                exports@tirupaticolorpens.com <ArrowRight size={18}/>
              </a>
              <p style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                Direct line - +91 9830058822
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
