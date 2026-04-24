import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Image as ImageIcon, 
  Loader2, Save, X, Type, FileText, BarChart3, 
  ArrowRight, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL, { API_ENDPOINTS, getImageUrl } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const AdminHeroSettings = () => {
  const { token } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [currentPreviewSlide, setCurrentPreviewSlide] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    stats: [
      { label: '', value: '' },
      { label: '', value: '' },
      { label: '', value: '' }
    ]
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const allPreviewImages = [
    ...(settings?.images || []).map(img => getImageUrl(img)),
    ...newImages.map(file => URL.createObjectURL(file))
  ];

  useEffect(() => {
    if (allPreviewImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentPreviewSlide(prev => (prev + 1) % allPreviewImages.length);
      }, 4000);
      return () => clearInterval(timer);
    } else {
      setCurrentPreviewSlide(0);
    }
  }, [allPreviewImages.length]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.HERO_SETTINGS);
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      setSettings(data);
      setFormData({
        title: data.title || '',
        subtitle: data.subtitle || '',
        description: data.description || '',
        stats: data.stats || [
          { label: 'Global Markets', value: '20' },
          { label: 'Precision SKUs', value: '100' },
          { label: 'Years Active', value: '15' }
        ]
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatChange = (index, field, value) => {
    const updatedStats = [...formData.stats];
    updatedStats[index][field] = value;
    setFormData({ ...formData, stats: updatedStats });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageUrl) => {
    if (!window.confirm('Remove this image from slider?')) return;
    try {
      const res = await fetch(`${API_ENDPOINTS.HERO_SETTINGS}/remove-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      });
      if (res.ok) fetchSettings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);

    const fData = new FormData();
    fData.append('title', formData.title);
    fData.append('subtitle', formData.subtitle);
    fData.append('description', formData.description);
    fData.append('stats', JSON.stringify(formData.stats));
    
    newImages.forEach(img => {
      fData.append('images', img);
    });

    try {
      console.log('Target URL:', `${API_ENDPOINTS.HERO_SETTINGS}/update`);
      const res = await fetch(`${API_ENDPOINTS.HERO_SETTINGS}/update`, {
        method: 'POST',
        body: fData
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        let errMsg = 'Failed to save';
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errData = await res.json();
          errMsg = errData.message || errMsg;
        } else {
          errMsg = `Server Error (${res.status})`;
        }
        throw new Error(errMsg);
      }

      if (contentType && contentType.indexOf("application/json") !== -1) {
        await res.json();
        setNewImages([]);
        fetchSettings();
        alert('Hero settings updated successfully!');
      } else {
        throw new Error('Server returned invalid response (Not JSON)');
      }
    } catch (err) {
      console.error("Submit Error:", err);
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={loadingWrap}><Loader2 className="spinning" size={40} color="#d4af37" /></div>;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Homepage Hero Settings</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Configure the main branding section of your homepage</p>
        </div>
        <button onClick={handleSubmit} disabled={submitting} style={saveBtn}>
          {submitting ? <Loader2 className="spinning" size={20} /> : <Save size={20} />} 
          {submitting ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div style={layoutGrid}>
        {/* LEFT COLUMN: FORMS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* TEXT CONTENT FORM */}
          <div style={formSection}>
            <h2 style={sectionTitle}><Type size={20} /> Text Content</h2>
            <div style={card}>
              <div style={formGroup}>
                <label style={labelStyle}>MAIN HEADING</label>
                <input 
                  style={inputStyle} 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Mastering the Art of"
                />
              </div>
              <div style={formGroup}>
                <label style={labelStyle}>SUB HEADING (GOLD TEXT)</label>
                <input 
                  style={inputStyle} 
                  value={formData.subtitle} 
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g., Precision Writing"
                />
              </div>
              <div style={formGroup}>
                <label style={labelStyle}>DESCRIPTION PARAGRAPH</label>
                <textarea 
                  style={{ ...inputStyle, height: '100px', resize: 'none' }} 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Full description text..."
                />
              </div>
            </div>
          </div>

          {/* STATS FORM */}
          <div style={formSection}>
            <h2 style={sectionTitle}><BarChart3 size={20} /> Stats (Counter Section)</h2>
            <div style={card}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                {formData.stats.map((stat, i) => (
                  <div key={i} style={statBox}>
                    <label style={labelStyle}>STAT {i+1} VALUE</label>
                    <input 
                      style={{ ...inputStyle, marginBottom: '10px' }} 
                      value={stat.value} 
                      onChange={e => handleStatChange(i, 'value', e.target.value)}
                      placeholder="e.g. 20+"
                    />
                    <label style={labelStyle}>STAT {i+1} LABEL</label>
                    <input 
                      style={inputStyle} 
                      value={stat.label} 
                      onChange={e => handleStatChange(i, 'label', e.target.value)}
                      placeholder="e.g. Global Markets"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* IMAGES FORM */}
          <div style={imageSection}>
            <h2 style={sectionTitle}><ImageIcon size={20} /> Right-side Slider Gallery</h2>
            <div style={card}>
              <div style={galleryGrid}>
                {settings?.images.map((img, i) => (
                  <div key={i} style={imageThumbWrap}>
                    <img src={getImageUrl(img)} style={imageThumb} alt="" />
                    <button onClick={() => removeExistingImage(img)} style={deleteThumbBtn}><X size={14} /></button>
                  </div>
                ))}
                {newImages.map((file, i) => (
                  <div key={i} style={{ ...imageThumbWrap, border: '2px solid var(--gold)' }}>
                    <img src={URL.createObjectURL(file)} style={imageThumb} alt="" />
                    <button onClick={() => removeNewImage(i)} style={deleteThumbBtn}><X size={14} /></button>
                    <div style={newBadge}>Pending</div>
                  </div>
                ))}
                <label style={addThumbBtn}>
                  <Plus size={30} color="#cbd5e1" />
                  <input type="file" multiple hidden onChange={handleFileChange} accept="image/*" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REALISTIC PREVIEW */}
        <div style={{ position: 'sticky', top: '30px', height: 'fit-content' }}>
          <h2 style={sectionTitle}>Live Layout Preview</h2>
          <div style={realisticPreviewContainer}>
            {/* Mock Nav Bar Strip */}
            <div style={{ height: '40px', background: '#fff', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '20px' }}>
                <div style={{ width: '15px', height: '15px', background: 'var(--gold)', borderRadius: '4px' }} />
                <div style={{ width: '60px', height: '10px', background: '#f1f5f9', borderRadius: '10px' }} />
                <div style={{ width: '40px', height: '10px', background: '#f1f5f9', borderRadius: '10px' }} />
                <div style={{ width: '40px', height: '10px', background: '#f1f5f9', borderRadius: '10px' }} />
            </div>

            <div style={mockHeroBody}>
              <div style={mockHeroGrid}>
                {/* Left: Text */}
                <div style={{ zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <div style={{ height: '2px', width: '20px', background: 'var(--gold)' }} />
                    <span style={{ fontSize: '0.6rem', fontWeight: '900', letterSpacing: '2px', color: '#1a1f2e' }}>ESTABLISHED EXCELLENCE</span>
                  </div>
                  <h1 style={mockHeroTitle}>
                    {formData.title || "Mastering the Art of"} <br />
                    <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>{formData.subtitle || "Precision Writing"}</span>
                  </h1>
                  <p style={mockHeroDesc}>{formData.description || "NIKAN, a global-facing brand..."}</p>
                  
                  <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <div style={{ padding: '10px 20px', background: 'var(--gold)', borderRadius: '20px', fontSize: '0.6rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px', color: '#000' }}>EXPLORE <ArrowRight size={10} /></div>
                    <div style={{ padding: '10px 0', fontSize: '0.6rem', fontWeight: '800', borderBottom: '1px solid var(--gold)', display: 'flex', alignItems: 'center', gap: '5px', color: '#1a1f2e' }}>Bulk Enquiries <ChevronRight size={10} /></div>
                  </div>

                  {/* Mock Stats Row */}
                  <div style={mockStatsRow}>
                    {formData.stats.map((s, i) => (
                      <React.Fragment key={i}>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                          <div style={{ color: 'var(--gold)', fontSize: '1.2rem', fontWeight: '900' }}>{s.value || '0'}</div>
                          <div style={{ fontSize: '0.45rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>{s.label || 'Stat'}</div>
                        </div>
                        {i < 2 && <div style={{ width: '1px', background: '#f1f5f9' }} />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Right: Slider Card */}
                <div style={{ position: 'relative' }}>
                   <div style={mockSliderCard}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentPreviewSlide}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                          style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {allPreviewImages.length > 0 ? (
                            <img src={allPreviewImages[currentPreviewSlide]} style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }} alt="" />
                          ) : (
                            <div style={{ color: '#cbd5e1', fontSize: '0.8rem', textAlign: 'center', padding: '20px' }}>
                               <ImageIcon size={30} style={{ display: 'block', margin: '0 auto 10px' }} />
                               Upload images to see slider preview
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                      <div style={{ position: 'absolute', bottom: '15px', left: '15px', background: 'var(--gold)', fontSize: '0.45rem', fontWeight: '900', padding: '3px 8px', borderRadius: '2px', color: '#000' }}>MADE IN INDIA</div>
                      <div style={{ position: 'absolute', bottom: '15px', right: '15px', display: 'flex', gap: '4px' }}>
                        {allPreviewImages.map((_, i) => (
                           <div key={i} style={{ width: i === currentPreviewSlide ? '12px' : '4px', height: '4px', background: i === currentPreviewSlide ? 'var(--gold)' : '#cbd5e1', borderRadius: '4px', transition: '0.3s' }} />
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spinning { animation: spin 0.8s linear infinite; }
      `}} />
    </div>
  );
};

// Styles
const loadingWrap = { height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const containerStyle = { padding: '40px', background: '#f8fafc', minHeight: '100vh' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const titleStyle = { fontSize: '1.8rem', fontWeight: '900', color: '#1a1f2e', margin: '0 0 5px 0' };
const saveBtn = { background: '#1a1f2e', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s transform' };
const layoutGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' };
const formSection = {};
const imageSection = {};
const sectionTitle = { fontSize: '1.1rem', fontWeight: '800', color: '#1a1f2e', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' };
const card = { background: '#fff', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' };
const formGroup = { marginBottom: '20px' };
const labelStyle = { fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px', marginBottom: '10px', display: 'block' };
const inputStyle = { width: '100%', padding: '14px', border: '2px solid #f1f5f9', borderRadius: '14px', outline: 'none', fontWeight: '600', fontSize: '0.9rem', transition: '0.2s border-color' };
const statBox = { background: '#fcfcfc', padding: '15px', borderRadius: '18px', border: '1px solid #f1f5f9' };

const galleryGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' };
const imageThumbWrap = { height: '100px', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '1px solid #f1f5f9' };
const imageThumb = { width: '100%', height: '100%', objectFit: 'cover' };
const deleteThumbBtn = { position: 'absolute', top: '5px', right: '5px', background: '#ef4444', color: '#fff', border: 'none', width: '20px', height: '20px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const addThumbBtn = { height: '100px', border: '2px dashed #cbd5e1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' };
const newBadge = { position: 'absolute', bottom: '5px', left: '5px', background: 'var(--gold)', color: '#000', fontSize: '0.5rem', padding: '1px 6px', borderRadius: '3px', fontWeight: '800' };

// Realistic Preview Styles
const realisticPreviewContainer = { width: '100%', borderRadius: '30px', overflow: 'hidden', background: '#fffef5', border: '1px solid #e2e8f0', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' };
const mockHeroBody = { padding: '50px 30px' };
const mockHeroGrid = { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'center' };
const mockHeroTitle = { fontSize: '1.8rem', fontWeight: '900', lineHeight: '1.1', color: '#1a1f2e', marginBottom: '15px' };
const mockHeroDesc = { fontSize: '0.65rem', color: '#64748b', lineHeight: '1.6', marginBottom: '15px', maxWidth: '85%' };
const mockStatsRow = { marginTop: '40px', background: '#fff', padding: '20px', borderRadius: '20px', display: 'flex', gap: '10px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' };
const mockSliderCard = { background: '#fff', aspectRatio: '1/1', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' };

export default AdminHeroSettings;
