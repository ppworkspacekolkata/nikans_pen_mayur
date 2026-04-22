import React, { useState, useEffect } from 'react';
import { 
  Package, Layers, MessageSquare, TrendingUp, 
  Clock, CheckCircle, AlertCircle, Eye,
  ArrowUpRight, ArrowDownRight, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../../config/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalInquiries: 0,
    newInquiries: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [pRes, cRes, iRes] = await Promise.all([
        fetch(API_ENDPOINTS.PRODUCTS),
        fetch(API_ENDPOINTS.CATEGORIES),
        fetch(API_ENDPOINTS.ENQUIRIES)
      ]);
      const products = await pRes.json();
      const categories = await cRes.json();
      const enquiries = await iRes.json();

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalInquiries: enquiries.length,
        newInquiries: enquiries.filter(i => i.status === 'New').length
      });
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Instruments', value: stats.totalProducts, icon: Package, color: '#6366f1', trend: '+12%' },
    { label: 'Master Categories', value: stats.totalCategories, icon: Layers, color: '#f59e0b', trend: 'Active' },
    { label: 'Total Inquiries', value: stats.totalInquiries, icon: MessageSquare, color: '#10b981', trend: 'Global' },
    { label: 'New Requests', value: stats.newInquiries, icon: Clock, color: '#ef4444', trend: 'Urgent' },
  ];

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}><Loader2 className="spinning" size={40} color="#d4af37" /></div>;

  return (
    <div style={container}>
      <header style={header}>
        <h1 style={title}>Command Centre</h1>
        <p style={subtitle}>Global inventory and communication overview.</p>
      </header>

      {/* STATS GRID */}
      <div style={grid}>
        {statCards.map((card, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            style={cardStyle}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ ...iconBox, background: `${card.color}15`, color: card.color }}>
                <card.icon size={24} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: card.color }}>{card.trend}</span>
            </div>
            <div style={val}>{card.value}</div>
            <div style={lbl}>{card.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={mainRow}>
         <div style={chartPlaceholder}>
            <div style={rowHead}>
               <h3 style={sh}>Inventory Insights</h3>
               <ArrowUpRight size={18} color="#94a3b8" />
            </div>
            <div style={empty}>Visual distribution charts will appear here as stock data grows.</div>
         </div>
         <div style={activityBox}>
            <div style={rowHead}>
               <h3 style={sh}>Recent Activity</h3>
               <TrendingUp size={18} color="#94a3b8" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
               <div style={actItem}>
                  <div style={dot} />
                  <div><div style={at}>New product SKU added</div><div style={ts}>2 hours ago</div></div>
               </div>
               <div style={actItem}>
                  <div style={{ ...dot, background: '#10b981' }} />
                  <div><div style={at}>Bulk enquiry responded</div><div style={ts}>Yesterday</div></div>
               </div>
            </div>
         </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap');
        * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spinning { animation: spin 0.8s linear infinite; }
      `}} />
    </div>
  );
};

const container = { padding: '10px' };
const header = { marginBottom: '40px' };
const title = { fontSize: '2.5rem', fontWeight: '900', color: '#1a1f2e', margin: 0 };
const subtitle = { fontSize: '1rem', color: '#64748b', marginTop: '5px' };

const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '40px' };
const cardStyle = { background: '#fff', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' };
const iconBox = { width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const val = { fontSize: '2rem', fontWeight: '900', color: '#1a1f2e' };
const lbl = { fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginTop: '5px' };

const mainRow = { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' };
const chartPlaceholder = { background: '#fff', borderRadius: '30px', padding: '30px', border: '1px solid #f1f5f9' };
const activityBox = { background: '#fff', borderRadius: '30px', padding: '30px', border: '1px solid #f1f5f9' };
const rowHead = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' };
const sh = { margin: 0, fontSize: '1.1rem', fontWeight: '900' };
const empty = { padding: '50px', textAlign: 'center', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: '600', border: '2px dashed #f1f5f9', borderRadius: '20px' };

const actItem = { display: 'flex', gap: '15px', alignItems: 'center' };
const dot = { width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1' };
const at = { fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' };
const ts = { fontSize: '0.75rem', color: '#94a3b8' };

export default AdminDashboard;
