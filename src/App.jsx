import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'

// Layout
import Header from './components/Header'
import Footer from './components/Footer'
import FloatingNotice from './components/FloatingNotice'
import AudioControls from './components/AudioControls'
import MerchDiscountCode from './components/MerchDiscountCode'
import ManagedPageBlocks from './components/ManagedPageBlocks'
import { EditorBridgeReady } from './components/EditableField'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Content from './pages/Content'
import Community from './pages/Community'
import Merch from './pages/Merch'
import {
  MerchCheckoutCancelled,
  MerchCheckoutSuccess,
  PayPalCheckoutReturn,
} from './pages/MerchCheckoutResult'
import TrackOrder from './pages/TrackOrder'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import DynamicPage from './pages/DynamicPage'

// Global Styles
import './styles/theme.css'
import './styles/core.css'
import './styles/responsive.css'
import './styles/ksj-editor.css'
import './styles/managed-site-settings.css'
import './styles/managed-page-blocks.css'
import './styles/dynamic-page.css'

// Page Styles
import './styles/home.css'
import './styles/about.css'
import './styles/content.css'
import './styles/community.css'
import './styles/community-live.css'
import './styles/merch.css'
import './styles/merch-polish.css'
import './styles/merch-final-fixes.css'
import './styles/merch-checkout.css'
import './styles/merch-discount.css'
import './styles/contact.css'
import './styles/legal.css'
import './styles/mobile-audit.css'
import './styles/home-mobile.css'
import './styles/remaining-pages-mobile.css'

function ManagedPage({ children }) {
  return <>{children}<ManagedPageBlocks /></>
}

function App() {
  return (
    <BrowserRouter>
      <EditorBridgeReady />
      <Header />

      <div className="site-content">
        <Routes>
          <Route path="/" element={<ManagedPage><Home /></ManagedPage>} />
          <Route path="/about" element={<ManagedPage><About /></ManagedPage>} />
          <Route path="/content" element={<ManagedPage><Content /></ManagedPage>} />
          <Route path="/community" element={<ManagedPage><Community /></ManagedPage>} />
          <Route path="/merch" element={<ManagedPage><Merch /></ManagedPage>} />
          <Route path="/merch/success" element={<MerchCheckoutSuccess />} />
          <Route path="/merch/cancelled" element={<MerchCheckoutCancelled />} />
          <Route path="/merch/paypal-return" element={<PayPalCheckoutReturn />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/contact" element={<ManagedPage><Contact /></ManagedPage>} />
          <Route path="/privacy" element={<ManagedPage><Privacy /></ManagedPage>} />
          <Route path="/terms" element={<ManagedPage><Terms /></ManagedPage>} />
          <Route path="/:pageSlug" element={<ManagedPage><DynamicPage /></ManagedPage>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <MerchDiscountCode />
      <Footer />
      <FloatingNotice />
      <AudioControls />
    </BrowserRouter>
  )
}

export default App
