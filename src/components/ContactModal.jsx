import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ShieldCheck, Mail, Phone } from 'lucide-react';
import { createPortal } from 'react-dom';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';

const ENQUIRY_TYPES = [
  'Product / Catalogue Enquiry',
  'Export / Distribution Partnership',
  'OEM / Private Label',
  'Pricing & MOQ',
  'Other',
];

export default function ContactModal({ isOpen, onClose, productContext = '' }) {
  const [form, setForm] = useState({ 
    name: '', 
    company: '', 
    email: '', 
    phone: '', 
    type: productContext ? 'Product / Catalogue Enquiry' : '', 
    message: productContext ? `I am interested in: ${productContext}` : '' 
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.ENQUIRIES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          subject: form.type,
          message: form.message,
        })
      });
      if (res.ok) setSent(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="contact-modal-overlay" 
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <motion.div 
        className="contact-modal-body"
        initial={{ opacity: 0, scale: 0.95, y: 0 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: '900px',
          maxHeight: 'min(750px, 95vh)',
          background: '#0a0a0a',
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'flex',
          border: '1px solid rgba(255,215,0,0.3)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.7)',
          position: 'relative'
        }}
      >
        {/* Left Side Info */}
        <div className="contact-modal-left" style={{
          width: '320px',
          background: 'linear-gradient(135deg, rgba(255,215,0,0.1), transparent)',
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0
        }}>
          <span style={{ color: 'var(--gold)', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '3px' }}>ENQUIRY PORTAL</span>
          <h2 className="serif" style={{ color: '#fff', fontSize: '2rem', margin: '0.8rem 0', lineHeight: '1.2' }}>Request a <br/><em>Premium Quote</em></h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: '1.2rem 0', lineHeight: '1.6' }}>Connect with our specialists for bulk exports and technical specifications.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '10px', background: 'rgba(255,215,0,0.1)', borderRadius: '10px' }}>
                <Mail size={16} color="var(--gold)" />
              </div>
              <span style={{ fontSize: '0.8rem', color: '#fff' }}>exports@tirupaticolorpens.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '10px', background: 'rgba(255,215,0,0.1)', borderRadius: '10px' }}>
                <Phone size={16} color="var(--gold)" />
              </div>
              <span style={{ fontSize: '0.8rem', color: '#fff' }}>+91 98300 58822</span>
            </div>
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={20} color="var(--gold)" />
            <span style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '1px' }}>ISO 9001:2015 CERTIFIED</span>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="contact-modal-right" style={{ flex: 1, padding: '3rem', position: 'relative', overflowY: 'auto' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '25px', right: '25px', color: '#888', cursor: 'pointer', transition: 'color 0.2s' }}>
            <X size={24} />
          </button>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ width: '50px', height: '50px', background: 'var(--gold)', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                <Send size={24} color="#000" />
              </div>
              <h3 className="serif" style={{ color: '#fff', fontSize: '1.5rem' }}>Success!</h3>
              <p style={{ color: '#888', marginTop: '0.5rem' }}>We'll contact you shortly.</p>
              <button onClick={onClose} className="btn-primary" style={{ marginTop: '1.5rem' }}>Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 'bold', display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>FULL NAME</label>
                  <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="e.g. Rahul Sharma" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 18px', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 'bold', display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>COMPANY NAME</label>
                  <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Optional" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 18px', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 'bold', display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>WORK EMAIL</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="email@company.com" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 18px', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 'bold', display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>PHONE NUMBER</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 ..." style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 18px', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none' }} />
                </div>
              </div>

              <div>
                <label style={{ color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 'bold', display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>ENQUIRY TYPE</label>
                <select name="type" value={form.type} onChange={handleChange} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 18px', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none', cursor: 'pointer' }}>
                  <option value="" style={{ background: '#000' }}>Select Service Type</option>
                  {ENQUIRY_TYPES.map(t => <option key={t} value={t} style={{ background: '#000' }}>{t}</option>)}
                </select>
              </div>

              <div>
                <label style={{ color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 'bold', display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>MESSAGE / REQUIREMENTS</label>
                <textarea name="message" rows="4" value={form.message} onChange={handleChange} placeholder="Tell us about your requirements..." style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 18px', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none', resize: 'none' }} />
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: '56px', fontSize: '1rem', fontWeight: '700' }}>
                {loading ? 'SENDING ENQUIRY...' : 'SEND ENQUIRY'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
