import { useParams, Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, Share2, Download, Info, CheckCircle2, Maximize2, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PRODUCTS } from '../data/products';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] } }),
};

export default function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === id);
  const [selectedImg, setSelectedImg] = useState(product?.img);
  const [isLightbox, setIsLightbox] = useState(false);

  if (!product) {
    return (
      <div className="page-not-found">
        <Navbar />
        <div className="section" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
          <h2>Product Not Found</h2>
          <Link to="/products" className="btn-primary" style={{ marginTop: '2rem' }}>Back to Products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Gallery items (Main + user's provided images)
  const gallery = [product.img, ...(product.gallery || [])];

  return (
    <div className="page-product-detail" style={{ background: '#fff' }}>
      <Navbar />

      <section className="section product-hero" style={{ paddingTop: 'calc(var(--nav-h) + 4rem)', background: 'linear-gradient(180deg, #f8f9fa 0%, #fff 100%)' }}>
        <div className="container" style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 2rem' }}>
          <Link to="/products" className="back-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '600', marginBottom: '3rem', fontSize: '0.9rem' }}>
            <ChevronLeft size={18} /> BACK TO CATALOGUE
          </Link>

          <div className="product-main-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '5rem', alignItems: 'start' }}>
            
            {/* ── LEFT: VISUALS ──────────────── */}
            <div className="product-visuals">
              <motion.div 
                className="main-image-wrap glass-card-pro" 
                style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#fff', border: '1px solid var(--border-dim)', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <img src={selectedImg} alt={product.name} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                <button 
                  onClick={() => setIsLightbox(true)}
                  style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'var(--bg-dark-pro)', color: '#fff', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)' }}
                >
                  <Maximize2 size={20} />
                </button>
              </motion.div>

              <div className="gallery-thumbs" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                {gallery.map((img, i) => (
                  <motion.div 
                    key={i}
                    className={`thumb-item ${selectedImg === img ? 'thumb-active' : ''}`}
                    onClick={() => setSelectedImg(img)}
                    style={{ 
                      flex: '0 0 80px', height: '80px', borderRadius: '8px', border: selectedImg === img ? '2px solid var(--gold)' : '1px solid var(--border-dim)', 
                      cursor: 'pointer', overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' 
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={img} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: CONTENT ─────────────── */}
            <div className="product-info-panel">
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
                <span className="label-gold">{product.tag}</span>
                <h1 className="serif" style={{ fontSize: '3.5rem', margin: '1rem 0', color: 'var(--text-primary)' }}>{product.name}</h1>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                  {product.details || product.desc}
                </p>

                <div className="specs-grid-detail" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                  <div className="spec-item-box" style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '12px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Technical Tip</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>{product.tip}</div>
                  </div>
                  <div className="spec-item-box" style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '12px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Ink Colours</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>{product.colours}</div>
                  </div>
                  <div className="spec-item-box" style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '12px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Pack Standard</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>{product.units} Units</div>
                  </div>
                  <div className="spec-item-box" style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '12px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Category</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>{product.cat}</div>
                  </div>
                </div>

                <div className="action-buttons-wrap" style={{ display: 'flex', gap: '1rem' }}>
                  <a href="/contact" className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '18px' }}>
                    Send Enquiry <ArrowRight size={20} style={{ marginLeft: '10px' }} />
                  </a>
                  <button className="btn-outline" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Share2 size={20} />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BROCHURE / TECHNICAL DATA ─────── */}
      <section className="section brochure-section" style={{ padding: '8rem 0', background: '#fff' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span className="label">Technical Data</span>
            <h2 className="section-title">Product <em>Specifications</em></h2>
          </div>

          <div className="brochure-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '5rem', alignItems: 'center' }}>
            <div className="brochure-text">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                   <CheckCircle2 size={32} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                   <div>
                      <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>International Standards</h4>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Manufactured in an ISO 9001:2015 certified facility ensuring consistent quality for global distributors.</p>
                   </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                   <CheckCircle2 size={32} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                   <div>
                      <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Bulk Supply Optimization</h4>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Standardized master carton packaging designed for shipping durability and efficient inventory management.</p>
                   </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                   <CheckCircle2 size={32} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                   <div>
                      <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Custom Branding Available</h4>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>OEM/ODM services available for large-scale importers needing tailored branding and packaging.</p>
                   </div>
                </div>
              </div>
              <div style={{ marginTop: '4rem' }}>
                 <a href="/media" className="btn-primary">
                    <Download size={20} style={{ marginRight: '10px' }} /> Download Brochure
                 </a>
              </div>
            </div>
            
            <div className="brochure-visual" style={{ position: 'relative' }}>
              <div className="brochure-img-container glass-card-pro" style={{ transform: 'rotate(-2deg)', overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--border-dim)', boxShadow: 'var(--shadow-lg)' }}>
                 <img src={product.brochure || product.img} alt="Brochure" style={{ width: '100%', height: 'auto' }} />
              </div>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'var(--gold)', color: '#000', padding: '15px', borderRadius: '50%', fontWeight: '800', transform: 'rotate(15deg)', boxShadow: 'var(--shadow-md)' }}>CERTIFIED</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX OVERLAY ──────────────── */}
      <AnimatePresence>
        {isLightbox && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
            onClick={() => setIsLightbox(false)}
          >
            <button 
              onClick={() => setIsLightbox(false)}
              style={{ position: 'absolute', top: '30px', right: '30px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <X size={40} />
            </button>
            <motion.img 
              src={selectedImg} 
              alt="Full Size"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
