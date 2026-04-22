import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, 
  ListTree, CheckCircle, XCircle,
  X, AlertCircle, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSubCategories = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]); // To populate the parent category dropdown
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '', // Parent Category ID
    isActive: true
  });

  useEffect(() => {
    // Dummy Data for design
    setCategories([
      { _id: '1', name: 'Ball Point Pen' },
      { _id: '2', name: 'Color Marker' },
      { _id: '3', name: 'Direct Fill Ball Pen' }
    ]);
    setSubCategories([
      { _id: 's1', name: 'Premium Metal', category: { _id: '1', name: 'Ball Point Pen' }, slug: 'premium-metal', isActive: true },
      { _id: 's2', name: 'Student Value', category: { _id: '1', name: 'Ball Point Pen' }, slug: 'student-value', isActive: true },
      { _id: 's3', name: 'Washable Markers', category: { _id: '2', name: 'Color Marker' }, slug: 'washable-markers', isActive: true },
    ]);
  }, []);

  const openModal = (sub = null) => {
    if (sub) {
      setEditingSub(sub);
      setFormData({ name: sub.name, slug: sub.slug, category: sub.category._id, isActive: sub.isActive });
    } else {
      setEditingSub(null);
      setFormData({ name: '', slug: '', category: categories[0]?._id || '', isActive: true });
    }
    setIsModalOpen(true);
  };

  const filtered = subCategories.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Sub-Category Management</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>Define specific groups within your main categories.</p>
        </div>
        <button onClick={() => openModal()} style={{ 
          background: 'var(--gold)', color: '#000', border: 'none', padding: '12px 24px', 
          borderRadius: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(212,175,55,0.3)'
        }}>
          <Plus size={18} /> Add Sub-Category
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #edf2f7', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'var(--gold-dim)', color: 'var(--gold)', padding: '10px', borderRadius: '10px' }}><ListTree size={20} /></div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{subCategories.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Total Sub-Categories</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '20px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Filter by name or parent..." 
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.9rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
            <tr>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Sub-Category</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Parent Main Category</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(sub => (
              <tr key={sub._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: '700', color: '#1e293b' }}>{sub.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/{sub.slug}</div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '0.85rem', color: '#475569' }}>
                    {sub.category.name} <ChevronRight size={14} color="#94a3b8" />
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: '800',
                    background: sub.isActive ? '#dcfce7' : '#fee2e2',
                    color: sub.isActive ? '#166534' : '#991b1b'
                  }}>
                    {sub.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => openModal(sub)} style={{ padding: '8px', color: '#6366f1', background: '#eef2ff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><Edit2 size={16} /></button>
                    <button style={{ padding: '8px', color: '#ef4444', background: '#fef2f2', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ position: 'relative', width: '100%', maxWidth: '500px', background: '#fff', borderRadius: '20px', overflow: 'hidden' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>{editingSub ? 'Edit Sub-Category' : 'Add Sub-Category'}</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: '#f8fafc', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <form style={{ padding: '24px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px', color: '#64748b' }}>PARENT MAIN CATEGORY</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', appearance: 'none', background: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 12px center', backgroundSize: '16px' }}
                  >
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px', color: '#64748b' }}>SUB-CATEGORY NAME</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Premium Gel Pens"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px', color: '#64748b' }}>SLUG</label>
                  <input type="text" value={formData.slug} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc' }} />
                </div>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', fontWeight: '700' }}>Cancel</button>
                  <button type="button" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: 'var(--gold)', color: '#000', fontWeight: '800' }}>
                    {editingSub ? 'Update' : 'Save Sub-Category'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSubCategories;
