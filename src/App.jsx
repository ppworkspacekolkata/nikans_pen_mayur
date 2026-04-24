import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Home       from './pages/Home';
import AboutUs    from './pages/AboutUs';
import Team       from './pages/Team';
import Brands     from './pages/Brands';
import Products   from './pages/Products';
import Exports    from './pages/Exports';
import Careers    from './pages/Careers';
import Media      from './pages/Media';
import MediaDetail from './pages/MediaDetail';
import ContactUs  from './pages/ContactUs';
import ProductDetail from './pages/ProductDetail';
import WhatsAppButton from './components/WhatsAppButton';
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/pages/Dashboard';
import AdminCategories from './admin/pages/Categories';
import AdminSubCategories from './admin/pages/SubCategories';
import AdminProducts from './admin/pages/Products';
import AdminInquiries from './admin/pages/Inquiries';
import AdminMedia from './admin/pages/Media';
import AdminLogin from './admin/pages/Login';
import AdminSettings from './admin/pages/Settings';
import AdminHeroSlider from './admin/pages/HeroSlider';
import './index.css';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/"        element={<Home />}      />
          <Route path="/about"   element={<AboutUs />}   />
          <Route path="/team"    element={<Team />}      />
          <Route path="/brands"  element={<Brands />}    />
          <Route path="/products"element={<Products />}  />
          <Route path="/exports" element={<Exports />}   />
          <Route path="/careers" element={<Careers />}   />
          <Route path="/media"   element={<Media />}     />
          <Route path="/media/:id" element={<MediaDetail />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/categories" element={<AdminLayout><AdminCategories /></AdminLayout>} />
          <Route path="/admin/subcategories" element={<AdminLayout><AdminSubCategories /></AdminLayout>} />
          <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
          <Route path="/admin/inquiries" element={<AdminLayout><AdminInquiries /></AdminLayout>} />
          <Route path="/admin/media" element={<AdminLayout><AdminMedia /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
          <Route path="/admin/hero-slider" element={<AdminLayout><AdminHeroSlider /></AdminLayout>} />
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AnimatedRoutes />
        <WhatsAppButton />
      </AuthProvider>
    </BrowserRouter>
  );
}
