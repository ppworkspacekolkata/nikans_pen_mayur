import React, { useState, useEffect } from 'react';
import { 
  Mail, MessageSquare, Phone, User, 
  Trash2, Send, CheckCircle, Clock, 
  MoreVertical, Search, Bell, X, 
  Calendar, ExternalLink, ShieldCheck, MailPlus, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_ENDPOINTS } from '../../config/api';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInq, setSelectedInq] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchInquiries(); }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.ENQUIRIES);
      setInquiries(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.ENQUIRIES}/${selectedInq._id}/reply`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminReply: replyText })
      });
      if (res.ok) {
        setSelectedInq(null);
        setReplyText('');
        fetchInquiries();
      }
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await fetch(`${API_ENDPOINTS.ENQUIRIES}/${id}`, { method: 'DELETE' });
      fetchInquiries();
    } catch (err) { console.error(err); }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API_ENDPOINTS.ENQUIRIES}/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchInquiries();
    } catch (err) { console.error(err); }
  };

  const filtered = inquiries.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Enquiry Intelligence</h1>
          <p style={subtitleStyle}>Respond and manage bulk b2b enquiries with precision.</p>
        </div>
        <div style={searchWrap}>
          <Search size={18} color="#94a3b8" />
          <input style={searchIn} placeholder="Search by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </header>

      {/* STAT CARDS */}
      <div style={statFlex}>
        <div style={statCard}>
          <div style={{ ...iconCircle, background: '#eef2ff', color: '#6366f1' }}><MessageSquare size={20} /></div>
          <div><div style={statVal}>{inquiries.length}</div><div style={statLabel}>Total Inquiries</div></div>
        </div>
        <div style={statCard}>
          <div style={{ ...iconCircle, background: '#fef2f2', color: '#ef4444' }}><Bell size={20} /></div>
          <div><div style={statVal}>{inquiries.filter(i => i.status === 'New').length}</div><div style={statLabel}>New Requests</div></div>
        </div>
        <div style={statCard}>
          <div style={{ ...iconCircle, background: '#ecfdf5', color: '#10b981' }}><CheckCircle size={20} /></div>
          <div><div style={statVal}>{inquiries.filter(i => i.status === 'Responded').length}</div><div style={statLabel}>Responded</div></div>
        </div>
      </div>

      {/* TABLE LIST */}
      <div style={listPanel}>
        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center' }}><Loader2 className="spinning" size={40} color="#d4af37" /></div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={tHead}>
                <th style={th}>CUSTOMER</th>
                <th style={th}>SUBJECT</th>
                <th style={th}>PRODUCT CONTEXT</th>
                <th style={th}>STATUS</th>
                <th style={{ ...th, textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inq, idx) => (
                <motion.tr initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} key={inq._id} style={tr}>
                  <td style={td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={pAvatar}>{inq.name.charAt(0)}</div>
                      <div>
                        <div style={pName}>{inq.name}</div>
                        <div style={pEmail}>{inq.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={td}><div style={pSubject}>{inq.subject || 'No Subject'}</div></td>
                  <td style={td}>
                    {inq.product ? (
                      <div style={prodRef}>
                        <img src={`http://localhost:5000${inq.product.mainImage}`} style={pThumb} />
                        <div><div style={{ fontWeight: '800', fontSize: '0.75rem' }}>{inq.product.name}</div><div style={{ fontSize: '0.65rem', color: '#d4af37' }}>SKU: {inq.product.skuCode}</div></div>
                      </div>
                    ) : <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Global enquiry</span>}
                  </td>
                  <td style={td}>
                    <span style={{ ...badge, ...statusColor[inq.status] }}>{inq.status}</span>
                  </td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                       <button onClick={() => { setSelectedInq(inq); if(inq.status === 'New') updateStatus(inq._id, 'Read'); }} style={actionBtn}><Send size={16} /></button>
                       <button onClick={() => deleteInquiry(inq._id)} style={{ ...actionBtn, color: '#ef4444' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* REPLY MODAL */}
      <AnimatePresence>
        {selectedInq && (
          <div style={modalOverlay}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedInq(null)} style={modalBlur} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} style={sideDrawer}>
               <div style={drawerHead}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={drawerIcon}><MailPlus size={20} /></div>
                    <div><h3 style={{ margin: 0, fontWeight: '900' }}>Inquiry Detail</h3><p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>CRM Tracking Ref: {selectedInq._id.substr(-6)}</p></div>
                  </div>
                  <button onClick={() => setSelectedInq(null)} style={closeBtn}><X size={24} /></button>
               </div>

               <div style={drawerBody}>
                  {/* Info Card */}
                  <div style={infoCard}>
                     <div style={infoGrid}>
                       <div style={infoBox}><div style={infoLbl}>FULL NAME</div><div style={infoVal}>{selectedInq.name}</div></div>
                       <div style={infoBox}><div style={infoLbl}>PHONE</div><div style={infoVal}>{selectedInq.phone}</div></div>
                       <div style={infoBox}><div style={infoLbl}>EMAIL</div><div style={pEmail}>{selectedInq.email}</div></div>
                       <div style={infoBox}><div style={infoLbl}>DATE</div><div style={infoVal}>{new Date(selectedInq.createdAt).toLocaleDateString()}</div></div>
                     </div>
                  </div>

                  {/* Message */}
                  <div style={msgSection}>
                    <h4 style={secH}>MESSAGE FROM CUSTOMER</h4>
                    <div style={msgBubble}>{selectedInq.message}</div>
                  </div>

                  {/* Status Indicator */}
                  {selectedInq.status === 'Responded' && (
                    <div style={respondedTag}>
                      <div style={tagTop}><CheckCircle size={14} /> <span>PREVIOUSLY RESPONDED</span></div>
                      <div style={tagMsg}>{selectedInq.adminReply}</div>
                    </div>
                  )}

                  {/* Reply Section */}
                  <div style={replyWrap}>
                     <h4 style={secH}>{selectedInq.status === 'Responded' ? 'SEND ANOTHER REPLY' : 'COMPOSE REPLY'}</h4>
                     <textarea style={replyArea} placeholder="Type your response to the customer here..." value={replyText} onChange={e => setReplyText(e.target.value)} />
                     <button onClick={handleReply} disabled={submitting} style={sendBtn}>
                        {submitting ? <Loader2 className="spinning" /> : (
                          <><Send size={18} /> SEND RESPONSE</>
                        )}
                     </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap');
        * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spinning { animation: spin 0.8s linear infinite; }
      `}} />
    </div>
  );
};

// CRM STYLES
const containerStyle = { minHeight: '100vh', background: '#f5f7f9', padding: '40px' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const titleStyle = { fontSize: '2.2rem', fontWeight: '900', color: '#1a1f2e', margin: 0 };
const subtitleStyle = { color: '#64748b', margin: '5px 0 0' };
const searchWrap = { display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', padding: '0 15px', borderRadius: '15px' };
const searchIn = { border: 'none', padding: '12px', width: '250px', outline: 'none', fontWeight: '600' };

const statFlex = { display: 'flex', gap: '20px', marginBottom: '40px' };
const statCard = { flex: 1, background: '#fff', padding: '25px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' };
const iconCircle = { width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const statVal = { fontSize: '1.4rem', fontWeight: '900', color: '#1a1f2e' };
const statLabel = { fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' };

const listPanel = { background: '#fff', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tHead = { background: '#f8fafc', borderBottom: '1px solid #f1f5f9' };
const th = { padding: '20px 25px', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '800', letterSpacing: '1px' };
const tr = { borderBottom: '1px solid #f8fafc' };
const td = { padding: '20px 25px' };

const pAvatar = { width: '40px', height: '40px', background: '#1a1f2e', color: '#d4af37', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.1rem' };
const pName = { fontWeight: '800', color: '#1e293b', fontSize: '0.95rem' };
const pEmail = { fontSize: '0.75rem', color: '#6366f1', fontWeight: '700' };
const pSubject = { fontWeight: '600', color: '#64748b', fontSize: '0.85rem' };
const prodRef = { display: 'flex', alignItems: 'center', gap: '10px' };
const pThumb = { width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' };
const badge = { padding: '5px 12px', borderRadius: '50px', fontSize: '0.65rem', fontWeight: '900' };
const actionBtn = { background: '#f8fafc', border: '1px solid #edf2f7', padding: '8px', borderRadius: '10px', cursor: 'pointer', color: '#64748b' };

const statusColor = {
  New: { background: '#fee2e2', color: '#ef4444' },
  Read: { background: '#e0f2fe', color: '#0369a1' },
  Responded: { background: '#ecfdf5', color: '#10b981' }
};

// DRAWER STYLES
const modalOverlay = { position: 'fixed', inset: 0, zIndex: 1000 };
const modalBlur = { position: 'fixed', inset: 0, background: 'rgba(26, 31, 46, 0.4)', backdropFilter: 'blur(8px)' };
const sideDrawer = { position: 'absolute', top: 0, right: 0, height: '100%', width: '500px', background: '#fff', boxShadow: '-20px 0 60px rgba(0,0,0,0.1)', zIndex: 101, display: 'flex', flexDirection: 'column' };
const drawerHead = { padding: '30px 40px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const drawerIcon = { background: '#d4af37', color: '#000', padding: '10px', borderRadius: '12px' };
const closeBtn = { background: 'none', border: 'none', cursor: 'pointer' };

const drawerBody = { flex: 1, padding: '40px', overflowY: 'auto' };
const infoCard = { padding: '25px', background: '#f8fafc', borderRadius: '24px', marginBottom: '30px', border: '1px solid #edf2f7' };
const infoGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const infoBox = { display: 'flex', flexDirection: 'column', gap: '5px' };
const infoLbl = { fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', letterSpacing: '0.5px' };
const infoVal = { fontSize: '0.85rem', fontWeight: '800', color: '#1e293b' };

const msgSection = { marginBottom: '30px' };
const secH = { fontSize: '0.75rem', fontWeight: '900', color: '#1a1f2e', letterSpacing: '1px', marginBottom: '15px' };
const msgBubble = { padding: '20px', background: '#fff', border: '1.5px solid #edf2f7', borderRadius: '0 20px 20px 20px', fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', fontWeight: '500' };

const respondedTag = { padding: '20px', background: '#ecfdf5', borderRadius: '20px', marginBottom: '30px', border: '1px solid #d1fae5' };
const tagTop = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', fontWeight: '900', color: '#059669', marginBottom: '8px' };
const tagMsg = { fontSize: '0.85rem', color: '#065f46', fontWeight: '600' };

const replyWrap = { display: 'flex', flexDirection: 'column', gap: '15px' };
const replyArea = { width: '100%', minHeight: '150px', padding: '20px', border: '2px solid #edf2f7', borderRadius: '20px', outline: 'none', fontSize: '0.9rem', fontWeight: '600', transition: '0.3s' };
const sendBtn = { padding: '20px', background: '#1a1f2e', color: '#fff', border: 'none', borderRadius: '18px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };

export default AdminInquiries;
