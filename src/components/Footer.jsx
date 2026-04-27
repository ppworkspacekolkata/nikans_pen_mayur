import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ArrowRight, Globe, Share2 } from 'lucide-react';
import logo from '../assets/logo.png';
import { API_ENDPOINTS } from '../config/api';

const DEFAULT_PRODUCTS = ['Ball Point Pens', 'Washable Markers', 'Gel Pens', 'Sketch Pens', 'Gift Sets'];
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
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          fetch(API_ENDPOINTS.CATEGORIES),
          fetch(API_ENDPOINTS.SUB_CATEGORIES)
        ]);
        const cats = await catRes.json();
        const subs = await subRes.json();
        
        // Combine categories and subcategories for the footer, limit to 6
        const combined = [...cats.map(c => c.name), ...subs.map(s => s.name)].slice(0, 6);
        setLinks(combined.length > 0 ? combined : DEFAULT_PRODUCTS);
      } catch (err) {
        console.error("Footer Fetch Error:", err);
        setLinks(DEFAULT_PRODUCTS);
      }
    };
    fetchLinks();
  }, []);

  return (
    <footer className="footer" style={{ background: 'var(--bg-dark-pro)', color: '#fff', paddingTop: '5rem', borderTop: '4px solid var(--gold)', overflow: 'hidden' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <div className="footer-top" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '4rem' }}>
          <div className="footer-brand-col" style={{ maxWidth: '400px' }}>
            <Link to="/" className="footer-brand-name" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
              <img src={logo} alt="Nikan Logo" style={{ height: '65px', width: 'auto', objectFit: 'contain' }} />
            </Link>
            <p className="footer-brand-desc" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8', maxWidth: '340px' }}>
              Transforming the world of writing with Indian engineering excellence.
              ISO 9001:2015 Certified Manufacturing.
            </p>
            <div style={{ display: 'flex', gap: '1.2rem', marginTop: '2rem' }}>
              <a href="#" className="social-link-footer"><Globe size={20} /></a>
              <a href="#" className="social-link-footer"><Share2 size={20} /></a>
              <a href="#" className="social-link-footer"><Mail size={20} /></a>
            </div>
          </div>

          <div>
            <div className="footer-col-title">PRODUCTS</div>
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0 }}>
              {links.map(l => (
                <li key={l} style={{ marginBottom: '1rem' }}>
                  <Link to="/products" className="footer-nav-link">
                    <ArrowRight size={14} style={{ color: 'var(--gold)' }} /> {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer-col-title">COMPANY</div>
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0 }}>
              {COMPANY_LINKS.map(l => (
                <li key={l.label} style={{ marginBottom: '1rem' }}>
                  <Link to={l.to} className="footer-nav-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer-col-title">CONTACT US</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <a href="mailto:exports@tirupaticolorpens.com" className="footer-contact-item">
                <Mail size={18} style={{ color: 'var(--gold)' }} /> exports@tirupaticolorpens.com
              </a>
              <div className="footer-contact-item">
                <Phone size={18} style={{ color: 'var(--gold)' }} /> +91 9830058822
              </div>
              <div className="footer-contact-item" style={{ alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }} /> 
                <span>Vill-Nandabhanga, Guljarmore, P.O. Kanganberia, South 24 Parganas — 743503, West Bengal</span>
              </div>
              
              <div style={{ display: 'flex', gap: '1.2rem', marginTop: '1rem' }}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-pro">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-pro">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-pro">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom" style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>© {new Date().getFullYear()} Tirupati Colour Pens Pvt. Ltd.</span>
          <div style={{ display: 'flex', gap: '2.5rem' }}>
            <a href="#" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
