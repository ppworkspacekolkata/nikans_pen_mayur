import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, X, Upload, 
  Film, Loader2, Trash, 
  Edit2, Video, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_ENDPOINTS, getImageUrl } from '../../config/api';

const AdminVideos = () => {
  const [videoList, setVideoList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', 
    description: '', 
    isActive: true
  });

  const videoRef = useRef(null);
  const thumbRef = useRef(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.VIDEO_POSTS);
      const data = await res.json();
      setVideoList(data);
      setFetchLoading(false);
    } catch (err) { 
      console.error(err); 
      setFetchLoading(false); 
    }
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile({
        file,
        url: URL.createObjectURL(file),
        name: file.name
      });
    }
  };

  const handleThumbSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail({
        file,
        url: URL.createObjectURL(file)
      });
    }
  };

  const uploadToCloudinary = async (file, resourceType = 'auto') => {
    try {
      // 1. Get signature from backend
      const sigRes = await fetch(`${API_ENDPOINTS.VIDEO_POSTS}/signature`);
      const { signature, timestamp, cloud_name, api_key } = await sigRes.json();

      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', api_key);
      formData.append('folder', 'nikan_videos');

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`, {
        method: 'POST',
        body: formData
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error?.message || 'Upload failed');
      return uploadData.secure_url;
    } catch (err) {
      console.error('Cloudinary Upload Error:', err);
      throw err;
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let finalVideoUrl = videoFile?.url;
      let finalThumbUrl = thumbnail?.url;

      // Upload video if it's new
      if (videoFile && !videoFile.isExisting) {
        finalVideoUrl = await uploadToCloudinary(videoFile.file, 'video');
      }

      // Upload thumbnail if it's new
      if (thumbnail && !thumbnail.isExisting) {
        finalThumbUrl = await uploadToCloudinary(thumbnail.file, 'image');
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        isActive: formData.isActive,
        videoUrl: finalVideoUrl,
        thumbnail: finalThumbUrl
      };

      const method = editingVideo ? 'PUT' : 'POST';
      const url = editingVideo ? `${API_ENDPOINTS.VIDEO_POSTS}/${editingVideo._id}` : API_ENDPOINTS.VIDEO_POSTS;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      
      if (res.ok) {
        alert('Video published successfully!');
        setIsModalOpen(false);
        resetForm();
        fetchData();
      } else {
        alert(`Failed to publish: ${result.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message || 'Error connecting to server'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', isActive: true });
    setVideoFile(null);
    setThumbnail(null);
    setEditingVideo(null);
  };

  const openEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      isActive: video.isActive
    });
    setVideoFile({ url: video.videoUrl, isExisting: true, name: 'Existing Video' });
    if (video.thumbnail) {
      setThumbnail({ url: video.thumbnail, isExisting: true });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video permanently?')) return;
    try {
      await fetch(`${API_ENDPOINTS.VIDEO_POSTS}/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ padding: '2rem', background: '#f8fafc', minHeight: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--gold)', padding: '10px', borderRadius: '12px', display: 'flex' }}>
              <Video size={24} color="#000" />
            </div>
            Video Posts
          </h1>
          <p style={{ color: '#64748b', marginTop: '6px', fontSize: '0.95rem' }}>Manage standalone videos with titles & descriptions</p>
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
          <Plus size={20} /> Add New Video
        </button>
      </div>

      {fetchLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 0' }}>
          <Loader2 className="animate-spin" size={40} color="var(--gold)" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {videoList.map(v => (
            <div key={v._id} className="glass-card-pro" style={{ background: '#fff', overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '180px', background: '#000' }}>
                {v.thumbnail ? (
                  <img src={getImageUrl(v.thumbnail)} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Film size={48} color="rgba(255,255,255,0.2)" />
                  </div>
                )}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '50%', backdropFilter: 'blur(4px)' }}>
                        <Film size={24} color="#fff" />
                    </div>
                </div>
                <div className="album-actions" style={{ 
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  gap: '12px', opacity: 0, transition: '0.3s ease'
                }}>
                  <button onClick={() => openEdit(v)} style={{ background: '#fff', padding: '10px', borderRadius: '50%', color: '#000', border:'none' }}><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(v._id)} style={{ background: '#ff4d4f', padding: '10px', borderRadius: '50%', color: '#fff', border:'none' }}><Trash size={18} /></button>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 8px 0', color: '#1e293b' }}>{v.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ position: 'relative', background: '#fff', width: '100%', maxWidth: '600px', borderRadius: '24px', overflow: 'hidden', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{editingVideo ? 'Edit Video Post' : 'Add New Video'}</h2>
                <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none' }}><X size={24} /></button>
              </div>

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', marginBottom: '8px' }}>VIDEO TITLE</label>
                  <input type="text" required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', marginBottom: '8px' }}>DESCRIPTION</label>
                  <textarea rows="3" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', resize: 'none' }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', marginBottom: '8px' }}>VIDEO FILE</label>
                        <div onClick={() => videoRef.current.click()} style={{ padding: '20px', border: '2px dashed #e2e8f0', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}>
                            <Film size={24} color="#94a3b8" />
                            <p style={{ fontSize: '0.7rem', marginTop: '5px' }}>{videoFile ? videoFile.name : 'Select Video'}</p>
                        </div>
                        <input type="file" hidden ref={videoRef} accept="video/*" onChange={handleVideoSelect} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', marginBottom: '8px' }}>THUMBNAIL (OPTIONAL)</label>
                        <div onClick={() => thumbRef.current.click()} style={{ padding: '20px', border: '2px dashed #e2e8f0', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}>
                            <Upload size={24} color="#94a3b8" />
                            <p style={{ fontSize: '0.7rem', marginTop: '5px' }}>{thumbnail ? 'Thumbnail Selected' : 'Upload Image'}</p>
                        </div>
                        <input type="file" hidden ref={thumbRef} accept="image/*" onChange={handleThumbSelect} />
                    </div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: '700', background: '#f8fafc', border: 'none' }}>Cancel</button>
                  <button type="submit" disabled={submitting} style={{ padding: '12px 36px', borderRadius: '12px', fontWeight: '800', background: '#000', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : (editingVideo ? 'Update' : 'Publish')}
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
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default AdminVideos;
