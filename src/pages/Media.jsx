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

const PRESS = [
  {
    date: 'October 2025',
    title: 'Nikan Releases October 2025 Product Catalogue with 12 New SKUs',
    excerpt: 'The updated catalogue introduces the Auram Premium range, new Chisel marker colourways, and an expanded Kiddo line targeting primary school distribution channels in South Asia.',
    tag: 'Product Launch',
  },
  {
    date: 'September 2025',
    title: 'Tirupati Colour Pens Achieves One Star Export House Recognition',
    excerpt: 'The Directorate General of Foreign Trade has awarded Tirupati Colour Pens Pvt. Ltd. with One Star Export House status under the Foreign Trade Policy 2023, acknowledging its growing international footprint.',
    tag: 'Company News',
  },
  {
    date: 'June 2025',
    title: 'Nikan Expands African Distribution with Three New Partners',
    excerpt: 'New distribution agreements signed in Nigeria, Kenya, and Ghana bring the Nikan brand to an estimated 4,000 additional retail points across Sub-Saharan Africa.',
    tag: 'Expansion',
  },
  {
    date: 'March 2025',
    title: 'Quality Management System Re-Certified Under ISO 9001:2015',
    excerpt: 'Following a successful surveillance audit by ROHS Certification Pvt. Ltd., Nikan\'s QMS has been re-certified for the scope of manufacturing and marketing of fibre tip pens, markers, and ball point pens.',
    tag: 'Certification',
  },
];

const DOWNLOADS = [
  { 
    icon: <FileText size={22}/>, 
    title: 'Product Catalogue — Oct 2025', 
    desc: 'Full range catalogue with specs, SKU codes, and pack configurations.', 
    type: 'PDF', 
    tag: 'Catalogue',
    href: '/product/NiKan%20Catalogue%20Oct%2025.pdf',
    isDirect: true
  },
  { icon: <FileText size={22}/>, title: 'ISO 9001:2015 Certificate', desc: 'Official QMS certification document issued by ROHS Certification Pvt. Ltd.', type: 'PDF', tag: 'Certification' },
  { icon: <FileText size={22}/>, title: 'One Star Export House Certificate', desc: 'DGFT recognition certificate under Foreign Trade Policy 2023.', type: 'PDF', tag: 'Certification' },
  { icon: <Image size={22}/>, title: 'Nikan Brand Logo Pack', desc: 'High-resolution logo files in PNG, SVG, and AI formats for media use.', type: 'ZIP', tag: 'Brand Assets' },
  { icon: <FileText size={22}/>, title: 'Export Terms & Conditions', desc: 'Standard export terms, payment conditions, and minimum order quantities.', type: 'PDF', tag: 'Trade' },
];

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
            Find the latest news from Nikan, press-ready brand assets, product catalogues, 
            and certification documents — all in one place.
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

      {/* ── PRESS RELEASES ─────────────── */}
      <section className="section media-press-section">
        <Reveal>
           <div className="section-header" style={{ textAlign: 'center', marginBottom: '6rem' }}>
              <span className="label">Newsroom</span>
              <h2 className="section-title">Latest <em>Press</em> Releases</h2>
           </div>
        </Reveal>
        <div className="press-list">
          {PRESS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div className="glass-card-pro" style={{ padding: '3rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="press-card-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span className="label-gold" style={{ margin: 0 }}>{item.tag}</span>
                  <span className="press-date" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>{item.date}</span>
                </div>
                <h3 className="serif" style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: '1.3' }}>{item.title}</h3>
                <p className="press-excerpt" style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '2rem', flexGrow: 1 }}>{item.excerpt}</p>
                <div style={{ marginTop: 'auto' }}>
                  <a href="#" className="btn-ghost" style={{ color: 'var(--gold)', fontWeight: '700' }}>Read Full Release <ArrowRight size={18} style={{ marginLeft: '8px' }}/></a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── DOWNLOADS ─────────────────── */}
      <section className="section media-downloads-section">
        <Reveal>
           <div className="section-header" style={{ textAlign: 'center', marginBottom: '6rem' }}>
              <span className="label">Resources</span>
              <h2 className="section-title">Brand &amp; <em>Trade</em> Assets</h2>
           </div>
        </Reveal>
        <div className="downloads-grid">
          {DOWNLOADS.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.07}>
              <div className="glass-card-pro" style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="download-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div className="download-icon" style={{ color: 'var(--gold)' }}>{d.icon}</div>
                  <div className="download-tag-wrap" style={{ display: 'flex', gap: '8px' }}>
                    <span className="label-gold" style={{ margin: 0, fontSize: '0.6rem' }}>{d.tag}</span>
                    <span className="download-type" style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{d.type}</span>
                  </div>
                </div>
                <h3 className="serif" style={{ fontSize: '1.3rem', marginBottom: '0.8rem', color: 'var(--text-primary)' }}>{d.title}</h3>
                <p className="download-desc" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem', flexGrow: 1 }}>{d.desc}</p>
                <div style={{ marginTop: 'auto' }}>
                  <a 
                    href={d.isDirect ? d.href : "/contact"} 
                    target={d.isDirect ? "_blank" : "_self"}
                    rel={d.isDirect ? "noopener noreferrer" : ""}
                    className="btn-primary" 
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem', padding: '10px' }}
                  >
                    <Download size={16} style={{ marginRight: '8px' }}/> {d.isDirect ? "Download Now" : "Request Access"}
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
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
