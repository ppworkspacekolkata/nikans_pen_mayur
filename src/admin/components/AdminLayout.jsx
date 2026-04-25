import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Layers, ListTree, Package, Mail,
  Settings, Menu, X, Bell, User, LogOut, Camera as ImageIcon, Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, path, active, collapsed }) => (
  <Link to={path} style={{ textDecoration: 'none' }}>
    <motion.div
      whileHover={{ x: 5 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        margin: '4px 12px',
        borderRadius: '8px',
        backgroundColor: active ? 'var(--gold-dim)' : 'transparent',
        color: active ? 'var(--gold)' : 'rgba(255,255,255,0.6)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        gap: '12px', overflow: 'hidden'
      }}
    >
      <Icon size={20} />
      {!collapsed && <span style={{ fontWeight: active ? '700' : '500', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{label}</span>}
    </motion.div>
  </Link>
);

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !token) {
      navigate('/admin/login');
    }
  }, [token, loading, navigate]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Layers, label: 'Categories', path: '/admin/categories' },
    { icon: ListTree, label: 'Sub Categories', path: '/admin/subcategories' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Mail, label: 'Inquiries', path: '/admin/inquiries' },
    { icon: ImageIcon, label: 'Media', path: '/admin/media' },
    { icon: Video, label: 'Videos', path: '/admin/videos' },
    { icon: LayoutDashboard, label: 'Hero Slider', path: '/admin/hero-slider' },
  ];

  const sidebarWidth = collapsed ? '80px' : '260px';

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  if (!token) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f5f7fb', overflow: 'hidden' }}>
      
      {/* Overlay for Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        style={{
          background: '#1a1f2e',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 101,
          left: 0,
          top: 0, bottom: 0,
          position: 'relative',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        className={mobileOpen ? 'sidebar-mobile-open' : 'sidebar-desktop'}
      >
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ minWidth: '40px', height: '40px', background: 'var(--gold)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#000' }}>N</div>
          {!collapsed && <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '1px' }}>NIKAN ADMIN</span>}
        </div>

        <div style={{ flex: 1, marginTop: '20px' }}>
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              {...item}
              active={location.pathname === item.path}
              collapsed={collapsed}
            />
          ))}
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <SidebarItem icon={Settings} label="Settings" path="/admin/settings" active={location.pathname === '/admin/settings'} collapsed={collapsed} />
          <div 
            onClick={logout}
            style={{ 
              display: 'flex', alignItems: 'center', padding: '12px 16px', margin: '4px 12px', 
              cursor: 'pointer', color: '#ff4d4f', gap: '12px', borderRadius: '8px',
              transition: 'background 0.2s'
            }}
            className="logout-hover"
          >
            <LogOut size={20} />
            {!collapsed && <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Logout</span>}
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* Top Header */}
        <header style={{ 
          height: '70px', background: '#fff', display: 'flex', alignItems: 'center', 
          justifyContent: 'space-between', padding: '0 30px', borderBottom: '1px solid #edf2f7' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
              <Menu size={24} />
            </button>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#2d3748', margin: 0 }}>
              {menuItems.find(i => i.path === location.pathname)?.label || (location.pathname === '/admin/settings' ? 'Settings' : 'Admin Panel')}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color="#64748b" />
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', width: '10px', height: '10px', background: '#ff4d4f', borderRadius: '50%', border: '2px solid #fff' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '20px', borderLeft: '1px solid #edf2f7' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{user?.username || 'Admin User'}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Store Manager</div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={20} color="#64748b" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '30px', scrollBehavior: 'smooth' }}>
          {children}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile-open { position: fixed !important; height: 100vh !important; }
        }
        .logout-hover:hover { background: rgba(255, 77, 79, 0.1); }
      `}} />
    </div>
  );
};

export default AdminLayout;
