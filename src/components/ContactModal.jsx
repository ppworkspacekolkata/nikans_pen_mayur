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
      document.documentElement.style.overflow = 'hidden';
      // Force body perspective to none to avoid fixed position issues
      document.body.style.perspective = 'none';
      setSent(false);
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      document.body.style.perspective = '1200px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      document.body.style.perspective = '1200px';
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

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <style dangerouslySetInnerHTML={{ __html: `
            .contact-modal-overlay {
              position: fixed !important;
              inset: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              background: rgba(0,0,0,0.8) !important;
              backdrop-filter: blur(20px) !important;
              -webkit-backdrop-filter: blur(20px) !important;
              z-index: 99999999 !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              padding: 20px !important;
              overflow: hidden !important;
            }
            @media (max-width: 768px) {
              .contact-modal-overlay { padding: 0 !important; }
              .contact-modal-body { 
                width: 100% !important;
                height: 100% !important;
                max-height: 100vh !important; 
                border-radius: 0 !important; 
                flex-direction: column !important;
              }
              .contact-modal-left { display: none !important; }
              .contact-modal-right { 
                padding: 2rem 1.5rem !important;
                height: 100% !important;
                display: flex !important;
                flex-direction: column !important;
              }
              .modal-grid-2 { grid-template-columns: 1fr !important; gap: 1rem !important; }
              .modal-close-btn { top: 15px !important; right: 15px !important; background: rgba(255,255,255,0.1) !important; border-radius: 50% !important; width: 44px !important; height: 44px !important; display: flex !important; align-items: center !important; justify-content: center !important; }
            }
          `}} />
          
          <motion.div 
            className="contact-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target.className === 'contact-modal-overlay' && onClose()}
          >
            <motion.div 
              className="contact-modal-body"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{
                width: '100%',
                maxWidth: '960px',
                maxHeight: 'min(850px, 92vh)',
                background: '#0a0a0a',
                borderRadius: '32px',
                overflow: 'hidden',
                display: 'flex',
                border: '1px solid rgba(255,215,0,0.4)',
                boxShadow: '0 50px 150px rgba(0,0,0,1)',
                position: 'relative'
              }}
            >
              {/* Left Side Info */}
              <div className="contact-modal-left" style={{
                width: '360px',
                background: 'linear-gradient(145deg, rgba(255,215,0,0.12), transparent)',
                padding: '4.5rem 3.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderRight: '1px solid rgba(255,255,255,0.08)',
                flexShrink: 0
              }}>
                <span style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '4px' }}>ENQUIRY PORTAL</span>
                <h2 className="serif" style={{ color: '#fff', fontSize: '2.5rem', margin: '1rem 0', lineHeight: '1.1' }}>Request a <br/><em>Premium Quote</em></h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', margin: '1.8rem 0', lineHeight: '1.6' }}>Direct access to our specialists for volume exports and bespoke requirements.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', marginTop: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ padding: '14px', background: 'rgba(255,215,0,0.1)', borderRadius: '14px' }}>
                      <Mail size={20} color="var(--gold)" />
                    </div>
                    <span style={{ fontSize: '0.9rem', color: '#fff' }}>exports@tirupaticolorpens.com</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ padding: '14px', background: 'rgba(255,215,0,0.1)', borderRadius: '14px' }}>
                      <Phone size={20} color="var(--gold)" />
                    </div>
                    <span style={{ fontSize: '0.9rem', color: '#fff' }}>+91 98300 58822</span>
                  </div>
                </div>

                <div style={{ marginTop: '5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <ShieldCheck size={28} color="var(--gold)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '1px' }}>ISO 9001:2015 CERTIFIED</span>
                </div>
              </div>

              {/* Right Side Form */}
              <div className="contact-modal-right" style={{ flex: 1, padding: '4rem', position: 'relative', overflowY: 'auto' }}>
                <button onClick={onClose} className="modal-close-btn" style={{ position: 'absolute', top: '30px', right: '30px', color: '#fff', cursor: 'pointer', transition: '0.2s', background: 'none', border: 'none', zIndex: 100, opacity: 0.7 }}>
                  <X size={32} />
                </button>

                {sent ? (
                  <div style={{ textAlign: 'center', padding: '4rem 0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <motion.div 
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      style={{ width: '100px', height: '100px', background: 'var(--gold)', borderRadius: '50%', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(255,204,0,0.3)' }}
                    >
                      <Send size={40} color="#000" />
                    </motion.div>
                    <h3 className="serif" style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '1.2rem' }}>Message Received</h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', maxWidth: '350px', lineHeight: '1.6' }}>Thank you for your interest. A specialist will review your enquiry and respond shortly.</p>
                    <button onClick={onClose} className="btn-primary" style={{ marginTop: '3rem', padding: '18px 50px', fontSize: '1.1rem' }}>Return to Site</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                    <div className="modal-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.8rem' }}>
                      <div>
                        <label style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginBottom: '10px', letterSpacing: '1px' }}>FULL NAME</label>
                        <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Rahul Sharma" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', padding: '18px 22px', borderRadius: '14px', color: '#fff', fontSize: '1.05rem', outline: 'none', transition: 'border-color 0.2s' }} />
                      </div>
                      <div>
                        <label style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginBottom: '10px', letterSpacing: '1px' }}>COMPANY NAME</label>
                        <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Optional" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', padding: '18px 22px', borderRadius: '14px', color: '#fff', fontSize: '1.05rem', outline: 'none' }} />
                      </div>
                    </div>

                    <div className="modal-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.8rem' }}>
                      <div>
                        <label style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginBottom: '10px', letterSpacing: '1px' }}>WORK EMAIL</label>
                        <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="email@company.com" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', padding: '18px 22px', borderRadius: '14px', color: '#fff', fontSize: '1.05rem', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginBottom: '10px', letterSpacing: '1px' }}>PHONE NUMBER</label>
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 ..." style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', padding: '18px 22px', borderRadius: '14px', color: '#fff', fontSize: '1.05rem', outline: 'none' }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginBottom: '10px', letterSpacing: '1px' }}>ENQUIRY TYPE</label>
                      <select name="type" value={form.type} onChange={handleChange} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', padding: '18px 22px', borderRadius: '14px', color: '#fff', fontSize: '1.05rem', outline: 'none', cursor: 'pointer' }}>
                        <option value="" style={{ background: '#000' }}>Select Service Type</option>
                        {ENQUIRY_TYPES.map(t => <option key={t} value={t} style={{ background: '#000' }}>{t}</option>)}
                      </select>
                    </div>

                    <div>
                      <label style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginBottom: '10px', letterSpacing: '1px' }}>MESSAGE / REQUIREMENTS</label>
                      <textarea name="message" rows="5" value={form.message} onChange={handleChange} placeholder="Tell us about your requirements..." style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', padding: '18px 22px', borderRadius: '14px', color: '#fff', fontSize: '1.05rem', outline: 'none', resize: 'none', lineHeight: '1.6' }} />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: '64px', fontSize: '1.15rem', fontWeight: '800' }}>
                      {loading ? 'SENDING ENQUIRY...' : 'SEND ENQUIRY'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
