import { useParams, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, Share2, Download, Package, Settings, Truck, Maximize2, X, PlayCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] } }),
};

export default function ProductDetail() {
  const { id: slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isLightbox, setIsLightbox] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' or 'packing'

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_ENDPOINTS.PRODUCTS}/${slug}`);
        const data = await res.json();
        setProduct(data);
        setSelectedImg(data.mainImage);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="loading-state">
        <Navbar />
        <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loader-gold"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product || product.message) {
    return (
      <div className="page-not-found">
        <Navbar />
        <div className="section" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '900' }}>Product Not Found</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>The document you are looking for might have been moved or archived.</p>
          <Link to="/products" className="btn-primary" style={{ marginTop: '2rem' }}>Return to Catalogue</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const getImgUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  };

  const productGallery = Array.from(new Set([product.mainImage, ...(product.images || [])])).filter(Boolean);
  const packagingGallery = (product.packagingImages || []).filter(Boolean);

  return (
    <div className="page-product-detail" style={{ background: '#fff' }}>
      <Navbar />

      <section className="section product-hero" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
        <div className="container" style={{ maxWidth: '1400px' }}>
          
          <div style={{ marginBottom: '30px' }}>
            <Link to="/products" style={backLinkStyle}>
              <ChevronLeft size={16} /> BACK TO COLLECTION
            </Link>
          </div>

          <div className="product-main-grid" style={mainGridStyle}>
            
            {/* LEFT: VISUAL GALLERY */}
            <div className="product-gallery-side">
              <motion.div 
                className="main-preview glass-card-pro" 
                style={mainPreviewStyle}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <img src={getImgUrl(selectedImg)} alt={product.name} style={mainImgStyle} />
                <button onClick={() => setIsLightbox(true)} style={maximizeBtn}>
                  <Maximize2 size={20} />
                </button>
              </motion.div>

              <div style={thumbGridStyle}>
                <div style={thumbSectionLabel}>PRODUCT ASSETS</div>
                <div style={thumbRow}>
                  {productGallery.map((img, i) => (
                    <div 
                      key={i} 
                      style={thumbItemStyle(selectedImg === img)}
                      onClick={() => setSelectedImg(img)}
                    >
                      <img src={getImgUrl(img)} alt="thumb" style={thumbImgInner} />
                    </div>
                  ))}
                </div>

                {packagingGallery.length > 0 && (
                  <>
                    <div style={thumbSectionLabel}>PACKAGING ASSETS</div>
                    <div style={thumbRow}>
                      {packagingGallery.map((img, i) => (
                        <div 
                          key={i} 
                          style={thumbItemStyle(selectedImg === img)}
                          onClick={() => setSelectedImg(img)}
                        >
                          <img src={getImgUrl(img)} alt="thumb" style={thumbImgInner} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT: DETAILED INFO */}
            <div className="product-info-side" style={{ paddingLeft: '40px' }}>
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                <div style={categoryBadge}>{product.category?.name?.toUpperCase() || 'GENERAL'}</div>
                <h1 style={titleStyle}>{product.name}</h1>
                <div style={skuStyle}>SKU: <span>{product.skuCode}</span></div>
                
                <p style={descStyle}>{product.description}</p>

                {/* TABS FOR SPECS */}
                <div style={tabHeader}>
                  <button 
                    style={activeTab === 'specs' ? activeTabBtn : inactiveTabBtn}
                    onClick={() => setActiveTab('specs')}
                  >
                    <Settings size={16} /> TECHNICAL SPECS
                  </button>
                  <button 
                    style={activeTab === 'packing' ? activeTabBtn : inactiveTabBtn}
                    onClick={() => setActiveTab('packing')}
                  >
                    <Truck size={16} /> PACKING & LOGISTICS
                  </button>
                </div>

                <div style={tabContent}>
                  {activeTab === 'specs' ? (
                    <div style={specsTable}>
                      <div style={specRow}><span style={specKey}>Material</span><span style={specVal}>{product.material}</span></div>
                      <div style={specRow}><span style={specKey}>Writing Tip</span><span style={specVal}>{product.tip}</span></div>
                      <div style={specRow}><span style={specKey}>Ink Type</span><span style={specVal}>{product.ink}</span></div>
                    </div>
                  ) : (
                    <div style={specsTable}>
                      <div style={specRow}><span style={specKey}>Primary Pack</span><span style={specVal}>{product.primaryPack}</span></div>
                      <div style={specRow}><span style={specKey}>Middle Packing</span><span style={specVal}>{product.middlePacking}</span></div>
                      <div style={specRow}><span style={specKey}>Master Carton</span><span style={specVal}>{product.masterCarton}</span></div>
                      <div style={specRow}><span style={specKey}>CBM Capacity</span><span style={specVal} className="text-gold">{product.cbm} cm³</span></div>
                    </div>
                  )}
                </div>

                <div style={actionsContainer}>
                  <button onClick={() => setIsContactOpen(true)} style={enquiryBtn}>
                    SEND BULK ENQUIRY <ArrowRight size={18} />
                  </button>
                  <button style={shareBtn}><Share2 size={20} /></button>
                </div>

                <div style={isoBadge}>
                  <CheckCircle size={16} color="var(--gold)" />
                  ISO 9001:2015 CERTIFIED MANUFACTURING
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {isLightbox && createPortal(
        <motion.div 
          style={lightboxOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsLightbox(false)}
        >
          <button style={closeBtn} onClick={() => setIsLightbox(false)}><X size={40} /></button>
          <motion.img 
            src={getImgUrl(selectedImg)} 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            style={lightboxImgStyle}
            onClick={e => e.stopPropagation()}
          />
        </motion.div>,
        document.body
      )}

      <Footer />
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
        productContext={`${product.name} (SKU: ${product.skuCode})`}
      />
    </div>
  );
}

// STYLES
const backLinkStyle = { color: '#64748b', fontSize: '0.8rem', fontWeight: '800', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '1px' };
const mainGridStyle = { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'start' };
const mainPreviewStyle = { position: 'relative', background: '#fff', borderRadius: '24px', padding: '40px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px' };
const mainImgStyle = { width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain' };
const maximizeBtn = { position: 'absolute', top: '20px', right: '20px', background: '#f1f5f9', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer' };
const thumbGridStyle = { marginTop: '20px' };
const thumbSectionLabel = { fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px', marginBottom: '10px' };
const thumbRow = { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' };
const thumbItemStyle = (active) => ({ width: '70px', height: '70px', borderRadius: '12px', border: active ? '2px solid var(--gold)' : '1px solid #e2e8f0', padding: '8px', cursor: 'pointer', background: '#fff', transition: '0.2s' });
const thumbImgInner = { width: '100%', height: '100%', objectFit: 'contain' };
const categoryBadge = { background: 'var(--gold)', color: '#000', padding: '6px 12px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '900', display: 'inline-block', letterSpacing: '1px' };
const titleStyle = { fontSize: '3rem', fontFamily: 'var(--serif)', fontWeight: '900', color: '#1a1f2e', margin: '15px 0 5px 0' };
const skuStyle = { fontSize: '0.9rem', color: '#64748b', fontWeight: '700', marginBottom: '25px' };
const descStyle = { fontSize: '1rem', color: '#475569', lineHeight: '1.7', marginBottom: '35px' };
const tabHeader = { display: 'flex', gap: '10px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' };
const activeTabBtn = { padding: '12px 20px', background: 'none', border: 'none', borderBottom: '2px solid #000', fontSize: '0.8rem', fontWeight: '900', color: '#000', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' };
const inactiveTabBtn = { padding: '12px 20px', background: 'none', border: 'none', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' };
const tabContent = { minHeight: '180px' };
const specsTable = { display: 'flex', flexDirection: 'column', gap: '1px', background: '#f1f5f9', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f1f5f9' };
const specRow = { display: 'flex', justifyContent: 'space-between', padding: '15px 20px', background: '#fff' };
const specKey = { fontSize: '0.85rem', color: '#64748b', fontWeight: '600' };
const specVal = { fontSize: '0.85rem', color: '#1a1f2e', fontWeight: '800' };
const actionsContainer = { display: 'flex', gap: '15px', marginTop: '40px' };
const enquiryBtn = { flexGrow: 1, background: '#000', color: '#fff', border: 'none', padding: '20px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '800', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: '0.3s' };
const shareBtn = { width: '64px', height: '64px', background: '#fff', border: '2px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
const isoBadge = { marginTop: '30px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8' };
const lightboxOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.92)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'zoom-out' };
const closeBtn = { position: 'absolute', top: '30px', right: '30px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' };
const lightboxImgStyle = { maxWidth: '85%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '12px' };

function CheckCircle({ size, color }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
}
