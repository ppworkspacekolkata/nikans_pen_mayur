import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ArrowRight, Globe, Share2 } from 'lucide-react';

const PRODUCTS_LINKS = ['Ball Point Pens','Washable Markers','Gel Pens','Sketch Pens','Gift Sets'];
const COMPANY_LINKS  = [
  { label: 'Our Story', to: '/about' },
  { label: 'Manufacturing', to: '/about' },
  { label: 'Global Reach',    to: '/exports' },
  { label: 'Opportunities',          to: '/careers' },
  { label: 'Newsroom',            to: '/media'   },
];
const CONTACT_LINKS = [
  { label: 'info@nikan.in',        href: 'mailto:info@nikan.in' },
  { label: 'Product Catalogue',   href: '/media' },
  { label: 'Bulk Enquiries',      href: '/contact' },
  { label: 'Partner with Us',          href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="footer" style={{ background: 'var(--bg-dark-pro)', color: '#fff', paddingTop: '5rem', borderTop: '4px solid var(--gold)' }}>
      <div className="footer-top" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
        <div className="footer-brand-col" style={{ maxWidth: '300px' }}>
          <Link to="/" className="footer-brand-name" style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', textTransform: 'uppercase' }}>
            ni<span style={{ color: 'var(--gold)' }}>k</span>an ®
          </Link>
          <div className="footer-brand-tagline" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', fontWeight: '700', color: 'var(--gold)', marginTop: '0.2rem' }}>PRECISION CRAFTED</div>
          <p className="footer-brand-desc" style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a href="mailto:info@nikan.in" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '0.9rem', fontWeight: '600' }}>
              <Mail size={16} style={{ color: 'var(--gold)' }} /> info@nikan.in
            </a>
            <div style={{ display: 'flex', gap: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
              <MapPin size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} /> West Bengal, India
            </div>
            <a href="/contact" style={{ background: 'var(--gold)', color: '#000', padding: '10px 20px', borderRadius: '4px', textAlign: 'center', fontWeight: '800', fontSize: '0.75rem', marginTop: '0.5rem' }}>
              GET A QUOTE
            </a>
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
