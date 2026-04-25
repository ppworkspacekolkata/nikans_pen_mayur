import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ArrowRight, Globe, Share2 } from 'lucide-react';
import logo from '../assets/logo.png';

const PRODUCTS_LINKS = ['Ball Point Pens', 'Washable Markers', 'Gel Pens', 'Sketch Pens', 'Gift Sets'];
const COMPANY_LINKS = [
  { label: 'Our Story', to: '/about' },
  { label: 'Manufacturing', to: '/about' },
  { label: 'Global Reach', to: '/exports' },
  { label: 'Opportunities', to: '/careers' },
  { label: 'Media', to: '/media' },
];
const CONTACT_LINKS = [
  { label: 'exports@tirupaticolorpens.com', href: 'mailto:exports@tirupaticolorpens.com' },
  { label: 'Product Catalogue', href: '/product/NiKan%20Catalogue%20Oct%2025.pdf' },
  { label: 'Bulk Enquiries', href: '/contact' },
  { label: 'Partner with Us', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="footer" style={{ background: 'var(--bg-dark-pro)', color: '#fff', paddingTop: '5rem', borderTop: '4px solid var(--gold)' }}>
      <div className="footer-top" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
        <div className="footer-brand-col" style={{ maxWidth: '300px' }}>
          <Link to="/" className="footer-brand-name" style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <img src={logo} alt="Nikan Logo" style={{ height: '45px', width: 'auto', objectFit: 'contain' }} />
          </Link>
          <p className="footer-brand-desc" style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
            Transforming the world of writing with Indian engineering excellence.
            ISO 9001:2015 Certified Manufacturing.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)' }}><Globe size={18} /></a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)' }}><Share2 size={18} /></a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)' }}><Mail size={18} /></a>
          </div>
        </div>

        <div>
          <div className="footer-col-title" style={{ color: '#fff', fontWeight: '800', fontSize: '0.9rem', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>PRODUCTS</div>
          <ul className="footer-links" style={{ listStyle: 'none', padding: 0 }}>
            {PRODUCTS_LINKS.map(l => (
              <li key={l} style={{ marginBottom: '0.8rem' }}>
                <a href="/products" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowRight size={12} style={{ color: 'var(--gold)' }} /> {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="footer-col-title" style={{ color: '#fff', fontWeight: '800', fontSize: '0.9rem', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>COMPANY</div>
          <ul className="footer-links" style={{ listStyle: 'none', padding: 0 }}>
            {COMPANY_LINKS.map(l => (
              <li key={l.label} style={{ marginBottom: '0.8rem' }}>
                <Link to={l.to} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="footer-col-title" style={{ color: '#fff', fontWeight: '800', fontSize: '0.9rem', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>CONTACT US</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <a href="mailto:exports@tirupaticolorpens.com" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '0.85rem', fontWeight: '600' }}>
              <Mail size={16} style={{ color: 'var(--gold)' }} /> exports@tirupaticolorpens.com
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '0.85rem', fontWeight: '600' }}>
              <Phone size={16} style={{ color: 'var(--gold)' }} /> +91 9830058822
            </div>
            <div style={{ display: 'flex', gap: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
              <MapPin size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} /> Tirupati Colour Pens Pvt. Ltd., Vill-Nandabhanga, Guljarmore, P.O. Kanganberia, South 24 Parganas — 743503, West Bengal, India
            </div>
            <a href="/contact" style={{ background: 'var(--gold)', color: '#000', padding: '10px 20px', borderRadius: '4px', textAlign: 'center', fontWeight: '800', fontSize: '0.75rem', marginTop: '0.5rem' }}>
              GET A QUOTE
            </a>
            <div style={{ display: 'flex', gap: '1.2rem', marginTop: '1rem', justifyContent: 'center' }}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--gold)'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--gold)'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--gold)'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--gold)'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom" style={{ marginTop: '5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '2rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>© {new Date().getFullYear()} Tirupati Colour Pens Pvt. Ltd.</span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>Privacy</a>
          <a href="#" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>Terms</a>
        </div>
      </div>
    </footer>
  );
}
