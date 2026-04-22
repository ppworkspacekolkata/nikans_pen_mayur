import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Download, Globe, Share2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, delay: d, ease: [0.22,1,0.36,1] } }),
};

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} variants={fadeUp} custom={delay} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
      {children}
    </motion.div>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [pRes, cRes] = await Promise.all([
          fetch(API_ENDPOINTS.PRODUCTS),
          fetch(API_ENDPOINTS.CATEGORIES)
        ]);
        setProducts(await pRes.json());
        setCategories(await cRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || (p.category?.name || p.category) === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                       p.skuCode.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="page-products">
      <Navbar />

      {/* ── PAGE HERO ─────────────────────── */}
      <section className="page-hero-premium">
        <div className="page-hero-content">
          <motion.span className="label-gold" variants={fadeUp} custom={0} initial="hidden" animate="visible">
            Full Catalogue
          </motion.span>
          <motion.h1 className="page-hero-title" variants={fadeUp} custom={0.1} initial="hidden" animate="visible">
            Products Engineered<br />for <em>Every Purpose</em>
          </motion.h1>
          <motion.p className="page-hero-desc" variants={fadeUp} custom={0.2} initial="hidden" animate="visible">
            Browse the complete Nikan product catalogue — from signature executive pens 
            to washable classroom markers. All ISO-manufactured. All export-ready.
          </motion.p>
        </div>
      </section>



      {/* ── SEARCH & FILTER ────────────────── */}
      <section className="section products-toolbar">
        <div className="container toolbar-container" style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
           <div className="category-filter" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setActiveCategory('All')} 
                className={activeCategory === 'All' ? 'btn-filter active' : 'btn-filter'}
              >
                All Instruments
              </button>
              {categories.map(c => (
                <button 
                  key={c._id}
                  onClick={() => setActiveCategory(c.name)} 
                  className={activeCategory === c.name ? 'btn-filter active' : 'btn-filter'}
                >
                  {c.name}
                </button>
              ))}
           </div>
           <div className="search-box-wrap" style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by SKU or Name..." 
                style={{ width: '100%', padding: '12px 15px 12px 45px', borderRadius: '12px', border: '1px solid var(--border-dim)', outline: 'none' }}
              />
           </div>
        </div>
      </section>

      {/* ── PRODUCTS GRID ─────────────────────── */}
      <section className="section products-grid-section">
        {loading ? (
          <div style={{ padding: '50px', textAlign: 'center' }}><div className="loader-gold"></div></div>
        ) : filtered.length === 0 ? (
          <div className="products-empty">No products found for "{search}".</div>
        ) : (
          <div className="products-grid">
            {filtered.map((p, i) => (
              <Reveal key={p._id} delay={i * 0.04}>
                <Link to={`/product/${p.slug}`} className="product-card-link" style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                  <div className="product-card glass-card-pro" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease' }}>
                    <div className="product-card-image" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-dim)', marginBottom: '1.5rem', background: '#fff' }}>
                      <img src={`${API_BASE_URL}${p.mainImage}`} alt={p.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'contain', padding: '1rem' }} />
                    </div>
                    <div className="product-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="label-gold" style={{ margin: 0 }}>{p.skuCode}</span>
                      <span className="product-card-cat" style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--gold)' }}>{p.subCategory?.name || p.category?.name}</span>
                    </div>
                    <div className="product-card-name" style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: '0.8rem', color: 'var(--text-primary)', fontWeight: '800' }}>{p.name}</div>
                    <p className="product-card-desc" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem', flexGrow: 1 }}>{p.description?.substr(0, 100)}...</p>
                    
                    <div className="product-card-specs" style={{ background: 'var(--bg-secondary)', padding: '1rem 1.2rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid var(--border-dim)' }}>
                      <div className="product-spec" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}><span style={{ color: 'var(--text-muted)' }}>Material</span><span style={{ fontWeight: '700' }}>{p.material}</span></div>
                      <div className="product-spec" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}><span style={{ color: 'var(--text-muted)' }}>Tip Size</span><span style={{ fontWeight: '700' }}>{p.tip}</span></div>
                      <div className="product-spec" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}><span style={{ color: 'var(--text-muted)' }}>Pack</span><span style={{ fontWeight: '700' }}>{p.primaryPack}</span></div>
                    </div>

                    <div className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem', padding: '12px' }}>
                      View Enterprise Specs <ArrowRight size={14} style={{ marginLeft: '8px' }}/>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ── CATALOGUE CTA ─────────────────────── */}
      <section className="section products-cta-section">
        <Reveal>
          <div className="catalogue-cta">
            <div>
              <h3 className="catalogue-cta-title">Download the Full Catalogue</h3>
              <p className="catalogue-cta-desc">Get the complete October 2025 product catalogue with full specifications, SKUs, and pricing eligibility.</p>
            </div>
            <div className="catalogue-cta-actions">
               <a 
                 href="/product/NiKan%20Catalogue%20Oct%2025.pdf" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="btn-primary" 
                 style={{ boxShadow: 'var(--shadow-gold)' }}
               >
                 <Download size={18} style={{ marginRight: '8px' }} /> Download Catalogue
               </a>
              <a href="/contact" className="btn-outline" style={{ border: '2px solid rgba(255,255,255,0.2)', color: '#fff' }}>Request Pricing</a>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
