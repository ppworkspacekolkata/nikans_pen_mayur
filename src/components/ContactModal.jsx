import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { createPortal } from 'react-dom';

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
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setSent(true);
    setLoading(false);
  };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="contact-modal-overlay" style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}>
        <motion.div 
          className="contact-modal-content glass-card-pro modal-inner-responsive"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          style={{
            width: 'calc(100% - 40px)',
            maxWidth: '750px',
            background: 'var(--bg-dark-pro)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            display: 'flex',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            position: 'relative',
            maxHeight: '90vh'
          }}
        >
          {/* Left Side: Info */}
          <div className="modal-info-pane" style={{
            background: 'rgba(212, 175, 55, 0.05)',
            padding: '1.2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexShrink: 0,
            width: '260px'
          }}>
            <div>
              <span className="label-gold" style={{ fontSize: '0.5rem' }}>Contact Us</span>
              <h2 className="serif" style={{ fontSize: '1.2rem', margin: '0.3rem 0', color: '#fff' }}>Send an <em>Enquiry</em></h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', lineHeight: '1.3' }}>
                Response within 24 hours.
              </p>
            </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', margin: '0.8rem 0' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <div style={{ color: 'var(--gold)' }}><Mail size={12}/></div>
                <div style={{ fontSize: '0.7rem', color: '#fff', fontWeight: '600' }}>exports@tirupaticolorpens.com</div>
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <div style={{ color: 'var(--gold)' }}><Phone size={12}/></div>
                <div style={{ fontSize: '0.7rem', color: '#fff', fontWeight: '600' }}>+91 98300 58822</div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ color: 'var(--gold)' }}><MapPin size={12}/></div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.2' }}>West Bengal, India</div>
              </div>
            </div>

            <div style={{ 
              paddingTop: '0.6rem', 
              borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.55rem',
              color: 'var(--gold)',
              fontWeight: '700'
            }}>
              <ShieldCheck size={10} /> ISO 9001:2015 CERTIFIED
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="modal-form-pane" style={{ flex: 1, padding: '1.2rem', position: 'relative' }}>
            <button 
              onClick={onClose} 
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: 'var(--gold)', 
                  color: '#fff', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '1rem', 
                  margin: '0 auto 0.8rem' 
                }}>✓</div>
                <h3 className="serif" style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#fff' }}>Enquiry Received</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                  We will contact you shortly.
                </p>
                <button 
                  onClick={onClose}
                  className="btn-primary"
                  style={{ marginTop: '1.2rem', padding: '6px 20px', fontSize: '0.7rem' }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div className="form-group">
                    <label className="label-gold" style={{ fontSize: '0.5rem', display: 'block', marginBottom: '2px' }}>NAME</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={form.name} 
                      onChange={handleChange}
                      placeholder="Your name"
                      style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 8px', borderRadius: '4px', color: '#fff', fontSize: '0.75rem' }} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="label-gold" style={{ fontSize: '0.5rem', display: 'block', marginBottom: '2px' }}>COMPANY</label>
                    <input 
                      type="text" 
                      name="company" 
                      value={form.company} 
                      onChange={handleChange}
                      placeholder="Company"
                      style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 8px', borderRadius: '4px', color: '#fff', fontSize: '0.75rem' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div className="form-group">
                    <label className="label-gold" style={{ fontSize: '0.5rem', display: 'block', marginBottom: '2px' }}>EMAIL</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={form.email} 
                      onChange={handleChange}
                      placeholder="email@company.com"
                      style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 8px', borderRadius: '4px', color: '#fff', fontSize: '0.75rem' }} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="label-gold" style={{ fontSize: '0.5rem', display: 'block', marginBottom: '2px' }}>PHONE</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={form.phone} 
                      onChange={handleChange}
                      placeholder="+91 ..."
                      style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 8px', borderRadius: '4px', color: '#fff', fontSize: '0.75rem' }} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="label-gold" style={{ fontSize: '0.5rem', display: 'block', marginBottom: '2px' }}>ENQUIRY TYPE</label>
                  <select 
                    name="type" 
                    value={form.type} 
                    onChange={handleChange}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 8px', borderRadius: '4px', color: '#fff', fontSize: '0.75rem' }}
                  >
                    <option value="" style={{ background: '#000' }}>Select type...</option>
                    {ENQUIRY_TYPES.map(t => <option key={t} value={t} style={{ background: '#000' }}>{t}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="label-gold" style={{ fontSize: '0.5rem', display: 'block', marginBottom: '2px' }}>MESSAGE</label>
                  <textarea 
                    name="message" 
                    rows="1" 
                    value={form.message} 
                    onChange={handleChange}
                    placeholder="Briefly describe your needs..."
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 8px', borderRadius: '4px', color: '#fff', fontSize: '0.75rem', resize: 'none' }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary" 
                  style={{ width: '100%', marginTop: '0.2rem', padding: '8px', justifyContent: 'center', fontSize: '0.7rem' }}
                >
                  {loading ? 'SENDING...' : <><Send size={14} style={{ marginRight: '6px' }} /> SEND ENQUIRY</>}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
