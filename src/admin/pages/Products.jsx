import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, X, Upload, Package, Layers, 
  Image as ImageIcon, Film, Star, Loader2, Trash, 
  Square, CheckSquare, Info, Box, Truck,
  ChevronRight, Sparkles, LayoutDashboard, Database,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL, { API_ENDPOINTS, getImageUrl } from '../../config/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubs, setFilteredSubs] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  const [productImages, setProductImages] = useState([]);
  const [packagingImages, setPackagingImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [mainImageIdx, setMainImageIdx] = useState(0);

  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', skuCode: '', category: '', subCategory: '', 
    description: '', material: '', tip: '', ink: '',
    primaryPack: '', middlePacking: '', masterCarton: '', cbm: '',
    isActive: true
  });

  const productImgRef = useRef(null);
  const packageImgRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [pRes, cRes, sRes] = await Promise.all([
        fetch(API_ENDPOINTS.PRODUCTS),
        fetch(API_ENDPOINTS.CATEGORIES),
        fetch(API_ENDPOINTS.SUB_CATEGORIES)
      ]);
      setProducts(await pRes.json());
      setCategories(await cRes.json());
      setSubCategories(await sRes.json());
      setFetchLoading(false);
    } catch (err) { console.error(err); setFetchLoading(false); }
  };

  const onCategoryChange = (catId) => {
    setFormData(prev => ({ ...prev, category: catId, subCategory: '' }));
    setFilteredSubs(subCategories.filter(s => (s.category?._id || s.category) === catId));
  };

  const handleFileSelect = (e, target) => {
    const files = Array.from(e.target.files);
    const mapped = files.map(file => ({ file, url: URL.createObjectURL(file), id: Math.random().toString(36).substr(2, 9) }));
    if (target === 'product') setProductImages(prev => [...prev, ...mapped]);
    if (target === 'package') setPackagingImages(prev => [...prev, ...mapped]);
    if (target === 'video') setVideos(prev => [...prev, ...mapped]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    productImages.filter(img => !img.isExisting).forEach(img => data.append('images', img.file));
    packagingImages.filter(img => !img.isExisting).forEach(img => data.append('packagingImages', img.file));
    videos.filter(vid => !vid.isExisting).forEach(vid => data.append('videos', vid.file));
    const existingImgs = productImages.filter(img => img.isExisting).map(img => img.path);
    const existingPkg = packagingImages.filter(img => img.isExisting).map(img => img.path);
    const existingVids = videos.filter(vid => vid.isExisting).map(vid => vid.path);
    data.append('existingImages', JSON.stringify(existingImgs));
    data.append('existingPackagingImages', JSON.stringify(existingPkg));
    data.append('existingVideos', JSON.stringify(existingVids));
    data.append('mainImageIdx', mainImageIdx);
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct ? `${API_ENDPOINTS.PRODUCTS}/${editingProduct._id}` : API_ENDPOINTS.PRODUCTS;
    try {
      const res = await fetch(url, { method, body: data });
      if (res.ok) { setIsModalOpen(false); setEditingProduct(null); resetForm(); fetchData(); }
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const resetForm = () => {
    setFormData({ name: '', skuCode: '', category: '', subCategory: '', description: '', material: '', tip: '', ink: '', primaryPack: '', middlePacking: '', masterCarton: '', cbm: '', isActive: true });
    setProductImages([]); setPackagingImages([]); setVideos([]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const openEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name, skuCode: p.skuCode, category: p.category?._id || p.category, subCategory: p.subCategory?._id || p.subCategory,
      description: p.description, material: p.material, tip: p.tip, ink: p.ink, primaryPack: p.primaryPack, middlePacking: p.middlePacking, masterCarton: p.masterCarton, cbm: p.cbm, isActive: p.isActive
    });
    const existingImgs = (p.images || []).map(img => ({ id: img, url: getImageUrl(img), isExisting: true, path: img }));
    setProductImages(existingImgs);
    const existingPkg = (p.packagingImages || []).map(img => ({ id: img, url: getImageUrl(img), isExisting: true, path: img }));
    setPackagingImages(existingPkg);
    const existingVids = (p.videos || []).map(vid => ({ id: vid, url: getImageUrl(vid), isExisting: true, path: vid }));
    setVideos(existingVids);
    const mIdx = (p.images || []).indexOf(p.mainImage);
    setMainImageIdx(mIdx >= 0 ? mIdx : 0);
    setFilteredSubs(subCategories.filter(s => (s.category?._id || s.category) === (p.category?._id || p.category)));
    setIsModalOpen(true);
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div><h1 style={titleStyle}>Inventory</h1><p style={subtitleStyle}>Manage collection.</p></div>
        <button onClick={() => { setEditingProduct(null); resetForm(); setIsModalOpen(true); }} className="premium-btn"><Plus size={18} /> New Product</button>
      </header>

      <div style={listContainer}>
        {fetchLoading ? (
          <div style={{ padding: '100px', textAlign: 'center' }}><Loader2 className="spinning" size={40} color="#d4af37" /></div>
        ) : (
          <div style={gridFlow}>
            {products.map((p, idx) => (
              <motion.div key={p._id} style={{ ...productCard, cursor: 'pointer' }} onClick={() => { setSelectedProduct(p); setIsDetailModalOpen(true); }}>
                <div style={imgContainer}><img src={getImageUrl(p.mainImage)} style={cardImg} alt="" /><div style={cardBadge}>{p.skuCode}</div></div>
                <div style={cardInfo}><h3 style={cardTitle}>{p.name}</h3>
                  <div style={cardActions} onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => openEdit(p)} style={actionBtn}><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(p._id)} style={{ ...actionBtn, color: '#ef4444' }}><Trash size={14} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* DETAILED VIEW MODAL - COMPACT UI */}
      <AnimatePresence>
        {isDetailModalOpen && selectedProduct && (
          <div style={modalOverlay}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDetailModalOpen(false)} style={modalBlur} />
            <motion.div initial={{ scale: 0.98, y: 20 }} animate={{ scale: 1, y: 0 }} style={compactModal}>
               <div style={modalHeaderCompact}>
                 <div style={headerText}>
                   <div style={sparkleIcon}><Package size={18} /></div>
                   <div><h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900' }}>{selectedProduct.name}</h2><p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>Technical & Packing Specs</p></div>
                 </div>
                 <button onClick={() => setIsDetailModalOpen(false)} style={closeBtnSmall}><X size={20} /></button>
               </div>
               
               <div style={{ padding: '25px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                     <div>
                        <h4 style={miniSecTitle}>PRODUCT GALLERY</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                           {selectedProduct.images?.map((img, i) => (
                             <div key={i} style={galleryItem}><img src={getImageUrl(img)} style={fullImg} /></div>
                           ))}
                        </div>
                     </div>
                     <div>
                        <h4 style={miniSecTitle}>PACKAGING ASSETS</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                           {selectedProduct.packagingImages?.map((img, i) => (
                             <div key={i} style={galleryItemMini}><img src={getImageUrl(img)} style={fullImg} /></div>
                           ))}
                           {(!selectedProduct.packagingImages || selectedProduct.packagingImages.length === 0) && <span style={noDataText}>No assets.</span>}
                        </div>
                     </div>
                     <div>
                        <h4 style={miniSecTitle}>OVERVIEW</h4>
                        <p style={descText}>{selectedProduct.description || 'No description available.'}</p>
                     </div>
                  </div>
                  
                  <div style={specSidebar}>
                     <div style={specGroup}>
                        <h4 style={specLabel}>TECHNICAL SPECIFICATIONS</h4>
                        <div style={specItemRow}><span>Material</span><strong>{selectedProduct.material}</strong></div>
                        <div style={specItemRow}><span>Tip</span><strong>{selectedProduct.tip}</strong></div>
                        <div style={specItemRow}><span>Ink</span><strong>{selectedProduct.ink}</strong></div>
                     </div>
                     <div style={{ ...specGroup, marginTop: '25px' }}>
                        <h4 style={specLabel}>PACKING DETAILS</h4>
                        <div style={specItemRow}><span>Primary</span><strong>{selectedProduct.primaryPack}</strong></div>
                        <div style={specItemRow}><span>Middle</span><strong>{selectedProduct.middlePacking}</strong></div>
                        <div style={specItemRow}><span>Master</span><strong>{selectedProduct.masterCarton}</strong></div>
                        <div style={specItemRow}><span>CBM</span><strong>{selectedProduct.cbm}</strong></div>
                     </div>
                     <div style={{ marginTop: '25px', padding: '15px', background: '#fffbeb', borderRadius: '15px', border: '1px solid #fef3c7' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: '900', color: '#b45309', marginBottom: '5px' }}>SKU IDENTIFIER</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1a1f2e' }}>{selectedProduct.skuCode}</div>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE/EDIT MODAL (SAME AS BEFORE) */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={modalOverlay}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} style={modalBlur} />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={premiumModal}>
              <div style={modalHeaderCompact}><div style={headerText}><div style={sparkleIcon}><Sparkles size={18} /></div><h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900' }}>{editingProduct ? 'Edit Product' : 'New Product'}</h2></div><button onClick={() => setIsModalOpen(false)} style={closeBtnSmall}><X size={20} /></button></div>
              <form onSubmit={handleSave} style={{ padding: '25px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={formCard}>
                      <div style={fRow}><span>Main Images</span><button type="button" onClick={() => productImgRef.current.click()} style={uBtn}>Add</button></div>
                      <input type="file" multiple hidden ref={productImgRef} onChange={e => handleFileSelect(e, 'product')} />
                      <div style={miniGrid}>{productImages.map((img, i) => <div key={img.id} style={{ ...miniThumb, border: mainImageIdx===i ? '2px solid #d4af37' : '1px solid #eee' }} onClick={() => setMainImageIdx(i)}><img src={img.url} style={fullImg} /></div>)}</div>
                    </div>
                    <div style={formCard}>
                      <div style={fRow}><span>Packaging</span><button type="button" onClick={() => packageImgRef.current.click()} style={uBtn}>Add</button></div>
                      <input type="file" multiple hidden ref={packageImgRef} onChange={e => handleFileSelect(e, 'package')} />
                      <div style={miniGrid}>{packagingImages.map((img) => <div key={img.id} style={miniThumb}><img src={img.url} style={fullImg} /></div>)}</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                       <div style={fGrp}><label style={fLab}>Material</label><input className="i-box" value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} /></div>
                       <div style={fGrp}><label style={fLab}>Tip</label><input className="i-box" value={formData.tip} onChange={e => setFormData({...formData, tip: e.target.value})} /></div>
                       <div style={fGrp}><label style={fLab}>Ink</label><input className="i-box" value={formData.ink} onChange={e => setFormData({...formData, ink: e.target.value})} /></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                       <div style={fGrp}><label style={fLab}>Primary Pack</label><input className="i-box" value={formData.primaryPack} onChange={e => setFormData({...formData, primaryPack: e.target.value})} /></div>
                       <div style={fGrp}><label style={fLab}>Middle Packing</label><input className="i-box" value={formData.middlePacking} onChange={e => setFormData({...formData, middlePacking: e.target.value})} /></div>
                       <div style={fGrp}><label style={fLab}>Master Carton</label><input className="i-box" value={formData.masterCarton} onChange={e => setFormData({...formData, masterCarton: e.target.value})} /></div>
                       <div style={fGrp}><label style={fLab}>CBM (cm³)</label><input className="i-box" value={formData.cbm} onChange={e => setFormData({...formData, cbm: e.target.value})} /></div>
                    </div>

                    <div style={fGrp}>
                      <label style={fLab}>Description</label>
                      <textarea className="i-box" style={{ minHeight: '80px' }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <div style={{ background: '#1a1f2e', padding: '20px', borderRadius: '20px', color: '#fff' }}>
                       <div style={fGrp}><label style={fLabDark}>Name *</label><input required className="i-box-dark" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                       <div style={fGrp}><label style={fLabDark}>SKU *</label><input required className="i-box-dark" value={formData.skuCode} onChange={e => setFormData({...formData, skuCode: e.target.value})} /></div>
                       <div style={fGrp}><label style={fLabDark}>Category</label><select className="i-box-dark" value={formData.category} onChange={e => onCategoryChange(e.target.value)}><option value="">Select Category</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                       <div style={fGrp}><label style={fLabDark}>Sub-Category</label><select className="i-box-dark" value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})}><option value="">Select Sub-Category</option>{filteredSubs.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}</select></div>
                    </div>
                    <button type="submit" disabled={submitting} style={saveBtnBig}>{submitting ? 'Saving...' : 'Publish Product'}</button>
                  </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap');
        * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }
        .premium-btn { background: #1a1f2e; color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .i-box { width: 100%; padding: 10px; border: 2px solid #edf2f7; border-radius: 10px; font-weight: 600; outline: none; }
        .i-box-dark { width: 100%; padding: 10px; background: #2d354a; border: 2px solid #3d465c; border-radius: 10px; color: #fff; outline: none; margin-bottom: 15px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spinning { animation: spin 0.8s linear infinite; }
      `}} />
    </div>
  );
};

// COMPACT STYLES
const containerStyle = { minHeight: '100vh', background: '#f8fafc', padding: '30px' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' };
const titleStyle = { fontSize: '2rem', fontWeight: '900', color: '#1a1f2e', margin: 0 };
const subtitleStyle = { color: '#94a3b8', margin: 0, fontSize: '0.85rem' };
const listContainer = { width: '100%' };
const gridFlow = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' };
const productCard = { background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' };
const imgContainer = { position: 'relative', height: '180px', background: '#f8fafc' };
const cardImg = { width: '100%', height: '100%', objectFit: 'cover' };
const cardBadge = { position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '900', color: '#d4af37' };
const cardInfo = { padding: '15px' };
const cardTitle = { margin: '0 0 10px', fontSize: '1rem', fontWeight: '800' };
const cardActions = { display: 'flex', gap: '8px' };
const actionBtn = { background: '#f8fafc', border: '1px solid #edf2f7', padding: '6px', borderRadius: '8px', cursor: 'pointer' };

const modalOverlay = { position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modalBlur = { position: 'fixed', inset: 0, background: 'rgba(26, 31, 46, 0.8)', backdropFilter: 'blur(8px)' };
const compactModal = { position: 'relative', width: '90%', maxWidth: '900px', background: '#fff', borderRadius: '25px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' };
const premiumModal = { position: 'relative', width: '95%', maxWidth: '1000px', background: '#fff', borderRadius: '25px', overflow: 'hidden' };

const modalHeaderCompact = { padding: '20px 25px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const sparkleIcon = { background: '#d4af37', color: '#000', padding: '8px', borderRadius: '10px' };
const headerText = { display: 'flex', gap: '12px', alignItems: 'center' };
const closeBtnSmall = { background: '#f8fafc', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer' };

const miniSecTitle = { fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' };
const galleryItem = { height: '140px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f1f5f9' };
const galleryItemMini = { height: '80px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #f1f5f9' };
const fullImg = { width: '100%', height: '100%', objectFit: 'cover' };
const descText = { fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', background: '#f8fafc', padding: '15px', borderRadius: '15px' };
const noDataText = { fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' };

const specSidebar = { background: '#f8fafc', padding: '25px', borderRadius: '20px', border: '1px solid #f1f5f9' };
const specGroup = { width: '100%' };
const specLabel = { fontSize: '0.75rem', fontWeight: '900', color: '#1a1f2e', marginBottom: '15px', display: 'block' };
const specItemRow = { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px', marginBottom: '8px' };

const formCard = { background: '#f8fafc', padding: '15px', borderRadius: '15px', border: '1px solid #edf2f7' };
const fRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '0.8rem', fontWeight: '800' };
const uBtn = { background: '#d4af37', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '900', cursor: 'pointer' };
const miniGrid = { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' };
const miniThumb = { height: '50px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' };
const fGrp = { display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px' };
const fLab = { fontSize: '0.7rem', fontWeight: '800', color: '#64748b' };
const fLabDark = { fontSize: '0.7rem', fontWeight: '800', color: 'rgba(255,255,255,0.5)' };
const saveBtnBig = { width: '100%', padding: '15px', background: '#d4af37', border: 'none', borderRadius: '15px', color: '#000', fontWeight: '900', cursor: 'pointer', marginTop: '10px' };

export default AdminProducts;
