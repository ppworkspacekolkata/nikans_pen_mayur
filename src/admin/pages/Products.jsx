import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, X, Upload, Package, Layers, 
  Image as ImageIcon, Film, Star, Loader2, Trash, 
  Square, CheckSquare, Info, Box, Truck,
  ChevronRight, Sparkles, LayoutDashboard, Database,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubs, setFilteredSubs] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  const [productImages, setProductImages] = useState([]);
  const [packagingImages, setPackagingImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [mainImageIdx, setMainImageIdx] = useState(0);

  const [formData, setFormData] = useState({
    name: '', skuCode: '', category: '', subCategory: '', 
    description: '', material: '', tip: '', ink: '',
    primaryPack: '', middlePacking: '', masterCarton: '', cbm: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (productImages.length === 0) return alert("Product Picture is compulsory!");
    if (packagingImages.length === 0) return alert("Packaging Picture is compulsory!");

    setSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    productImages.forEach(img => data.append('images', img.file));
    packagingImages.forEach(img => data.append('packagingImages', img.file));
    videos.forEach(vid => data.append('videos', vid.file));
    data.append('mainImageIdx', mainImageIdx);

    try {
      const res = await fetch(API_ENDPOINTS.PRODUCTS, { method: 'POST', body: data });
      if (res.ok) {
        setIsModalOpen(false);
        setProductImages([]); setPackagingImages([]); setVideos([]);
        fetchData();
      }
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Product Inventory</h1>
          <p style={subtitleStyle}>Manage and track your premium writing instruments collection.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="premium-btn">
          <Plus size={18} /> Create New Product
        </button>
      </header>

      {/* LUXURY PRODUCT GRID */}
      <div style={listContainer}>
        {fetchLoading ? (
          <div style={{ padding: '100px', textAlign: 'center' }}><Loader2 className="spinning" size={40} color="#d4af37" /></div>
        ) : (
          <div style={gridFlow}>
            {products.map((p, idx) => (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} key={p._id} style={productCard}>
                <div style={imgContainer}>
                  <img src={`${API_BASE_URL}${p.mainImage}`} style={cardImg} alt="" />
                  <div style={cardBadge}>{p.skuCode}</div>
                </div>
                <div style={cardInfo}>
                  <h3 style={cardTitle}>{p.name}</h3>
                  <div style={cardMeta}>
                    <span>{p.category?.name}</span>
                    <ChevronRight size={12} />
                    <span style={{ color: '#d4af37' }}>{p.subCategory?.name}</span>
                  </div>
                  <div style={cardActions}>
                    <button style={actionBtn}><Edit2 size={14} /></button>
                    <button onClick={() => { if(window.confirm('Delete?')) fetch(`${API_ENDPOINTS.PRODUCTS}/${p._id}`, {method:'DELETE'}).then(()=>fetchData()) }} style={{ ...actionBtn, color: '#ef4444' }}><Trash size={14} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
            {products.length === 0 && (
              <div style={emptyState}>
                <Database size={60} color="#cbd5e1" />
                <h3>No entries in inventory</h3>
                <p>Add your first premium product pen to see it here.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div style={modalOverlay}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} style={modalBlur} />
            
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} style={premiumModal}>
              
              {/* MODAL HEADER */}
              <div style={modalHeader}>
                <div style={headerText}>
                  <div style={sparkleIcon}><Sparkles size={16} /></div>
                  <div style={{ textAlign: 'left' }}>
                    <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900' }}>Product Specification</h2>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Configure details for elite catalogue entries</p>
                  </div>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} style={closeBtn}><X size={20} /></button>
              </div>

              <div style={modalBody}>
                <form onSubmit={handleSubmit} style={formGrid}>
                  
                  {/* LEFT: Assets & Tech */}
                  <div style={panelLeft}>
                    
                    {/* PRODUCT IMAGES */}
                    <div style={pCard}>
                      <div style={pHeader}>
                        <span style={pTitle}><ImageIcon size={16} color="#d4af37" /> PRODUCT PICTURES <i style={{ color: '#ff4d4f' }}>*</i></span>
                        <input type="file" multiple hidden ref={productImgRef} onChange={e => handleFileSelect(e, 'product')} accept="image/*" />
                        <button type="button" onClick={() => productImgRef.current.click()} className="small-action-btn">UPLOAD</button>
                      </div>
                      <div style={pGrid}>
                        {productImages.length === 0 && (
                          <div onClick={() => productImgRef.current.click()} style={emptyUpload}>
                            <Upload size={24} color="#94a3b8" />
                            <p>Drop primary product shots</p>
                          </div>
                        )}
                        {productImages.map((img, i) => (
                          <div key={img.id} style={{ ...pImgWrap, border: mainImageIdx === i ? '3px solid #d4af37' : '1px solid #edf2f7' }}>
                            <img src={img.url} style={fullImg} />
                            {mainImageIdx === i && <div style={coverRing}><Star size={10} fill="#000" /></div>}
                            <div style={imgOverlay}>
                              <button type="button" onClick={() => setMainImageIdx(i)} style={iconBtn}><Star size={12} /></button>
                              <button type="button" onClick={() => setProductImages(productImages.filter(x => x.id !== img.id))} style={iconBtn}><Trash size={12} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PACKAGING IMAGES */}
                    <div style={{ ...pCard, background: '#f8fafc' }}>
                      <div style={pHeader}>
                        <span style={pTitle}><Box size={16} color="#16a34a" /> PACKAGING PICTURES <i style={{ color: '#ff4d4f' }}>*</i></span>
                        <input type="file" multiple hidden ref={packageImgRef} onChange={e => handleFileSelect(e, 'package')} accept="image/*" />
                        <button type="button" onClick={() => packageImgRef.current.click()} className="small-action-btn dark">UPLOAD</button>
                      </div>
                      <div style={pGrid}>
                        {packagingImages.map((img) => (
                          <div key={img.id} style={pImgWrap}>
                            <img src={img.url} style={fullImg} />
                            <button type="button" onClick={() => setPackagingImages(packagingImages.filter(x => x.id !== img.id))} style={delBtnFloat}><X size={12} /></button>
                          </div>
                        ))}
                        <div onClick={() => packageImgRef.current.click()} style={emptyUploadMini}>+ Add</div>
                      </div>
                    </div>

                    {/* IMPROVED TECH SPECS */}
                    <div style={pCard}>
                      <h4 style={secTitle}>TECHNICAL SPECIFICATIONS</h4>
                      <div style={premiumInputRow}>
                        <div style={fGroup}><label className="p-label">Material *</label><input required className="p-input" placeholder="Body Material" value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} /></div>
                        <div style={fGroup}><label className="p-label">Tip *</label><input required className="p-input" placeholder="0.7 mm" value={formData.tip} onChange={e => setFormData({...formData, tip: e.target.value})} /></div>
                        <div style={fGroup}><label className="p-label">Ink *</label><input required className="p-input" placeholder="Swiss Ink" value={formData.ink} onChange={e => setFormData({...formData, ink: e.target.value})} /></div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Meta & Packing */}
                  <div style={panelRight}>
                    <div style={eliteCard}>
                      <h4 style={eliteTitle}>ELITE PRODUCT ID</h4>
                      <div style={vStack}>
                        <div style={fGroup}><label style={eliteLabel}>Product Name *</label><input required className="elite-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                        <div style={fGroup}><label style={eliteLabel}>SKU Code *</label><input required className="elite-input" value={formData.skuCode} onChange={e => setFormData({...formData, skuCode: e.target.value})} /></div>
                        <div style={hStack}>
                           <div style={fGroup}><label style={eliteLabel}>Category *</label><select required className="elite-input" value={formData.category} onChange={e => onCategoryChange(e.target.value)}><option value="">Select</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                           <div style={fGroup}><label style={eliteLabel}>Sub-Category *</label><select required className="elite-input" value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})}><option value="">Select</option>{filteredSubs.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}</select></div>
                        </div>
                      </div>
                    </div>

                    <div style={fGroup}><label className="p-label">SKU's Description *</label><textarea required className="p-textarea" placeholder="Detail SKU characteristics..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>

                    <div style={{ ...pCard, background: '#f8fafc' }}>
                      <h4 style={secTitle}>PACKING SPECIFICATIONS</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={fGroup}><label className="p-label">Primary Pack *</label><input required className="p-input" value={formData.primaryPack} onChange={e => setFormData({...formData, primaryPack: e.target.value})} /></div>
                        <div style={fGroup}><label className="p-label">Middle Pack *</label><input required className="p-input" value={formData.middlePacking} onChange={e => setFormData({...formData, middlePacking: e.target.value})} /></div>
                        <div style={fGroup}><label className="p-label">Master Carton *</label><input required className="p-input" value={formData.masterCarton} onChange={e => setFormData({...formData, masterCarton: e.target.value})} /></div>
                        <div style={fGroup}><label className="p-label">CBM (cm3) *</label><input required className="p-input" value={formData.cbm} onChange={e => setFormData({...formData, cbm: e.target.value})} /></div>
                      </div>
                    </div>

                    <button type="submit" disabled={submitting} className="publish-btn">
                      {submitting ? <Loader2 className="spinning" /> : (
                        <div style={btnContent}>
                          <CheckSquare size={18} />
                          <span>PUBLISH TO CATALOGUE</span>
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap');
        * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }
        .premium-btn { background: #1a1f2e; color: #fff; border: none; padding: 14px 28px; border-radius: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.3s; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .premium-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(0,0,0,0.2); }
        .small-action-btn { background: #fff; border: 2px solid #d4af37; color: #d4af37; padding: 6px 14px; border-radius: 10px; font-size: 0.75rem; font-weight: 900; cursor: pointer; }
        .small-action-btn.dark { border-color: #334155; color: #334155; }
        
        /* PREMIUM INPUTS */
        .p-input, .p-textarea { width: 100%; padding: 14px 18px; border: 2px solid #edf2f7; border-radius: 14px; background: #fff; font-weight: 600; font-size: 0.95rem; outline: none; transition: 0.3s; }
        .p-input:focus, .p-textarea:focus { border-color: #d4af37; box-shadow: 0 0 0 4px rgba(212,175,55,0.08); background: #fff; }
        .p-label { font-size: 0.8rem; font-weight: 900; color: #1a1f2e; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .elite-input { width: 100%; padding: 14px 18px; background: #252b3b; border: 2px solid #3d465c; border-radius: 14px; color: #fff; font-weight: 600; outline: none; transition: 0.3s; }
        .elite-input:focus { border-color: #d4af37; background: #2d354a; }
        
        .publish-btn { width: 100%; padding: 22px; background: #1a1f2e; border: none; border-radius: 20px; cursor: pointer; transition: 0.3s; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        .publish-btn:hover { transform: translateY(-5px); box-shadow: 0 25px 50px rgba(0,0,0,0.3); }
        .publish-btn:active { transform: scale(0.98); }
        
        /* SCROLLBAR */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 10px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spinning { animation: spin 0.8s linear infinite; }
      `}} />
    </div>
  );
};

// COMPONENT STYLES
const containerStyle = { minHeight: '100vh', background: '#f3f6f9', padding: '40px' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const titleStyle = { fontSize: '2.4rem', fontWeight: '900', color: '#1a1f2e', margin: 0 };
const subtitleStyle = { color: '#64748b', margin: '5px 0 0' };
const listContainer = { width: '100%' };
const gridFlow = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' };
const productCard = { background: '#fff', borderRadius: '25px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' };
const imgContainer = { position: 'relative', height: '220px', background: '#f8fafc' };
const cardImg = { width: '100%', height: '100%', objectFit: 'cover' };
const cardBadge = { position: 'absolute', bottom: '15px', left: '15px', background: 'rgba(255,255,255,0.9)', padding: '5px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '900', color: '#d4af37' };
const cardInfo = { padding: '20px' };
const cardTitle = { margin: '0 0 10px', fontSize: '1.2rem', fontWeight: '900', color: '#1a1f2e' };
const cardMeta = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', fontWeight: '700' };
const cardActions = { marginTop: '20px', display: 'flex', gap: '10px' };
const actionBtn = { background: '#f8fafc', border: '1px solid #edf2f7', padding: '8px', borderRadius: '10px', cursor: 'pointer', color: '#64748b' };
const emptyState = { gridColumn: '1/-1', textAlign: 'center', padding: '100px', background: '#fff', borderRadius: '30px', border: '2px dashed #e2e8f0' };

const modalOverlay = { position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'center' };
const modalBlur = { position: 'fixed', inset: 0, background: 'rgba(26, 31, 46, 0.85)', backdropFilter: 'blur(10px)' };
const premiumModal = { position: 'absolute', inset: '40px auto 0 auto', width: '95%', maxWidth: '1200px', background: '#fff', borderRadius: '40px 40px 0 0', overflowY: 'auto', boxShadow: '0 -20px 60px rgba(0,0,0,0.5)', zIndex: 10 };

const modalHeader = { padding: '30px 50px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', zIndex: 100 };
const headerText = { display: 'flex', gap: '15px', alignItems: 'center' };
const sparkleIcon = { background: '#d4af37', color: '#000', padding: '10px', borderRadius: '12px' };
const closeBtn = { background: '#f8fafc', border: 'none', padding: '10px', borderRadius: '15px', cursor: 'pointer' };

const modalBody = { padding: '50px' };
const formGrid = { display: 'grid', gridTemplateColumns: '1fr 420px', gap: '50px' };
const panelLeft = { display: 'flex', flexDirection: 'column', gap: '40px' };
const panelRight = { display: 'flex', flexDirection: 'column', gap: '30px' };

const pCard = { padding: '35px', background: '#fff', borderRadius: '30px', border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' };
const pHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' };
const pTitle = { fontSize: '0.85rem', fontWeight: '900', color: '#1a1f2e', display: 'flex', alignItems: 'center', gap: '10px' };
const pGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px' };
const emptyUpload = { gridColumn: '1/-1', height: '130px', border: '2px dashed #cbd5e1', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f8fafc', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '700' };
const emptyUploadMini = { height: '130px', border: '2px dashed #cbd5e1', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', cursor: 'pointer', fontWeight: '800' };
const pImgWrap = { position: 'relative', height: '130px', borderRadius: '20px', overflow: 'hidden' };
const fullImg = { width: '100%', height: '100%', objectFit: 'cover' };
const imgOverlay = { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', opacity: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: '0.3s' };
const iconBtn = { background: '#fff', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' };
const coverRing = { position: 'absolute', top: '8px', left: '8px', background: '#d4af37', padding: '4px', borderRadius: '50%', zIndex: 10 };
const delBtnFloat = { position: 'absolute', top: '8px', right: '8px', background: '#ef4444', color: '#fff', border: 'none', padding: '5px', borderRadius: '50%', cursor: 'pointer' };

const secTitle = { margin: '0 0 25px', fontSize: '1rem', fontWeight: '900', color: '#1a1f2e', borderLeft: '5px solid #d4af37', paddingLeft: '15px' };
const premiumInputRow = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' };

const eliteCard = { background: '#1a1f2e', padding: '40px', borderRadius: '40px', color: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' };
const eliteTitle = { margin: '0 0 30px', fontSize: '0.75rem', color: '#d4af37', letterSpacing: '2.5px', fontWeight: '900' };
const eliteLabel = { fontSize: '0.7rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase' };
const hStack = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const vStack = { display: 'flex', flexDirection: 'column', gap: '25px' };
const fGroup = { display: 'flex', flexDirection: 'column', gap: '8px' };
const btnContent = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#d4af37', fontWeight: '900' };

export default AdminProducts;
