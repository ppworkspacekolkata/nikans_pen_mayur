import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FileText, Download, Image as ImageIcon, Newspaper,
  ArrowRight, Play, Layers, Film
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE_URL, { API_ENDPOINTS, getImageUrl } from '../config/api';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] } }),
};

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} variants={fadeUp} custom={delay} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
      {children}
    </motion.div>
  );
}

export default function Media() {
  const [mediaList, setMediaList] = useState([]);
  const [videoPosts, setVideoPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, vRes] = await Promise.all([
          fetch(API_ENDPOINTS.MEDIA),
          fetch(API_ENDPOINTS.VIDEO_POSTS)
        ]);
        const mData = await mRes.json();
        const vData = await vRes.json();

        setMediaList(mData.filter(m => m.isActive));
        setVideoPosts(vData.filter(v => v.isActive));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching media:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-media" style={{ background: '#fff' }}>
      <Navbar />

      {/* ── PAGE HERO ─────────────────────── */}
      <section className="page-hero-premium">
        <div className="page-hero-content">
          <motion.span className="label-gold" variants={fadeUp} custom={0} initial="hidden" animate="visible">
            Media & press
          </motion.span>
          <motion.h1 className="page-hero-title" variants={fadeUp} custom={0.1} initial="hidden" animate="visible">
            News, resources<br />& <em>Brand assets</em>
          </motion.h1>
          <motion.p className="page-hero-desc" variants={fadeUp} custom={0.2} initial="hidden" animate="visible">
            Explore Nikan’s world-class manufacturing in action through our corporate films
            and get in touch with our media relations team for export enquiries.
          </motion.p>
        </div>
      </section>

      {/* ── GALLERY ALBUMS SECTION ─────────── */}
      <section className="section" style={{ padding: '6rem 0', background: '#fcfcfc' }}>
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
          <Reveal>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span className="label">Visual Journey</span>
              <h2 className="section-title">Media <em>Galleries</em></h2>
              <p className="section-subtitle" style={{ maxWidth: '600px', margin: '1rem auto' }}>
                A look inside our state-of-the-art facilities, international exhibitions, and the craftsmanship behind Nikan Pen.
              </p>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem' }}>Loading media albums...</div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem'
              }}>
                {mediaList.map((album, idx) => (
                  <motion.div
                    key={album._id}
                    whileHover={{ y: -10 }}
                    onClick={() => navigate(`/media/${album._id}`)}
                    className="glass-card-pro"
                    style={{
                      cursor: 'pointer',
                      background: '#fff',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                      border: '1px solid #f1f5f9'
                    }}
                  >
                    <div style={{ height: '240px', position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={getImageUrl(album.thumbnail)}
                        alt={album.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.6s transform cubic-bezier(0.22, 1, 0.36, 1)' }}
                        className="album-img"
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)', opacity: 0.8 }} />
                      <div style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', gap: '8px' }}>
                        <span style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '0.7rem', color: '#fff', fontWeight: '800', textTransform: 'uppercase' }}>
                          {album.type}
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1a1f2e', margin: '0 0 10px 0' }}>{album.title}</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {album.description}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <ImageIcon size={14} /> {album.gallery.filter(i => i.fileType === 'image').length}
                          </span>
                          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Film size={14} /> {album.gallery.filter(i => i.fileType === 'video').length}
                          </span>
                        </div>
                        <div style={{ color: 'var(--gold)', fontWeight: '800', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          VIEW <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* ── CORPORATE VIDEOS ───────────────── */}
      <section className="section media-video-section" style={{ background: '#fff', padding: '6rem 0' }}>
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
          <Reveal>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span className="label">Corporate Showcase</span>
              <h2 className="section-title">Films & <em>Storytelling</em></h2>
              <p className="section-subtitle" style={{ maxWidth: '600px', margin: '1rem auto' }}>
                Watch our journey, manufacturing excellence, and global impact through our curated film library.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2.5rem'
            }}>
              {videoPosts.map((video, idx) => (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="video-post-card glass-card-pro"
                  style={{
                    background: '#fff',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{
                    position: 'relative',
                    aspectRatio: '16/9',
                    background: '#000',
                    overflow: 'hidden'
                  }}>
                    <video
                      controls
                      width="100%"
                      height="100%"
                      style={{ objectFit: 'cover' }}
                      poster={video.thumbnail ? getImageUrl(video.thumbnail) : ''}
                    >
                      <source src={getImageUrl(video.videoUrl)} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1a1f2e', marginBottom: '10px' }}>{video.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                      {video.description}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Keep existing static videos as fallback if needed, or remove them */}
              {!videoPosts.length && (
                <>
                  <div className="video-container glass-card-pro" style={{ overflow: 'hidden', aspectRatio: '16/9', background: '#000', borderRadius: '24px' }}>
                    <video controls width="100%" height="100%" style={{ objectFit: 'cover' }} poster="/team/sunil_chairman.png">
                      <source src="/team_media/video.mp4" type="video/mp4" />
                    </video>
                  </div>
                  <div className="video-container glass-card-pro" style={{ overflow: 'hidden', aspectRatio: '16/9', background: '#000', borderRadius: '24px' }}>
                    <video controls width="100%" height="100%" style={{ objectFit: 'cover' }}>
                      <source src="/team_media/video 1.mp4" type="video/mp4" />
                    </video>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── MEDIA CONTACT ─────────────── */}
      <section className="section media-contact-section" style={{ background: 'var(--bg-secondary)', padding: '6rem 1rem' }}>
        <Reveal>
          <div className="media-contact-card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', background: '#fff', padding: '3.5rem 1.5rem', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
            <Newspaper size={48} style={{ color: 'var(--gold)', marginBottom: '1.5rem' }} />
            <h3 className="media-contact-title" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', marginBottom: '1rem' }}>Media & Export Enquiries</h3>
            <p className="media-contact-desc" style={{ color: '#64748b', marginBottom: '2.5rem', lineHeight: '1.7' }}>
              For press enquiries, export opportunities, or access to brand materials,
              please contact our communications team directly.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
              <a href="mailto:exports@tirupaticolorpens.com" className="btn-primary media-contact-btn" style={{ boxShadow: 'var(--shadow-gold)', width: 'fit-content', padding: '15px 25px', fontSize: 'clamp(0.7rem, 3vw, 0.9rem)', wordBreak: 'break-all' }}>
                exports@tirupaticolorpens.com <ArrowRight size={18} />
              </a>
              <p style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                Direct line - +91 9830058822
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
      <style dangerouslySetInnerHTML={{
        __html: `
        .album-img:hover { transform: scale(1.05); }
        .glass-card-pro:hover .album-img { transform: scale(1.05); }
      `}} />
    </div>
  );
}