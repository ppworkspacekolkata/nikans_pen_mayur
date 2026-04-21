import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Globe, Clock, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, delay: d, ease: [0.22,1,0.36,1] } }),
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

const ENQUIRY_TYPES = [
  'Product / Catalogue Enquiry',
  'Export / Distribution Partnership',
  'OEM / Private Label',
  'Pricing & MOQ',
  'Careers',
  'Press & Media',
  'Other',
];

export default function ContactUs() {
  const [form, setForm] = useState({ name:'', company:'', email:'', phone:'', type:'', message:'' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="page-contact">
      <Navbar />

      {/* ── PAGE HERO ─────────────────────── */}
      <section className="page-hero-premium">
        <div className="page-hero-content">
          <motion.span className="label-gold" variants={fadeUp} custom={0} initial="hidden" animate="visible">
            Get in Touch
          </motion.span>
          <motion.h1 className="page-hero-title" variants={fadeUp} custom={0.1} initial="hidden" animate="visible">
            Let's Start a<br /><em>Conversation</em>
          </motion.h1>
          <motion.p className="page-hero-desc" variants={fadeUp} custom={0.2} initial="hidden" animate="visible">
            Whether you're a distributor, retailer, institution, or journalist — we'd love to hear from you. 
            Fill out the form and our team will respond within 1–2 business days.
          </motion.p>
        </div>
      </section>

      {/* ── CONTACT LAYOUT ─────────────── */}
      <section className="section contact-layout-section">
        <div className="contact-layout">

          {/* Left: Info */}
          <div className="contact-info-col glass-card-pro" style={{ padding: '3.5rem' }}>
            <Reveal>
              <div className="section-header" style={{ marginBottom: '3rem' }}>
                <span className="label-gold">Our Details</span>
                <h2 className="serif" style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Find Us</h2>
              </div>
            </Reveal>
            <div className="contact-details-list" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <Reveal delay={0.1}>
                <div className="contact-detail-card-new" style={{ display: 'flex', gap: '1.2rem' }}>
                  <div className="contact-icon" style={{ color: 'var(--gold)', marginTop: '4px' }}><MapPin size={24}/></div>
                  <div>
                    <div className="label-gold" style={{ fontSize: '0.65rem', marginBottom: '0.5rem' }}>Registered Address</div>
                    <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                      Tirupati Colour Pens Pvt. Ltd.<br />
                      Vill-Nandabhanga, Guljarmore, P.O. Kanganberia<br />
                      South 24 Parganas — 743503, West Bengal, India
                    </div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="contact-detail-card-new" style={{ display: 'flex', gap: '1.2rem' }}>
                  <div className="contact-icon" style={{ color: 'var(--gold)', marginTop: '4px' }}><Mail size={24}/></div>
                  <div>
                    <div className="label-gold" style={{ fontSize: '0.65rem', marginBottom: '0.5rem' }}>Email Enquiries</div>
                    <a href="mailto:exports@tirupaticolorpens.com" style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: '700', wordBreak: 'break-all' }}>exports@tirupaticolorpens.com</a>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="contact-detail-card-new" style={{ display: 'flex', gap: '1.2rem' }}>
                  <div className="contact-icon" style={{ color: 'var(--gold)', marginTop: '4px' }}><Phone size={24}/></div>
                  <div>
                    <div className="label-gold" style={{ fontSize: '0.65rem', marginBottom: '0.5rem' }}>Direct Line</div>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: '700' }}>+91 9830058822</div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="contact-trust-strip" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-dim)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}><ShieldCheck size={18} style={{ color: 'var(--gold)' }}/> ISO 9001:2015 Operations</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}><Globe size={18} style={{ color: 'var(--gold)' }}/> One Star Export House</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}><Clock size={18} style={{ color: 'var(--gold)' }}/> Response: 24 Business Hours</div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Right: Form */}
          <div className="contact-form-col glass-card-pro" style={{ background: 'var(--bg-dark-pro)', padding: '3.5rem' }}>
            <Reveal delay={0.1}>
              {sent ? (
                <div className="premium-success-card">
                  <div className="contact-success-icon" style={{ width: '80px', height: '80px', background: 'var(--gold)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 2rem' }}>✓</div>
                  <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#fff' }}>Message Sent!</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto' }}>
                    Thank you for reaching out. Our team will review your enquiry and respond within 1–2 business days.
                  </p>
                </div>
              ) : (
                <form className="premium-form" onSubmit={handleSubmit} noValidate>
                  <div className="premium-form-row">
                    <div className="premium-input-group">
                      <label htmlFor="name" className="premium-label">Full Name *</label>
                      <input id="name" name="name" className="premium-input" type="text" required placeholder="John Doe" value={form.name} onChange={handleChange} />
                    </div>
                    <div className="premium-input-group">
                      <label htmlFor="company" className="premium-label">Company</label>
                      <input id="company" name="company" className="premium-input" type="text" placeholder="Your organisation" value={form.company} onChange={handleChange} />
                    </div>
                  </div>
                  
                  <div className="premium-form-row">
                    <div className="premium-input-group">
                      <label htmlFor="email" className="premium-label">Email Address *</label>
                      <input id="email" name="email" className="premium-input" type="email" required placeholder="you@company.com" value={form.email} onChange={handleChange} />
                    </div>
                    <div className="premium-input-group">
                      <label htmlFor="phone" className="premium-label">Phone / WhatsApp</label>
                      <input id="phone" name="phone" className="premium-input" type="tel" placeholder="+91 00000 00000" value={form.phone} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="premium-input-group">
                    <label htmlFor="type" className="premium-label">Nature of Enquiry *</label>
                    <select id="type" name="type" className="premium-select" required value={form.type} onChange={handleChange}>
                      <option value="" disabled>Select an enquiry type</option>
                      {ENQUIRY_TYPES.map(t => <option key={t} value={t} style={{ color: '#000' }}>{t}</option>)}
                    </select>
                  </div>

                  <div className="premium-input-group">
                    <label htmlFor="message" className="premium-label">Message Details *</label>
                    <textarea
                      id="message"
                      name="message"
                      className="premium-textarea"
                      required
                      rows={5}
                      placeholder="Please describe your requirements..."
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', marginTop: '1rem', background: 'var(--gold)', color: '#000' }}>
                    {loading ? (
                      <span>Processing...</span>
                    ) : (
                      <><Send size={18} style={{ marginRight: '10px' }}/> SUBMIT ENQUIRY</>
                    )}
                  </button>
                  
                  <p className="form-disclaimer" style={{ marginTop: '1.5rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', letterSpacing: '0.05em' }}>
                    CONFIDENTIALITY GUARANTEED • GLOBAL EXPORT COMPLIANCE
                  </p>
                </form>
              )}
            </Reveal>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
