import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
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
    <AnimatePresence mode="wait">
      <div 
        className="contact-modal-overlay" 
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}
      >
        <motion.div 
          className="contact-modal-content glass-card-pro"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            maxWidth: '900px',
            background: 'var(--bg-dark-pro)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            display: 'flex',
            border: '1px solid rgba(255,215,0,0.25)',
            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.7)',
            position: 'relative'
          }}
        >
          {/* Left Side: Info */}
          <div className="modal-info-pane" style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12), rgba(0,0,0,0))',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexShrink: 0,
            width: '320px',
            borderRight: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div>
              <span className="label-gold" style={{ fontSize: '0.6rem', letterSpacing: '2px' }}>ENQUIRY PORTAL</span>
              <h2 className="serif" style={{ fontSize: '1.8rem', color: '#fff', margin: '0.8rem 0', lineHeight: '1.2' }}>Request a <em>Custom Quote</em></h2>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', marginBottom: '2rem' }}>
                Connect with our export specialists for bulk pricing and technical specifications.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ padding: '8px', background: 'rgba(212,175,55,0.1)', borderRadius: '8px' }}>
                    <Mail size={16} color="var(--gold)" />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: '500' }}>exports@tirupaticolorpens.com</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ padding: '8px', background: 'rgba(212,175,55,0.1)', borderRadius: '8px' }}>
                    <Phone size={16} color="var(--gold)" />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: '500' }}>+91 98300 58822</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={18} color="var(--gold)" />
              <div style={{ fontSize: '0.65rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '1px' }}>
                ISO 9001:2015 CERTIFIED PLANT
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="modal-form-pane" style={{ flex: 1, padding: '2.5rem', position: 'relative' }}>
            <button 
              onClick={onClose} 
              style={{
                position: 'absolute', top: '20px', right: '20px',
                background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.4)', 
                cursor: 'pointer', zIndex: 10, width: '32px', height: '32px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--gold)', borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(212,175,55,0.3)' }}>
                  <Send size={24} color="#000" />
                </div>
                <h3 className="serif" style={{ color: '#fff', fontSize: '1.8rem' }}>Enquiry Received</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', marginTop: '0.8rem' }}>Thank you. Our team will contact you shortly.</p>
                <button onClick={onClose} className="btn-primary" style={{ marginTop: '2rem', padding: '10px 40px' }}>Return to Site</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                  <div className="input-group-pro">
                    <label className="label-gold" style={{ fontSize: '0.6rem', marginBottom: '6px', display: 'block', fontWeight: '700' }}>FULL NAME</label>
                    <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="e.g. Rahul Sharma" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
                  </div>
                  <div className="input-group-pro">
                    <label className="label-gold" style={{ fontSize: '0.6rem', marginBottom: '6px', display: 'block', fontWeight: '700' }}>COMPANY NAME</label>
                    <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Optional" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                  <div className="input-group-pro">
                    <label className="label-gold" style={{ fontSize: '0.6rem', marginBottom: '6px', display: 'block', fontWeight: '700' }}>WORK EMAIL</label>
                    <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="email@company.com" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
                  </div>
                  <div className="input-group-pro">
                    <label className="label-gold" style={{ fontSize: '0.6rem', marginBottom: '6px', display: 'block', fontWeight: '700' }}>PHONE NUMBER</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 ..." style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
                  </div>
                </div>

                <div className="input-group-pro">
                  <label className="label-gold" style={{ fontSize: '0.6rem', marginBottom: '6px', display: 'block', fontWeight: '700' }}>ENQUIRY TYPE</label>
                  <select name="type" value={form.type} onChange={handleChange} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' }}>
                    <option value="" style={{ background: '#111' }}>Select Service Type</option>
                    {ENQUIRY_TYPES.map(t => <option key={t} value={t} style={{ background: '#111' }}>{t}</option>)}
                  </select>
                </div>

                <div className="input-group-pro">
                  <label className="label-gold" style={{ fontSize: '0.6rem', marginBottom: '6px', display: 'block', fontWeight: '700' }}>MESSAGE / REQUIREMENTS</label>
                  <textarea name="message" rows="2" value={form.message} onChange={handleChange} placeholder="Tell us about your bulk requirements..." style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', resize: 'none', outline: 'none' }} />
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', height: '52px', justifyContent: 'center', fontSize: '1rem', fontWeight: '600' }}>
                  {loading ? 'PROCESSING...' : 'SEND ENQUIRY'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
,
    document.body
  );
}
