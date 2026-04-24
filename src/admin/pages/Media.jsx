import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, X, Upload, 
  Image as ImageIcon, Film, Loader2, Trash, 
  Edit2, Camera, Video, Layers, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL, { API_ENDPOINTS, getImageUrl } from '../../config/api';

const AdminMedia = () => {
  const [mediaList, setMediaList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  const [thumbnail, setThumbnail] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  
  const [editingMedia, setEditingMedia] = useState(null);
  const [formData, setFormData] = useState({
    title: '', 
    description: '', 
    type: 'Gallery',
    isActive: true
  });

  const thumbnailRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.MEDIA);
      const data = await res.json();
      setMediaList(data);
      setFetchLoading(false);
    } catch (err) { 
      console.error(err); 
      setFetchLoading(false); 
    }
  };

  const handleFileSelect = (e, target) => {
    const files = Array.from(e.target.files);
    const mapped = files.map(file => ({ 
      file, 
      url: URL.createObjectURL(file), 
      id: Math.random().toString(36).substr(2, 9),
      fileType: file.type.startsWith('video') ? 'video' : 'image'
    }));

    if (target === 'thumbnail') {
      setThumbnail(mapped[0]);
    } else {
      setGalleryItems(prev => [...prev, ...mapped]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('type', formData.type);
    data.append('isActive', formData.isActive);

    if (thumbnail && !thumbnail.isExisting) {
      data.append('thumbnail', thumbnail.file);
    }

    galleryItems.filter(item => !item.isExisting).forEach(item => {
      data.append('galleryFiles', item.file);
    });

    const existingGallery = galleryItems.filter(item => item.isExisting).map(item => ({
      url: item.url,
      fileType: item.fileType,
      caption: item.caption
    }));
    data.append('existingGallery', JSON.stringify(existingGallery));

    const method = editingMedia ? 'PUT' : 'POST';
    const url = editingMedia ? `${API_ENDPOINTS.MEDIA}/${editingMedia._id}` : API_ENDPOINTS.MEDIA;

    try {
      const res = await fetch(url, { method, body: data });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingMedia(null);
        resetForm();
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', type: 'Gallery', isActive: true });
    setThumbnail(null);
    setGalleryItems([]);
    setEditingMedia(null);
  };

  const openEdit = (media) => {
    setEditingMedia(media);
    setFormData({
      title: media.title,
      description: media.description || '',
      type: media.type,
      isActive: media.isActive
    });
    setThumbnail({ url: media.thumbnail, isExisting: true });
    setGalleryItems(media.gallery.map(item => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      isExisting: true
    })));
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this media album permanently?')) return;
    try {
      await fetch(`${API_ENDPOINTS.MEDIA}/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const removeItem = (id, target) => {
    if (target === 'thumbnail') setThumbnail(null);
    else setGalleryItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div style={{ padding: '2rem', background: '#f8fafc', minHeight: '100%' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--gold)', padding: '10px', borderRadius: '12px', display: 'flex' }}>
              <Camera size={24} color="#000" />
            </div>
            Media Management
          </h1>
          <p style={{ color: '#64748b', marginTop: '6px', fontSize: '0.95rem' }}>Create and manage your media galleries & albums</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '10px', 
            background: '#000', color: '#fff', padding: '12px 24px', 
            borderRadius: '12px', fontWeight: '700', border: 'none', 
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', cursor: 'pointer'
          }}
        >
          <Plus size={20} /> Create New Album
        </button>
      </div>

      {fetchLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 0' }}>
          <Loader2 className="animate-spin" size={40} color="var(--gold)" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {mediaList.map(media => (
            <div key={media._id} className="glass-card-pro" style={{ background: '#fff', overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '200px' }}>
                <img 
                  src={getImageUrl(media.thumbnail)} 
                  alt={media.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <span style={{ 
                    padding: '6px 12px', borderRadius: '8px', fontSize: '0.7rem', 
                    fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px',
                    background: 'rgba(255,255,255,0.9)', color: '#000', boxShadow: 'var(--shadow-sm)'
                  }}>
                    {media.type}
                  </span>
                </div>
                <div className="album-actions" style={{ 
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  gap: '12px', opacity: 0, transition: '0.3s ease'
                }}>
                  <button onClick={() => openEdit(media)} style={{ background: '#fff', padding: '10px', borderRadius: '50%', color: '#000' }}><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(media._id)} style={{ background: '#ff4d4f', padding: '10px', borderRadius: '50%', color: '#fff' }}><Trash size={18} /></button>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 8px 0', color: '#1e293b' }}>{media.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{media.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>
                    <ImageIcon size={14} /> {media.gallery.filter(i => i.fileType === 'image').length} Photos
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>
                    <Film size={14} /> {media.gallery.filter(i => i.fileType === 'video').length} Videos
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL SYSTEM */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ 
            position: 'fixed', inset: 0, zIndex: 1000, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' 
          }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)' }}
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ 
                position: 'relative', background: '#fff', width: '100%', maxWidth: '900px', 
                borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', 
                overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh'
              }}
            >
              {/* Modal Header */}
              <div style={{ 
                padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' 
              }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
                  {editingMedia ? 'Update Media Album' : 'Create New Media Album'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} style={{ color: '#64748b' }}><X size={24} /></button>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleSave} style={{ overflowY: 'auto', padding: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', marginBottom: '8px', color: '#475569' }}>ALBUM TITLE</label>
                      <input 
                        type="text" required
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.95rem' }}
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        placeholder="Dubai Global Exhibition 2025"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', marginBottom: '8px', color: '#475569' }}>DESCRIPTION</label>
                      <textarea 
                        rows="4"
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.95rem', resize: 'none' }}
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Brief overview of this media entry..."
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', marginBottom: '8px', color: '#475569' }}>ALBUM TYPE</label>
                      <select 
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.95rem', background: '#fff' }}
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}
                      >
                        <option value="Gallery">Standard Gallery</option>
                        <option value="Event">Event / News</option>
                        <option value="Factory">Factory & Infrastructure</option>
                        <option value="Video">Video Showcase</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#475569' }}>COVER THUMBNAIL</label>
                    <div 
                      onClick={() => thumbnailRef.current?.click()}
                      style={{ 
                        height: '240px', background: '#f1f5f9', border: '2px dashed #cbd5e1', 
                        borderRadius: '20px', display: 'flex', flexDirection: 'column', 
                        alignItems: 'center', justifyCenter: 'center', cursor: 'pointer', overflow: 'hidden'
                      }}
                    >
                      {thumbnail ? (
                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                          <img 
                            src={thumbnail.isExisting ? getImageUrl(thumbnail.url) : thumbnail.url} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                          <button 
                            type="button" onClick={(e) => { e.stopPropagation(); removeItem(null, 'thumbnail'); }}
                            style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff4d4f', color: '#fff', border: 'none', padding: '6px', borderRadius: '50%' }}
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                          <Upload size={32} color="#94a3b8" style={{ marginBottom: '12px' }} />
                          <p style={{ fontWeight: '700', fontSize: '0.9rem', color: '#64748b' }}>Click to upload cover</p>
                          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Recommended 16:9 ratio</p>
                        </div>
                      )}
                    </div>
                    <input type="file" hidden ref={thumbnailRef} onChange={e => handleFileSelect(e, 'thumbnail')} accept="image/*" />
                  </div>
                </div>

                {/* Album Items */}
                <div style={{ marginTop: '2.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Layers size={18} color="var(--gold)" /> ALBUM CONTENT
                    </h3>
                    <button 
                      type="button" onClick={() => galleryRef.current?.click()}
                      style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Plus size={16} /> Add Photos/Videos
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                    {galleryItems.map((item) => (
                      <div key={item.id} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                        {item.fileType === 'video' ? (
                          <div style={{ width: '100%', height: '100%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Video color="#fff" opacity={0.5} size={24} />
                          </div>
                        ) : (
                          <img src={item.isExisting ? getImageUrl(item.url) : item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                        <button 
                          type="button" onClick={() => removeItem(item.id, 'gallery')}
                          style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(255,77,79,0.9)', color: '#fff', border: 'none', padding: '4px', borderRadius: '4px' }}
                        >
                          <X size={12} />
                        </button>
                        {item.fileType === 'video' && (
                          <div style={{ position: 'absolute', bottom: '6px', left: '6px', fontSize: '10px', color: '#fff', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>VIDEO</div>
                        )}
                      </div>
                    ))}
                    <div 
                      onClick={() => galleryRef.current?.click()}
                      style={{ aspectRatio: '1/1', border: '2px dashed #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8' }}
                    >
                      <Plus size={24} />
                      <span style={{ fontSize: '0.65rem', fontWeight: '800', marginTop: '6px' }}>UPLOAD</span>
                    </div>
                  </div>
                  <input type="file" hidden multiple ref={galleryRef} onChange={e => handleFileSelect(e, 'gallery')} accept="image/*,video/*" />
                </div>

                {/* Actions */}
                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button 
                    type="button" onClick={() => setIsModalOpen(false)}
                    style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: '700', color: '#64748b', background: '#f8fafc' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" disabled={submitting}
                    style={{ 
                      padding: '12px 36px', borderRadius: '12px', fontWeight: '800', 
                      background: '#000', color: '#fff', border: 'none', 
                      display: 'flex', alignItems: 'center', gap: '10px' 
                    }}
                  >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : (editingMedia ? 'Update Album' : 'Publish Album')}
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .glass-card-pro:hover .album-actions { opacity: 1 !important; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: var(--gold) !important; box-shadow: 0 0 0 4px var(--gold-dim) !important; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default AdminMedia;
