import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, 
  Layers, Package, CheckCircle, XCircle,
  X, Upload, AlertCircle, Loader2,
  ChevronRight, ArrowLeft, Eye, EyeOff,
  Boxes, LayoutGrid, Info, CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const AdminCategories = () => {
  const [currentView, setCurrentView] = useState('categories'); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [formData, setFormData] = useState({ name: '', description: '', isActive: true, category: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cRes, sRes, pRes] = await Promise.all([
        fetch(API_ENDPOINTS.CATEGORIES),
        fetch(API_ENDPOINTS.SUB_CATEGORIES),
        fetch(API_ENDPOINTS.PRODUCTS)
      ]);
      setCategories(await cRes.json());
      setSubCategories(await sRes.json());
      setProducts(await pRes.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getSubCatCount = (catId) => subCategories.filter(s => (s.category?._id || s.category) === catId).length;
  const getProdCountBySub = (subId) => products.filter(p => (p.subCategory?._id || p.subCategory) === subId).length;
  const getProdCountByCat = (catId) => products.filter(p => (p.category?._id || p.category) === catId).length;

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const type = currentView === 'categories' ? 'categories' : 'subcategories';
    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `${API_BASE_URL}/api/${type}/${editingItem._id}` : `${API_BASE_URL}/api/${type}`;
    
    const payload = { ...formData };
    if (type === 'subcategories' && !payload.category) {
      payload.category = selectedCategory?._id;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({ name: '', description: '', isActive: true, category: '' });
        fetchData();
      }
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure? This will delete all associated data.')) return;
    const endpoint = type === 'category' ? `categories/${id}` : `subcategories/${id}`;
    try {
      await fetch(`${API_BASE_URL}/api/${endpoint}`, { method: 'DELETE' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({ 
      name: item.name, 
      description: item.description || '', 
      isActive: item.isActive,
      category: item.category?._id || item.category || ''
    });
    setIsModalOpen(true);
  };

  const toggleStatus = async (type, id, currentStatus) => {
    const endpoint = type === 'category' ? `categories/${id}` : `subcategories/${id}`;
    try {
      await fetch(`${API_BASE_URL}/api/${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const navigateBack = () => {
    if (currentView === 'products') {
      setCurrentView('subcategories');
      setSelectedSubCategory(null);
    } else if (currentView === 'subcategories') {
      setCurrentView('categories');
      setSelectedCategory(null);
    }
  };

  return (
    <div style={containerStyle}>
      {/* HEADER SECTION */}
      <div style={headerStyle}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {currentView !== 'categories' && (
              <button onClick={navigateBack} style={backBtn}><ArrowLeft size={20} /></button>
            )}
            <h1 style={titleStyle}>
              {currentView === 'categories' ? 'Master Categories' : 
               currentView === 'subcategories' ? `${selectedCategory?.name}` : 
               `${selectedSubCategory?.name}`}
            </h1>
          </div>
          <div style={breadcrumbStyle}>
             <button onClick={() => { setCurrentView('categories'); setSelectedCategory(null); }} style={breadBtn}>Library</button>
             {selectedCategory && (
               <> <ChevronRight size={14} /> <button onClick={() => setCurrentView('subcategories')} style={{ ...breadBtn, color: currentView === 'subcategories' ? '#1e293b' : '#94a3b8' }}>{selectedCategory.name}</button> </>
             )}
             {selectedSubCategory && (
               <> <ChevronRight size={14} /> <span style={{ ...breadBtn, color: '#1e293b' }}>{selectedSubCategory.name}</span> </>
             )}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={searchWrap}>
            <Search size={18} color="#94a3b8" />
            <input style={searchIn} placeholder="Filter records..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <button onClick={() => { setEditingItem(null); setFormData({ name: '', description: '', isActive: true }); setIsModalOpen(true); }} className="premium-btn">
            <Plus size={18} /> {currentView === 'categories' ? 'New Category' : 'New Sub-Category'}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '100px', textAlign: 'center' }}><Loader2 className="spinning" size={40} color="#d4af37" /></div>
      ) : (
        <AnimatePresence mode="wait">
          {currentView === 'categories' && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} key="cv" style={gridStyle}>
              {categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(cat => (
                <div key={cat._id} style={catCard}>
                   <div onClick={() => { setSelectedCategory(cat); setCurrentView('subcategories'); }} style={cardTop}>
                      <div style={iconBox}><Layers size={24} color="#d4af37" /></div>
                      <div style={cardContent}>
                        <h3 style={cardTitle}>{cat.name}</h3>
                        <p style={cardDesc}>{cat.description || 'Main Pen Library'}</p>
                      </div>
                   </div>
                   <div style={cardBottom}>
                      <div style={statItem}><Boxes size={14} /> <span>{getSubCatCount(cat._id)} Subs</span></div>
                      <div style={cardActions}>
                        <button onClick={(e) => { e.stopPropagation(); toggleStatus('category', cat._id, cat.isActive); }} style={{ color: cat.isActive ? '#10b981' : '#cbd5e1', background: 'none', border: 'none', cursor: 'pointer' }}>
                          {cat.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                         <button onClick={(e) => { e.stopPropagation(); openEditModal(cat); }} style={miniBtn}><Edit2 size={14} /></button>
                         <button onClick={(e) => { e.stopPropagation(); handleDelete('category', cat._id); }} style={{ ...miniBtn, color: '#ef4444' }}><Trash2 size={14} /></button>
                      </div>
                   </div>
                </div>
              ))}
            </motion.div>
          )}

          {currentView === 'subcategories' && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} key="sv" style={gridStyle}>
              {subCategories
                .filter(s => (s.category?._id || s.category) === selectedCategory?._id)
                .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(sub => (
                <div key={sub._id} style={{ ...catCard, borderLeft: '4px solid var(--midnight)' }}>
                   <div onClick={() => { setSelectedSubCategory(sub); setCurrentView('products'); }} style={cardTop}>
                      <div style={{ ...iconBox, background: '#f8fafc' }}><LayoutGrid size={24} color="#64748b" /></div>
                      <div style={cardContent}>
                        <h3 style={cardTitle}>{sub.name}</h3>
                        <span style={pBadge}>{getProdCountBySub(sub._id)} Products</span>
                      </div>
                   </div>
                   <div style={cardBottom}>
                      <button onClick={() => toggleStatus('subcategory', sub._id, sub.isActive)} style={{ ...subToggle, color: sub.isActive ? '#d4af37' : '#94a3b8' }}>
                         {sub.isActive ? 'VISIBLE ON SITE' : 'HIDDEN FROM SITE'}
                      </button>
                      <div style={cardActions}>
                         <button onClick={() => openEditModal(sub)} style={miniBtn}><Edit2 size={14} /></button>
                         <button onClick={() => handleDelete('subcategory', sub._id)} style={{ ...miniBtn, color: '#ef4444' }}><Trash2 size={14} /></button>
                      </div>
                   </div>
                </div>
              ))}
              {subCategories.filter(s => (s.category?._id || s.category) === selectedCategory?._id).length === 0 && (
                <div style={emptyPlaceholder}>No sub-categories yet. Click "New Sub-Category" to begin.</div>
              )}
            </motion.div>
          )}

          {currentView === 'products' && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} key="pv" style={listWrap}>
               <div style={tableHead}>
                  <span style={{ width: '60px' }}>PIC</span>
                  <span style={{ flex: 1 }}>PRODUCT DETAILS</span>
                  <span style={{ width: '150px' }}>SKU CODE</span>
               </div>
               {products.filter(p => (p.subCategory?._id || p.subCategory) === selectedSubCategory?._id).map(p => (
                 <div 
                    key={p._id} 
                    onClick={() => { setSelectedProduct(p); setIsProductModalOpen(true); }}
                    style={{ ...pRow, cursor: 'pointer' }}
                 >
                    <img src={`${API_BASE_URL}${p.mainImage}`} style={pImg} />
                    <div style={{ flex: 1 }}>
                       <div style={{ fontWeight: '800' }}>{p.name}</div>
                       <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.material} | {p.tip}</div>
                    </div>
                    <div style={{ width: '150px', color: '#d4af37', fontWeight: '900' }}>{p.skuCode}</div>
                 </div>
               ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* CREATION MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={modalOverlay}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} style={modalBlur} />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} style={modalInner}>
               <div style={modalHead}>
                  <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900' }}>
                    {currentView === 'categories' ? 'Create Main Category' : `New Sub-Category for ${selectedCategory?.name}`}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} style={cBtn}><X size={20} /></button>
               </div>
               <form onSubmit={handleSave} style={{ padding: '35px' }}>
                  <div style={fGrp}>
                    <label style={fLabel}>NAME *</label>
                    <input required className="m-input" placeholder="e.g. Ball Pens" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div style={fGrp}>
                    <label style={fLabel}>DESCRIPTION</label>
                    <textarea className="m-textarea" placeholder="Brief overview..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                    <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>Enable on website immediately</label>
                  </div>
                  <button type="submit" disabled={submitting} className="m-save-btn">
                     {submitting ? <Loader2 className="spinning" /> : 'SAVE RECORD'}
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRODUCT DETAIL MODAL */}
      <AnimatePresence>
        {isProductModalOpen && selectedProduct && (
          <div style={modalOverlay}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProductModalOpen(false)} style={modalBlur} />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} style={detailModal}>
              <div style={modalHead}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ background: '#d4af37', padding: '10px', borderRadius: '12px' }}><Package size={20} color="#000" /></div>
                  <div>
                    <h3 style={{ margin: 0, fontWeight: '900' }}>{selectedProduct.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Technical & Packing Specifications</p>
                  </div>
                </div>
                <button onClick={() => setIsProductModalOpen(false)} style={cBtn}><X size={20} /></button>
              </div>
              
              <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div>
                  <div style={sectionBox}>
                    <h4 style={secTitle}>TECH SPECS</h4>
                    <div style={specGrid}>
                      <div style={specItem}><span>Material</span><strong>{selectedProduct.material}</strong></div>
                      <div style={specItem}><span>Tip</span><strong>{selectedProduct.tip}</strong></div>
                      <div style={specItem}><span>Ink</span><strong>{selectedProduct.ink}</strong></div>
                    </div>
                  </div>
                  <div style={{ ...sectionBox, marginTop: '25px' }}>
                    <h4 style={secTitle}>PACKING INFO</h4>
                    <div style={specGrid}>
                      <div style={specItem}><span>Primary</span><strong>{selectedProduct.primaryPack}</strong></div>
                      <div style={specItem}><span>Middle</span><strong>{selectedProduct.middlePacking}</strong></div>
                      <div style={specItem}><span>Master</span><strong>{selectedProduct.masterCarton}</strong></div>
                      <div style={specItem}><span>CBM</span><strong>{selectedProduct.cbm}</strong></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 style={secTitle}>PRODUCT MEDIA</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {selectedProduct.images?.map((img, i) => (
                      <img key={i} src={`${API_BASE_URL}${img}`} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #f1f5f9' }} />
                    ))}
                  </div>
                  <div style={{ marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '15px', fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
                    {selectedProduct.description}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap');
        * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }
        :root { --gold: #d4af37; --midnight: #1a1f2e; }
        .premium-btn { background: var(--midnight); color: #fff; border: none; padding: 14px 25px; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 10px 20px rgba(0,0,0,0.15); transition: 0.3s; }
        .premium-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(0,0,0,0.2); }
        .m-input, .m-textarea { width: 100%; padding: 14px; border: 2px solid #edf2f7; border-radius: 12px; outline: none; font-weight: 600; transition: 0.3s; }
        .m-input:focus, .m-textarea:focus { border-color: var(--gold); }
        .m-save-btn { width: 100%; padding: 20px; background: var(--midnight); color: #fff; border: none; border-radius: 18px; font-weight: 900; margin-top: 30px; cursor: pointer; transition: 0.3s; }
        .m-save-btn:hover { background: #000; letter-spacing: 1px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spinning { animation: spin 0.8s linear infinite; }
      `}} />
    </div>
  );
};

// MODAL STYLES
const modalOverlay = { position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modalBlur = { position: 'fixed', inset: 0, background: 'rgba(26, 31, 46, 0.85)', backdropFilter: 'blur(10px)' };
const modalInner = { position: 'relative', width: '90%', maxWidth: '500px', background: '#fff', borderRadius: '35px', overflow: 'hidden', zIndex: 101, boxShadow: '0 30px 60px rgba(0,0,0,0.4)' };
const modalHead = { padding: '25px 35px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const cBtn = { background: '#f8fafc', border: 'none', padding: '8px', borderRadius: '12px', cursor: 'pointer' };
const fGrp = { marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' };
const fLabel = { fontSize: '0.75rem', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px' };

// PAGE STYLES
const containerStyle = { minHeight: '100vh', background: '#f3f6f9', padding: '40px' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' };
const titleStyle = { fontSize: '2rem', fontWeight: '900', color: '#1a1f2e', margin: 0 };
const breadcrumbStyle = { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '700' };
const breadBtn = { background: 'none', border: 'none', color: 'inherit', fontWeight: 'inherit', cursor: 'pointer', padding: 0 };
const searchWrap = { background: '#fff', border: '1px solid #edf2f7', borderRadius: '14px', display: 'flex', alignItems: 'center', padding: '0 15px' };
const searchIn = { border: 'none', padding: '12px', outline: 'none', width: '200px', fontWeight: '600' };
const backBtn = { background: '#fff', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '14px', cursor: 'pointer' };

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' };
const catCard = { background: '#fff', borderRadius: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden', border: '1px solid #f1f5f9' };
const cardTop = { padding: '25px', display: 'flex', gap: '20px', cursor: 'pointer' };
const iconBox = { width: '55px', height: '55px', background: '#fff9e6', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const cardContent = { flex: 1 };
const cardTitle = { margin: '0 0 5px', fontSize: '1.2rem', fontWeight: '900' };
const cardDesc = { margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' };
const cardBottom = { padding: '15px 25px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const statItem = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b' };
const cardActions = { display: 'flex', gap: '10px' };
const miniBtn = { background: '#fff', border: '1px solid #edf2f7', padding: '6px', borderRadius: '8px', cursor: 'pointer' };
const pBadge = { background: '#fffbeb', color: '#d4af37', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '900', marginTop: '8px', display: 'inline-block' };
const subToggle = { background: 'none', border: 'none', fontSize: '0.7rem', fontWeight: '900', cursor: 'pointer', letterSpacing: '0.5px' };

const listWrap = { background: '#fff', borderRadius: '30px', padding: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' };
const tableHead = { padding: '15px 25px', display: 'flex', fontSize: '0.75rem', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px' };
const pRow = { padding: '15px 25px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #f8fafc' };
const pImg = { width: '50px', height: '50px', borderRadius: '12px', marginRight: '20px', objectFit: 'cover' };
const emptyPlaceholder = { padding: '100px', textAlign: 'center', gridColumn: '1/-1', color: '#94a3b8', fontWeight: '600' };

const detailModal = { position: 'relative', width: '90%', maxWidth: '900px', background: '#fff', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' };
const sectionBox = { background: '#f8fafc', padding: '25px', borderRadius: '20px', border: '1px solid #f1f5f9' };
const secTitle = { margin: '0 0 15px', fontSize: '0.75rem', fontWeight: '900', color: '#94a3b8', letterSpacing: '1.5px' };
const specGrid = { display: 'grid', gap: '12px' };
const specItem = { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' };

export default AdminCategories;
