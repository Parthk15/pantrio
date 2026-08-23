import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BackendStatusBanner from '@/components/layout/BackendStatusBanner'
import PageTransition from '@/components/layout/PageTransition'
import Home from '@/pages/Home'
import Scan from '@/pages/Scan'
import Inventory from '@/pages/Inventory'
import Recipes from '@/pages/Recipes'
import NotFound from '@/pages/NotFound'

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col grain-texture">
      <BackendStatusBanner />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/scan" element={<PageTransition><Scan /></PageTransition>} />
            <Route path="/inventory" element={<PageTransition><Inventory /></PageTransition>} />
            <Route path="/recipes" element={<PageTransition><Recipes /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
