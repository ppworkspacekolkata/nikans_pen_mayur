import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, 
  ListTree, CheckCircle, XCircle,
  X, AlertCircle, ChevronRight, Loader2, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const AdminSubCategories = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [editingSub, setEditingSub] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    isActive: true
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sRes, cRes, pRes] = await Promise.all([
        fetch(API_ENDPOINTS.SUB_CATEGORIES),
        fetch(API_ENDPOINTS.CATEGORIES),
        fetch(API_ENDPOINTS.PRODUCTS)
      ]);
      setSubCategories(await sRes.json());
      setCategories(await cRes.json());
      setProducts(await pRes.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const method = editingSub ? 'PUT' : 'POST';
    const url = editingSub ? `${API_ENDPOINTS.SUB_CATEGORIES}/${editingSub._id}` : API_ENDPOINTS.SUB_CATEGORIES;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sub-category?')) return;
    try {
      await fetch(`${API_ENDPOINTS.SUB_CATEGORIES}/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const openModal = (sub = null) => {
    if (sub) {
      setEditingSub(sub);
      setFormData({ name: sub.name, category: sub.category?._id || sub.category, isActive: sub.isActive });
    } else {
      setEditingSub(null);
      setFormData({ name: '', category: categories[0]?._id || '', isActive: true });
    }
    setIsModalOpen(true);
  };

  const filtered = subCategories.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page" style={{ padding: '40px' }}>
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Sub-Category Management</h1>
          <p style={subtitleStyle}>Define specific groups within your main categories.</p>
        </div>
        <button onClick={() => openModal()} className="premium-btn">
          <Plus size={18} /> Add Sub-Category
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '100px', textAlign: 'center' }}><Loader2 className="spinning" size={40} color="#d4af37" /></div>
      ) : (
        <div style={tableCard}>
          <div style={searchBar}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Filter records..." 
              style={searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={tHead}>
              <tr>
                <th style={tTh}>Sub-Category</th>
                <th style={tTh}>Parent Category</th>
                <th style={tTh}>Status</th>
                <th style={{ ...tTh, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(sub => (
                <tr key={sub._id} style={{ ...tRow, cursor: 'pointer' }} onClick={() => { setSelectedSub(sub); setIsProductsModalOpen(true); }}>
                  <td style={tTd}>
                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{sub.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/{sub.slug}</div>
                  </td>
                  <td style={tTd}>
                    <span style={catBadge}>{sub.category?.name || 'Uncategorized'}</span>
                  </td>
                  <td style={tTd}>
                    <span style={{ ...statusBadge, background: sub.isActive ? '#dcfce7' : '#fee2e2', color: sub.isActive ? '#166534' : '#991b1b' }}>
                      {sub.isActive ? 'ACTIVE' : 'HIDDEN'}
                    </span>
                  </td>
                  <td style={{ ...tTd, textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <div style={actionWrap}>
                      <button onClick={() => openModal(sub)} style={editBtn}><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(sub._id)} style={delBtn}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PRODUCTS MODAL */}
      <AnimatePresence>
        {isProductsModalOpen && selectedSub && (
          <div style={modalOverlay}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProductsModalOpen(false)} style={modalBlur} />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} style={modalContent}>
              <div style={modalHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: '#d4af37', color: '#000', padding: '8px', borderRadius: '10px' }}><Package size={18} /></div>
                  <h3 style={{ margin: 0, fontWeight: '900' }}>Products in {selectedSub.name}</h3>
                </div>
                <button onClick={() => setIsProductsModalOpen(false)} style={closeBtn}><X size={20} /></button>
              </div>
              <div style={{ padding: '25px', maxHeight: '450px', overflowY: 'auto' }}>
                {products.filter(p => (p.subCategory?._id || p.subCategory) === selectedSub._id).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No products found in this sub-category.</div>
                ) : (
                  <div style={{ display: 'grid', gap: '15px' }}>
                    {products.filter(p => (p.subCategory?._id || p.subCategory) === selectedSub._id).map(p => (
                      <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', background: '#f8fafc', borderRadius: '15px' }}>
                        <img src={`${API_BASE_URL}${p.mainImage}`} style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} alt="" />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.9rem' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>SKU: {p.skuCode}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <div style={modalOverlay}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} style={modalBlur} />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} style={modalContent}>
              <div style={modalHeader}>
                <h3 style={{ margin: 0, fontWeight: '900' }}>{editingSub ? 'Modify Sub-Category' : 'Create New Entry'}</h3>
                <button onClick={() => setIsModalOpen(false)} style={closeBtn}><X size={20} /></button>
              </div>

              <form onSubmit={handleSave} style={{ padding: '30px' }}>
                <div style={fGroup}>
                  <label style={fLabel}>PARENT MAIN CATEGORY</label>
                  <select required className="m-input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="">Select Parent</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div style={fGroup}>
                  <label style={fLabel}>SUB-CATEGORY NAME</label>
                  <input required className="m-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={cancelBtn}>CANCEL</button>
                  <button type="submit" disabled={submitting} style={saveBtn}>
                    {submitting ? <Loader2 className="spinning" /> : 'SAVE CHANGES'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .premium-btn { background: #1a1f2e; color: #fff; border: none; padding: 14px 25px; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.3s; }
        .m-input { width: 100%; padding: 14px; border: 2px solid #edf2f7; border-radius: 12px; outline: none; font-weight: 600; }
        .spinning { animation: spin 0.8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const titleStyle = { fontSize: '2rem', fontWeight: '900', color: '#1a1f2e', margin: 0 };
const subtitleStyle = { color: '#64748b', fontSize: '0.9rem', marginTop: '5px' };
const tableCard = { background: '#fff', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', overflow: 'hidden' };
const searchBar = { padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' };
const searchInput = { border: 'none', background: 'none', outline: 'none', width: '300px', fontWeight: '600' };
const tHead = { background: '#f8fafc' };
const tTh = { padding: '18px 25px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' };
const tRow = { borderBottom: '1px solid #f1f5f9' };
const tTd = { padding: '18px 25px' };
const catBadge = { background: '#fff9e6', color: '#d4af37', padding: '5px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800' };
const statusBadge = { padding: '4px 12px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: '900' };
const actionWrap = { display: 'flex', gap: '10px', justifyContent: 'flex-end' };
const editBtn = { padding: '8px', color: '#6366f1', background: '#eef2ff', border: 'none', borderRadius: '10px', cursor: 'pointer' };
const delBtn = { padding: '8px', color: '#ef4444', background: '#fef2f2', border: 'none', borderRadius: '10px', cursor: 'pointer' };

const modalOverlay = { position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modalBlur = { position: 'fixed', inset: 0, background: 'rgba(26, 31, 46, 0.8)', backdropFilter: 'blur(8px)' };
const modalContent = { position: 'relative', width: '90%', maxWidth: '500px', background: '#fff', borderRadius: '30px', overflow: 'hidden' };
const modalHeader = { padding: '25px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const closeBtn = { background: '#f8fafc', border: 'none', borderRadius: '10px', padding: '8px', cursor: 'pointer' };
const fGroup = { marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' };
const fLabel = { fontSize: '0.75rem', fontWeight: '900', color: '#94a3b8' };
const cancelBtn = { flex: 1, padding: '15px', borderRadius: '15px', border: '1px solid #e2e8f0', background: '#fff', fontWeight: '800', cursor: 'pointer' };
const saveBtn = { flex: 1, padding: '15px', borderRadius: '15px', border: 'none', background: '#1a1f2e', color: '#fff', fontWeight: '800', cursor: 'pointer' };

export default AdminSubCategories;
