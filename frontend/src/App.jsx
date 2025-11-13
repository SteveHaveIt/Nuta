import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
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

const rawApiUrl = import.meta.env.VITE_API_URL;
const API_BASE_URL = rawApiUrl && rawApiUrl.startsWith('http')
  ? rawApiUrl
  : `${window.location.origin}/api`;

console.log('Using API_BASE_URL:', API_BASE_URL);

function App() {
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [flashSale, setFlashSale] = useState(null);
  const [marketingCampaign, setMarketingCampaign] = useState(null);

  // Spin wheel logic
  useEffect(() => {
    if (!sessionStorage.getItem('spinWheelShown')) {
      const timer = setTimeout(() => {
        setShowSpinWheel(true);
        sessionStorage.setItem('spinWheelShown', 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Fetch flash sales
  useEffect(() => {
    if (!API_BASE_URL) return;
    const fetchFlashSales = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/marketing/flash-sales`);
        const data = await res.json();
        if (data.flashSales?.length) setFlashSale(data.flashSales[0]);
      } catch (err) {
        console.error('Error fetching flash sales:', err);
      }
    };
    fetchFlashSales();
  }, []);

  // Fetch marketing campaigns
  useEffect(() => {
    if (!API_BASE_URL) return;
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/marketing/campaigns`);
        const data = await res.json();
        const timedCampaigns = data.campaigns?.filter(c => c.triggerType === 'timed') || [];
        if (timedCampaigns.length > 0) {
          const campaign = timedCampaigns[0];
          if (!sessionStorage.getItem(`campaign_${campaign.id}`)) {
            setTimeout(() => {
              setMarketingCampaign(campaign);
              sessionStorage.setItem(`campaign_${campaign.id}`, 'true');
            }, campaign.triggerDelay || 10000);
          }
        }
      } catch (err) {
        console.error('Error fetching campaigns:', err);
      }
    };
    fetchCampaigns();
  }, []);

  const handleCampaignAction = campaign => {
    if (!API_BASE_URL) return;
    fetch(`${API_BASE_URL}/marketing/campaigns/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId: campaign.id, action: 'clicked' })
    }).catch(err => console.error('Error tracking campaign:', err));

    if (campaign.ctaLink) window.location.href = campaign.ctaLink;
  };

  return (
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

        {/* Marketing Components */}
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
  );
}

export default App;
