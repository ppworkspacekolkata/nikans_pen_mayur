import { useParams, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, Share2, Download, Info, CheckCircle2, Maximize2, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
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
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isLightbox) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLightbox]);

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
    <div className="page-product-detail">
      <Navbar />

      <section className="section product-hero">
        <div className="container product-detail-container">
          <Link to="/products" className="back-link">
            <ChevronLeft size={18} /> BACK TO CATALOGUE
          </Link>

          <div className="product-main-grid">
            
            {/* ── LEFT: VISUALS ──────────────── */}
            <div className="product-visuals">
              <motion.div 
                className="main-image-wrap glass-card-pro" 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <img src={selectedImg} alt={product.name} className="product-main-img-display" />
                <button 
                  onClick={() => setIsLightbox(true)}
                  className="lightbox-trigger"
                >
                  <Maximize2 size={20} />
                </button>
              </motion.div>

              <div className="gallery-thumbs">
                {gallery.map((img, i) => (
                  <motion.div 
                    key={i}
                    className={`thumb-item ${selectedImg === img ? 'thumb-active' : ''}`}
                    onClick={() => setSelectedImg(img)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={img} alt="Thumb" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: CONTENT ─────────────── */}
            <div className="product-info-panel">
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
                <span className="label-gold">{product.tag}</span>
                <h1 className="serif product-detail-title">{product.name}</h1>
                <p className="product-detail-description">
                  {product.details || product.desc}
                </p>

                <div className="specs-grid-detail">
                  <div className="spec-item-box">
                    <div className="spec-label">Technical Tip</div>
                    <div className="spec-value">{product.tip}</div>
                  </div>
                  <div className="spec-item-box">
                    <div className="spec-label">Ink Colours</div>
                    <div className="spec-value">{product.colours}</div>
                  </div>
                  <div className="spec-item-box">
                    <div className="spec-label">Pack Standard</div>
                    <div className="spec-value">{product.units} Units</div>
                  </div>
                  <div className="spec-item-box">
                    <div className="spec-label">Category</div>
                    <div className="spec-value">{product.cat}</div>
                  </div>
                </div>

                 <div className="action-buttons-wrap">
                   <button 
                     onClick={() => setIsContactOpen(true)}
                     className="btn-primary product-enquiry-btn"
                     style={{ cursor: 'pointer', border: 'none' }}
                   >
                     Send Enquiry <ArrowRight size={20} style={{ marginLeft: '10px' }} />
                   </button>
                   <button className="btn-outline product-share-btn">
                     <Share2 size={20} />
                   </button>
                 </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BROCHURE / TECHNICAL DATA ─────── */}
      <section className="section brochure-section">
        <div className="container brochure-container">
          <div className="section-header">
            <span className="label">Technical Data</span>
            <h2 className="section-title">Product <em>Specifications</em></h2>
          </div>

          <div className="brochure-layout" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
            <div className="brochure-text">
              <div className="brochure-features-list">
                <div className="brochure-feature">
                   <CheckCircle2 size={32} className="feature-icon" />
                   <div>
                      <h4>International Standards</h4>
                      <p>Manufactured in an ISO 9001:2015 certified facility ensuring consistent quality for global distributors.</p>
                   </div>
                </div>
                <div className="brochure-feature">
                   <CheckCircle2 size={32} className="feature-icon" />
                   <div>
                      <h4>Bulk Supply Optimization</h4>
                      <p>Standardized master carton packaging designed for shipping durability and efficient inventory management.</p>
                   </div>
                </div>
                <div className="brochure-feature">
                   <CheckCircle2 size={32} className="feature-icon" />
                   <div>
                      <h4>Custom Branding Available</h4>
                      <p>OEM/ODM services available for large-scale importers needing tailored branding and packaging.</p>
                   </div>
                </div>
              </div>
              <div className="brochure-cta-wrap">
                 <a 
                   href="/product/NiKan%20Catalogue%20Oct%2025.pdf" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="btn-primary"
                 >
                    <Download size={20} style={{ marginRight: '10px' }} /> Download Brochure
                 </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX OVERLAY (PORTAL) ──────── */}
      {createPortal(
        <AnimatePresence>
          {isLightbox && (
            <motion.div 
              className="lightbox-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLightbox(false)}
            >
              <button 
                onClick={() => setIsLightbox(false)}
                className="lightbox-close"
              >
                <X size={40} />
              </button>
              <motion.img 
                src={selectedImg} 
                alt="Full Size"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="lightbox-img"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <Footer />
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
        productContext={product?.name}
      />
    </div>
  );
}
