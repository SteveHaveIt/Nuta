import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from './utils/trpc';
import { trpcClient } from './lib/trpcClient';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PromotionsPage from './pages/PromotionsPage';
import SpinWheel from './components/SpinWheel';
import FlashSaleBanner from './components/FlashSaleBanner';
import MarketingPopup from './components/MarketingPopup';

// Use the robust API URL logic from the trpcClient file
const API_BASE_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;

const queryClient = new QueryClient();

function App() {
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [flashSale, setFlashSale] = useState(null);
  const [marketingCampaign, setMarketingCampaign] = useState(null);

  // Spin wheel logic
  useEffect(() => {
    const spinWheelShown = sessionStorage.getItem('spinWheelShown');
    if (!spinWheelShown) {
      const timer = setTimeout(() => {
        setShowSpinWheel(true);
        sessionStorage.setItem('spinWheelShown', 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Fetch flash sales
  useEffect(() => {
    const fetchFlashSales = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/marketing/flash-sales`);
        const data = await response.json();
        if (data.flashSales && data.flashSales.length > 0) {
          setFlashSale(data.flashSales[0]);
        }
      } catch (error) {
        console.error('Error fetching flash sales:', error);
      }
    };

    fetchFlashSales();
  }, []);

  // Fetch marketing campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/marketing/campaigns`);
        const data = await response.json();
        if (data.campaigns && data.campaigns.length > 0) {
          const timedCampaigns = data.campaigns.filter(c => c.triggerType === 'timed');
          if (timedCampaigns.length > 0) {
            const campaign = timedCampaigns[0];
            const campaignShown = sessionStorage.getItem(`campaign_${campaign.id}`);
            if (!campaignShown) {
              setTimeout(() => {
                setMarketingCampaign(campaign);
                sessionStorage.setItem(`campaign_${campaign.id}`, 'true');
              }, campaign.triggerDelay || 10000);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };

    fetchCampaigns();
  }, []);

  const handleCampaignAction = (campaign) => {
    fetch(`${API_BASE_URL}/marketing/campaigns/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId: campaign.id, action: 'clicked' })
    });

    if (campaign.ctaLink) {
      window.location.href = campaign.ctaLink;
    }
  };

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen flex flex-col">
            {flashSale && <FlashSaleBanner flashSale={flashSale} />}
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:slug" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/promotions" element={<PromotionsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </main>
            <Footer />
            
            <SpinWheel isOpen={showSpinWheel} onClose={() => setShowSpinWheel(false)} />
            {marketingCampaign && (
              <MarketingPopup
                campaign={marketingCampaign}
                onClose={() => setMarketingCampaign(null)}
                onAction={handleCampaignAction}
              />
            )}
          </div>
        </Router>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
