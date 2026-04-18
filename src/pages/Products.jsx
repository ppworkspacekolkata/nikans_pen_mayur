import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, ArrowRight, Download, Globe, Share2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import imgAuram from '../assets/photos/img740.jpg';
import imgAventus from '../assets/photos/img752.jpg';
import imgPentastic from '../assets/photos/img306.jpg';
import imgNeo from '../assets/photos/img502.jpg';
import imgAviator from '../assets/photos/img674.jpg';
import imgKiddo from '../assets/photos/img536.jpg';
import imgChisel from '../assets/photos/img462.jpg';
import imgBold from '../assets/photos/img171.jpg';
import imgSketch from '../assets/photos/img197.jpg';
import imgGel from '../assets/photos/img223.jpg';
import imgPack from '../assets/photos/img803.jpg';
import imgGift from '../assets/photos/img839.jpg';

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

const CATEGORIES = ['All', 'Ball Pens', 'Markers', 'Gel Pens', 'Sketch Pens', 'Multi-Packs', 'Gift Sets'];

const PRODUCTS = [
  { name:'Auram Ball Pen',     cat:'Ball Pens',    tag:'Premium',  tip:'0.7mm', colours:'Blue/Black', units:10,  desc:'Nickel silver tip, gold-accented premium ball pen.', img: imgAuram },
  { name:'Aventus Ball Pen',   cat:'Ball Pens',    tag:'Signature',tip:'1.0mm', colours:'Blue/Black', units:10,  desc:'Bold stroke signature pen with technical-blue body.', img: imgAventus },
  { name:'Pentastic Ball Pen', cat:'Ball Pens',    tag:'Everyday', tip:'0.7mm', colours:'Multi',      units:10,  desc:'Transparent body, fine tip everyday writing pen.', img: imgPentastic },
  { name:'Neo Ball Pen',       cat:'Ball Pens',    tag:'Smooth',   tip:'Ball',  colours:'Pastel',     units:12,  desc:'Super smooth ink flow with distinctive pastel body.', img: imgNeo },
  { name:'Aviator Ball Pen',   cat:'Ball Pens',    tag:'Bold',     tip:'Ball',  colours:'Multi',      units:10,  desc:'Aviation-inspired metallic body ball point pen.', img: imgAviator },
  { name:'Kiddo Ball Pen',     cat:'Ball Pens',    tag:'Student',  tip:'Ball',  colours:'Fun',        units:20,  desc:'Child-friendly ergonomic pen for young writers.', img: imgKiddo },
  { name:'Chisel Marker',      cat:'Markers',      tag:'Washable', tip:'Chisel',colours:'10 Shades',  units:10,  desc:'Bold, washable chisel-tip markers for classrooms.', img: imgChisel },
  { name:'Bold Washable Marker',cat:'Markers',     tag:'Bold',     tip:'Jumbo', colours:'10 Shades',  units:10,  desc:'Extra-bold washable marker for vibrant art work.', img: imgBold },
  { name:'Sketch Pen Set',     cat:'Sketch Pens',  tag:'Art',      tip:'Fine',  colours:'12 Colours', units:12,  desc:'Fine-tip sketch pens for illustrations and colouring.', img: imgSketch },
  { name:'Gel Pen Set',        cat:'Gel Pens',     tag:'Smooth',   tip:'0.5mm', colours:'Blue/Black', units:12,  desc:'Smooth gel ink cartridge for flowing handwriting.', img: imgGel },
  { name:'Multi-Pack Assorted',cat:'Multi-Packs',  tag:'Value',    tip:'Mixed', colours:'Assorted',   units:20,  desc:'Best-value mixed pack across pen and marker categories.', img: imgPack },
  { name:'Nikan Gift Set',     cat:'Gift Sets',    tag:'Gifting',  tip:'Mixed', colours:'Curated',    units:5,   desc:'Curated gift-ready packaging with premium pen selection.', img: imgGift },
];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === 'All' || p.cat === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
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

      {/* ── FILTER BAR ─────────────────────── */}
      <div className="products-filter-bar glass-card-pro" style={{ margin: '2rem 6rem', padding: '1.5rem 2rem', borderBottom: 'none', background: 'rgba(255,255,255,0.8)' }}>
        <div className="products-search" style={{ border: '1px solid var(--border)', background: '#fff' }}>
          <Search size={18} style={{ color: 'var(--gold)' }} />
          <input
            id="product-search"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', fontSize: '0.95rem', width: '220px', fontWeight: '500' }}
          />
        </div>
        <div className="products-cats">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`cat-btn${activeCategory === c ? ' cat-btn--active' : ''}`}
              onClick={() => setActiveCategory(c)}
              style={{ padding: '8px 16px', fontSize: '0.75rem' }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── PRODUCTS GRID ─────────────────────── */}
      <section className="section products-grid-section">
        {filtered.length === 0 ? (
          <div className="products-empty">No products found for "{search}".</div>
        ) : (
          <div className="products-grid">
            {filtered.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.04}>
                <div className="product-card glass-card-pro" style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="product-card-image" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-dim)', marginBottom: '1.5rem', background: '#fff' }}>
                    <img src={p.img} alt={p.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'contain', padding: '1rem' }} />
                  </div>
                  <div className="product-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="label-gold" style={{ margin: 0 }}>{p.tag}</span>
                    <span className="product-card-cat" style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>{p.cat}</span>
                  </div>
                  <div className="product-card-name" style={{ fontFamily: 'DM Serif Display', fontSize: '1.4rem', marginBottom: '0.8rem', color: 'var(--text-primary)' }}>{p.name}</div>
                  <p className="product-card-desc" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem', flexGrow: 1 }}>{p.desc}</p>
                  
                  <div className="product-card-specs" style={{ background: 'var(--bg-secondary)', padding: '1rem 1.2rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid var(--border-dim)' }}>
                    <div className="product-spec" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}><span style={{ color: 'var(--text-muted)' }}>Tip</span><span style={{ fontWeight: '700' }}>{p.tip}</span></div>
                    <div className="product-spec" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}><span style={{ color: 'var(--text-muted)' }}>Colours</span><span style={{ fontWeight: '700' }}>{p.colours}</span></div>
                    <div className="product-spec" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}><span style={{ color: 'var(--text-muted)' }}>Pack Size</span><span style={{ fontWeight: '700' }}>{p.units} Units</span></div>
                  </div>

                  <a href="/contact" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem', padding: '10px' }}>
                    Enquire Now <ArrowRight size={14} style={{ marginLeft: '8px' }}/>
                  </a>
                </div>
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
              <a href="/media" className="btn-primary" style={{ boxShadow: 'var(--shadow-gold)' }}>
                <Download size={18} style={{ marginRight: '8px' }} /> View Downloads
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
