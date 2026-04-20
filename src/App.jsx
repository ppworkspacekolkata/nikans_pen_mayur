import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home       from './pages/Home';
import AboutUs    from './pages/AboutUs';
import Team       from './pages/Team';
import Brands     from './pages/Brands';
import Products   from './pages/Products';
import Exports    from './pages/Exports';
import Careers    from './pages/Careers';
import Media      from './pages/Media';
import ContactUs  from './pages/ContactUs';
import ProductDetail from './pages/ProductDetail';
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
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
