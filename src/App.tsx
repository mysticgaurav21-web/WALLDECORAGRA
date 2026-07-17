/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { MobileBottomNavigation } from './components/MobileBottomNavigation';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailsPage } from './pages/CategoryDetailsPage';
import { SubcategoryListingPage } from './pages/SubcategoryListingPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { SearchPage } from './pages/SearchPage';
import { EnquiryBasketPage } from './pages/EnquiryBasketPage';
import { FreeConsultationPage } from './pages/FreeConsultationPage';
import { ContactPage } from './pages/ContactPage';
import { CalculatorPage } from './calculator/pages/CalculatorPage';
import { ProductVisualizerPage } from './visualizer/pages/ProductVisualizerPage';
import { ComboVisualizerPage } from './visualizer/pages/ComboVisualizerPage';
import { AdminPage } from './pages/AdminPage';


// Scroll to Top on page transition
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-brand-ivory antialiased selection:bg-brand-orange/30 selection:text-brand-navy">
          {/* Header (Desktop + Mobile responsive drawer) */}
          <Header />

          {/* Main content body */}
          <main className="flex-grow pt-4 pb-20 md:pb-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/:categorySlug" element={<CategoryDetailsPage />} />
              <Route path="/categories/:categorySlug/:subcategorySlug" element={<SubcategoryListingPage />} />
              <Route path="/products/:productId" element={<ProductDetailsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/enquiry" element={<EnquiryBasketPage />} />
              <Route path="/consultation" element={<FreeConsultationPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/visualizer" element={<ProductVisualizerPage />} />
              <Route path="/visualizer/product/:productId" element={<ProductVisualizerPage />} />
              <Route path="/visualizer/combo" element={<ComboVisualizerPage />} />
              <Route path="/admin" element={<AdminPage />} />

              {/* Fallback route */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          {/* Universal Footer */}
          <Footer />

          {/* Sticky Mobile bottom navigation */}
          <MobileBottomNavigation />
        </div>
      </Router>
    </AppProvider>
  );
}
