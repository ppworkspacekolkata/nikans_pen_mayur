import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Download, ChevronDown, ChevronRight, Plus, Minus } from 'lucide-react';
import ContactModal from './ContactModal';
import { API_ENDPOINTS } from '../config/api';

import logo from '../assets/logo.png';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isProductsHovered, setIsProductsHovered] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null); // Track which category is expanded
  const { pathname } = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn);
    fetchNavData();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const fetchNavData = async () => {
    try {
      const [cRes, sRes] = await Promise.all([
        fetch(API_ENDPOINTS.CATEGORIES),
        fetch(API_ENDPOINTS.SUB_CATEGORIES)
      ]);
      const cData = await cRes.json();
      const sData = await sRes.json();
      setCategories(cData.filter(c => c.isActive));
      setSubCategories(sData.filter(s => s.isActive));
    } catch (err) {
      console.error("Error fetching nav data:", err);
    }
  };

  useEffect(() => { setOpen(false); window.scrollTo(0,0); }, [pathname]);

  const toggleCat = (e, catId) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCat(expandedCat === catId ? null : catId);
  };

  return (
    <>
      <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`} style={navContainerStyle(scrolled)}>
        <div style={navInner}>
          {/* LOGO */}
          <Link to="/" className="nav-logo-wrap">
            <img src={logo} alt="Nikan Logo" style={{ height: '50px', width: 'auto' }} />
          </Link>

          {/* MAIN LINKS */}
          <ul className="nav-links" style={navLinksStyle}>
            <li><Link to="/about" className="nav-link">ABOUT US</Link></li>
            
            {/* PRODUCTS DROPDOWN */}
            <li 
              onMouseEnter={() => setIsProductsHovered(true)} 
              onMouseLeave={() => {
                setIsProductsHovered(false);
                setExpandedCat(null);
              }}
              style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
            >
              <Link to="/products" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                PRODUCTS <ChevronDown size={14} />
              </Link>
              
              <AnimatePresence>
                {isProductsHovered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    style={dropdownWrapper}
                  >
                    <div style={dropdownList}>
                      {categories.map(cat => (
                        <div key={cat._id} style={catItemWrapper}>
                          <div 
                            style={catRow} 
                            onClick={(e) => toggleCat(e, cat._id)}
                          >
                            <span style={catName}>{cat.name.toUpperCase()}</span>
                            {expandedCat === cat._id ? <Minus size={14} /> : <Plus size={14} />}
                          </div>

                          <AnimatePresence>
                            {expandedCat === cat._id && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                style={{ overflow: 'hidden' }}
                              >
                                <div style={subListContainer}>
                                  {subCategories
                                    .filter(sub => (sub.category?._id || sub.category) === cat._id)
                                    .map(sub => (
                                      <Link 
                                        key={sub._id} 
                                        to={`/products?subcategory=${sub._id}`} 
                                        style={subLinkStyle}
                                      >
                                        <ChevronRight size={12} color="var(--gold)" /> {sub.name}
                                      </Link>
                                    ))}
                                  <Link to={`/products?category=${cat._id}`} style={viewAllLink}>
                                    View All {cat.name} <ArrowUpRight size={12} />
                                  </Link>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            <li><Link to="/exports" className="nav-link">EXPORTS</Link></li>
            <li><Link to="/media" className="nav-link">MEDIA</Link></li>
            <li><Link to="/contact" className="nav-link">CONTACT US</Link></li>
          </ul>

          {/* ACTION BUTTONS */}
          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <a 
              href="/product/NiKan%20Catalogue%20Oct%2025.pdf" 
              target="_blank" 
              className="navbar-download-btn"
              style={downloadBtnStyle}
            >
              CATALOGUE <Download size={14} />
            </a>
            <button onClick={() => setIsContactOpen(true)} className="nav-cta" style={ctaStyle}>
              INQUIRY <ArrowUpRight size={14} />
            </button>
            <button className="nav-burger" onClick={() => setOpen(o => !o)} style={{ color: '#000' }}>
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {open && (
        <div className="mobile-drawer" style={mobileDrawerStyle}>
          <ul style={{ padding: '4rem 2rem' }}>
            {['About Us', 'Exports', 'Media', 'Contact Us'].map((label) => (
              <li key={label} style={{ margin: '1.5rem 0' }}>
                <Link to={`/${label.toLowerCase().replace(' ', '')}`} style={mobileMainLink} onClick={() => setOpen(false)}>
                  {label.toUpperCase()}
                </Link>
              </li>
            ))}
            
            <li style={{ margin: '2rem 0' }}>
              <div style={mobileProductsHeader}>PRODUCTS</div>
              {categories.map(cat => (
                <div key={cat._id} style={{ marginBottom: '1.5rem' }}>
                  <div 
                    style={mobileCatRow} 
                    onClick={(e) => toggleCat(e, cat._id)}
                  >
                    {cat.name} {expandedCat === cat._id ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                  {expandedCat === cat._id && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '1.5rem', marginTop: '10px' }}>
                      {subCategories.filter(sub => (sub.category?._id || sub.category) === cat._id).map(sub => (
                        <Link key={sub._id} to={`/products?subcategory=${sub._id}`} style={mobileSubLink} onClick={() => setOpen(false)}>
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </li>

            <li style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a href="/product/NiKan%20Catalogue%20Oct%2025.pdf" target="_blank" style={mobileBtnGold}>
                CATALOGUE <Download size={20} />
              </a>
              <button onClick={() => { setOpen(false); setIsContactOpen(true); }} style={mobileBtnBlack}>
                INQUIRY <ArrowUpRight size={20} />
              </button>
            </li>
          </ul>
        </div>
      )}

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      <style dangerouslySetInnerHTML={{ __html: `
        .nav-link { 
          font-size: 0.75rem; 
          font-weight: 700; 
          letter-spacing: 0.1em; 
          color: #4b5563; 
          text-decoration: none;
          transition: all 0.3s ease;
          padding: 8px 0;
          position: relative;
        }
        .nav-link:hover { color: #000; }
        .nav--scrolled .nav-link { color: #1f2937; }
        @media (max-width: 1024px) {
          .nav-links { display: none !important; }
        }
      `}} />
    </>
  );
}

// STYLES
const navContainerStyle = (scrolled) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '90px',
  background: scrolled ? '#fff' : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderBottom: scrolled ? '1px solid #e5e7eb' : 'none',
  zIndex: 1000,
  transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  justifyContent: 'center'
});

const navInner = {
  width: '92%',
  maxWidth: '1400px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const navLinksStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '2.2rem',
  listStyle: 'none',
  margin: 0,
  padding: 0
};

const dropdownWrapper = {
  position: 'absolute',
  top: '100%',
  left: '0',
  minWidth: '280px',
  background: '#fff',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
  borderRadius: '0 0 12px 12px',
  padding: '15px 0',
  zIndex: 1001,
  borderTop: '3px solid var(--gold)'
};

const dropdownList = { display: 'flex', flexDirection: 'column' };

const catItemWrapper = { borderBottom: '1px solid #f3f4f6' };

const catRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 24px',
  cursor: 'pointer',
  transition: '0.2s',
  background: '#fff',
  userSelect: 'none'
};

const catName = { fontSize: '0.8rem', fontWeight: '800', color: '#111827', letterSpacing: '0.5px' };

const subListContainer = {
  padding: '5px 24px 20px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  background: '#f9fafb'
};

const subLinkStyle = {
  fontSize: '0.75rem',
  color: '#4b5563',
  textDecoration: 'none',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: '0.2s'
};

const viewAllLink = {
  fontSize: '0.7rem',
  color: 'var(--gold)',
  fontWeight: '800',
  textDecoration: 'none',
  marginTop: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  borderTop: '1px solid #e5e7eb',
  paddingTop: '8px'
};

const downloadBtnStyle = {
  padding: '10px 20px',
  fontSize: '0.7rem',
  fontWeight: '800',
  background: 'var(--gold)',
  color: '#000',
  borderRadius: '6px',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: '0.3s'
};

const ctaStyle = {
  padding: '12px 24px',
  fontSize: '0.75rem',
  fontWeight: '800',
  background: '#000',
  color: '#fff',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: '0.3s'
};

const mobileDrawerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100vh',
  background: '#fff',
  zIndex: 999,
  overflowY: 'auto'
};

const mobileMainLink = { fontSize: '1.8rem', fontWeight: '900', color: '#000', textDecoration: 'none', letterSpacing: '-0.5px' };
const mobileProductsHeader = { fontSize: '1.4rem', fontWeight: '900', color: '#9ca3af', marginBottom: '1.5rem', borderBottom: '2px solid #f3f4f6' };
const mobileCatRow = { fontSize: '1.3rem', fontWeight: '800', color: '#111827', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const mobileSubLink = { fontSize: '1.1rem', color: '#4b5563', textDecoration: 'none', fontWeight: '600' };
const mobileBtnGold = { background: 'var(--gold)', color: '#000', padding: '1.2rem', borderRadius: '10px', fontWeight: '900', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };
const mobileBtnBlack = { background: '#000', color: '#fff', padding: '1.2rem', borderRadius: '10px', fontWeight: '900', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };

export default Navbar;
