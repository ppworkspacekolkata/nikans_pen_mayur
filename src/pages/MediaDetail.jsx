import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, X, Play, 
  Image as ImageIcon, Film, ArrowLeft, Download, Share2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_ENDPOINTS, getImageUrl } from '../config/api';

export default function MediaDetail() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMediaIdx, setActiveMediaIdx] = useState(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.MEDIA}/${id}`);
        const data = await res.json();
        setAlbum(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching album:', err);
        setLoading(false);
      }
    };
    fetchAlbum();
    window.scrollTo(0, 0);
  }, [id]);

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveMediaIdx((prev) => (prev + 1) % album.gallery.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveMediaIdx((prev) => (prev - 1 + album.gallery.length) % album.gallery.length);
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Gallery...</div>;
  if (!album) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Album not found.</div>;

  return (
    <div className="page-media-detail" style={{ background: '#fff' }}>
      <Navbar />

      {/* ── HERO HEADER ────────────────────── */}
      <section style={{ 
        padding: '120px 6rem 60px', 
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        borderBottom: '1px solid #edf2f7'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link to="/media" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', marginBottom: '30px', fontWeight: '600', fontSize: '0.9rem' }}>
            <ArrowLeft size={18} /> BACK TO GALLERIES
          </Link>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ borderRadius: '30px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', aspectRatio: '16/10' }}
            >
              <img 
                src={getImageUrl(album.thumbnail)} 
                alt={album.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span style={{ color: 'var(--gold)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                {album.type} • {album.gallery.length} ASSETS
              </span>
              <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#1a1f2e', margin: '15px 0 20px', lineHeight: '1.1' }}>
                {album.title}
              </h1>
              <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '30px' }}>
                {album.description}
              </p>
              
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1f2e', fontWeight: '700' }}>
                  <ImageIcon size={20} color="var(--gold)" /> {album.gallery.filter(i => i.fileType === 'image').length} Photos
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1f2e', fontWeight: '700' }}>
                  <Film size={20} color="var(--gold)" /> {album.gallery.filter(i => i.fileType === 'video').length} Videos
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── GALLERY GRID ───────────────────── */}
      <section style={{ padding: '80px 6rem' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '40px', textAlign: 'center' }}>Album <em>Gallery</em></h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '20px' 
          }}>
            {album.gallery.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => setActiveMediaIdx(idx)}
                style={{ 
                  borderRadius: '20px', overflow: 'hidden', 
                  cursor: 'pointer', background: '#f8fafc',
                  aspectRatio: '1/1', position: 'relative'
                }}
              >
                <img 
                  src={getImageUrl(item.url)} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {item.fileType === 'video' && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ background: '#fff', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                      <Play size={20} fill="#000" />
                    </div>
                  </div>
                )}
                <div className="hover-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(212, 175, 55, 0.2)', opacity: 0, transition: '0.3s' }}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX OVERLAY ────────────────── */}
      <AnimatePresence>
        {activeMediaIdx !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', inset: 0, zIndex: 10000, 
              background: 'rgba(10, 10, 10, 0.98)', backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            onClick={() => setActiveMediaIdx(null)}
          >
            {/* Close Button */}
            <button onClick={() => setActiveMediaIdx(null)} style={{ position: 'absolute', top: '30px', right: '30px', color: '#fff', background: 'rgba(255,255,255,0.1)', border: 'none', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={24} />
            </button>

            {/* Navigation */}
            <button onClick={handlePrev} style={{ position: 'absolute', left: '30px', top: '50%', transform: 'translateY(-50%)', color: '#fff', background: 'rgba(255,255,255,0.05)', border: 'none', width: '60px', height: '60px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={32} />
            </button>
            <button onClick={handleNext} style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)', color: '#fff', background: 'rgba(255,255,255,0.05)', border: 'none', width: '60px', height: '60px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={32} />
            </button>

            {/* Media Content */}
            <motion.div 
              key={activeMediaIdx}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ maxWidth: '85vw', maxHeight: '85vh', position: 'relative' }}
              onClick={e => e.stopPropagation()}
            >
              {album.gallery[activeMediaIdx].fileType === 'video' ? (
                <video controls autoPlay style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '15px' }}>
                  <source src={getImageUrl(album.gallery[activeMediaIdx].url)} type="video/mp4" />
                </video>
              ) : (
                <img 
                  src={getImageUrl(album.gallery[activeMediaIdx].url)} 
                  style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '15px', boxShadow: '0 30px 100px rgba(0,0,0,0.5)' }}
                />
              )}
              
              <div style={{ position: 'absolute', bottom: '-60px', left: 0, right: 0, textAlign: 'center', color: '#fff' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', background: 'rgba(255,255,255,0.1)', padding: '8px 20px', borderRadius: '50px' }}>
                  {activeMediaIdx + 1} / {album.gallery.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <style dangerouslySetInnerHTML={{ __html: `
        .page-media-detail img { transition: 0.5s ease; }
        .hover-overlay:hover { opacity: 1 !important; }
      `}} />
    </div>
  );
}
