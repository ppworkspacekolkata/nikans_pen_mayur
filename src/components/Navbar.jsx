import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About Us',   to: '/about'   },
  { label: 'Our Team',   to: '/team'    },
  { label: 'Brands',     to: '/brands'  },
  { label: 'Products',   to: '/products'},
  { label: 'Exports',    to: '/exports' },
  { label: 'Media',      to: '/media'   },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); window.scrollTo(0,0); }, [pathname]);

  return (
    <>
      <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`} 
        style={{ 
          background: scrolled ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.4)',
          borderBottom: scrolled ? '1px solid var(--border-dim)' : 'none'
        }}>
        <Link to="/" className="nav-logo-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          <div className="nav-logo" style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#000', textTransform: 'uppercase' }}>
            ni<span style={{ color: 'var(--gold)' }}>k</span>an{pathname === '/' && ' india'}<span style={{ fontSize: '0.8rem', verticalAlign: 'top', marginLeft: '2px' }}>®</span>
          </div>
          <div className="nav-tagline" style={{ fontSize: '0.55rem', letterSpacing: '0.3em', fontWeight: '800', opacity: '0.6', marginTop: '-4px' }}>PRECISION WRITING</div>
        </Link>

        <ul className="nav-links">
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <Link to={to} 
                className={`nav-link${pathname === to ? ' nav-link--active' : ''}`}
                style={{ 
                  fontSize: '0.72rem', 
                  fontWeight: '700', 
                  letterSpacing: '0.12em',
                  color: pathname === to ? '#000' : 'var(--text-muted)'
                }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-right" style={{ gap: '1.5rem' }}>
          <Link to="/contact" className={`nav-cta${pathname === '/contact' ? ' nav-cta--active' : ''}`}
            style={{ 
              padding: '10px 24px', 
              fontSize: '0.75rem', 
              fontWeight: '800', 
              borderRadius: 'var(--radius-sm)',
              background: '#000',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
            INQUIRY <ArrowUpRight size={14} />
          </Link>
          <button className="nav-burger" onClick={() => setOpen(o => !o)} aria-label="Menu" style={{ color: '#000' }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="mobile-drawer" style={{ background: '#fff', zIndex: 999 }}>
          <ul style={{ padding: '4rem 2rem' }}>
            {NAV_LINKS.map(({ label, to }) => (
              <li key={to} style={{ margin: '1.5rem 0' }}>
                <Link to={to} 
                  style={{ fontSize: '1.5rem', fontWeight: '800', color: pathname === to ? 'var(--gold)' : '#000' }} 
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li style={{ marginTop: '3rem' }}>
              <Link to="/contact" 
                style={{ background: '#000', color: '#fff', padding: '1rem 2rem', borderRadius: '4px', fontWeight: '800' }} 
                onClick={() => setOpen(false)}
              >
                CONTACT US
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
