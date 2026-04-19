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
          <div className="contact-info-col glass-card-pro">
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
                    <a href="mailto:info@nikan.in" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: '700' }}>info@nikan.in</a>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="contact-detail-card-new" style={{ display: 'flex', gap: '1.2rem' }}>
                  <div className="contact-icon" style={{ color: 'var(--gold)', marginTop: '4px' }}><Phone size={24}/></div>
                  <div>
                    <div className="label-gold" style={{ fontSize: '0.65rem', marginBottom: '0.5rem' }}>Direct Line</div>
                    <div style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: '700' }}>+91 9804333779</div>
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
          <div className="contact-form-col glass-card-pro">
            <Reveal delay={0.1}>
              {sent ? (
                <div className="contact-success" style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <div className="contact-success-icon" style={{ width: '80px', height: '80px', background: 'var(--gold)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 2rem' }}>✓</div>
                  <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Message Sent!</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto' }}>
                    Thank you for reaching out. Our team will review your enquiry and respond within 1–2 business days.
                  </p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="form-row">
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label htmlFor="name" className="label-gold" style={{ fontSize: '0.65rem', marginBottom: 0 }}>Full Name *</label>
                      <input id="name" name="name" type="text" required placeholder="Your full name" value={form.name} onChange={handleChange} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', color: '#fff', borderRadius: '4px' }} />
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label htmlFor="company" className="label-gold" style={{ fontSize: '0.65rem', marginBottom: 0 }}>Company</label>
                      <input id="company" name="company" type="text" placeholder="Your organisation" value={form.company} onChange={handleChange} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', color: '#fff', borderRadius: '4px' }} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label htmlFor="email" className="label-gold" style={{ fontSize: '0.65rem', marginBottom: 0 }}>Email Address *</label>
                      <input id="email" name="email" type="email" required placeholder="you@company.com" value={form.email} onChange={handleChange} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', color: '#fff', borderRadius: '4px' }} />
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label htmlFor="phone" className="label-gold" style={{ fontSize: '0.65rem', marginBottom: 0 }}>Phone / WhatsApp</label>
                      <input id="phone" name="phone" type="tel" placeholder="+00 000 000 0000" value={form.phone} onChange={handleChange} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', color: '#fff', borderRadius: '4px' }} />
                    </div>
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '2rem' }}>
                    <label htmlFor="type" className="label-gold" style={{ fontSize: '0.65rem', marginBottom: 0 }}>Enquiry Type *</label>
                    <select id="type" name="type" required value={form.type} onChange={handleChange} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', color: '#fff', borderRadius: '4px', appearance: 'none' }}>
                      <option value="" style={{ background: 'var(--bg-dark-pro)' }}>Select an enquiry type</option>
                      {ENQUIRY_TYPES.map(t => <option key={t} value={t} style={{ background: 'var(--bg-dark-pro)' }}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '2.5rem' }}>
                    <label htmlFor="message" className="label-gold" style={{ fontSize: '0.65rem', marginBottom: 0 }}>Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      placeholder="Tell us about your requirements or product interest..."
                      value={form.message}
                      onChange={handleChange}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', color: '#fff', borderRadius: '4px', resize: 'none' }}
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '18px', boxShadow: 'var(--shadow-gold)' }}>
                    {loading ? (
                      <span className="contact-submit-loading">Sending enquiry…</span>
                    ) : (
                      <><Send size={18} style={{ marginRight: '10px' }}/> Send Enquiry</>
                    )}
                  </button>
                  <p className="form-disclaimer" style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                    By submitting this form you agree to our privacy policy. We do not share your data.
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
