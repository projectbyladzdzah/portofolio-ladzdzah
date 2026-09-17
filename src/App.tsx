import React, { useState, useEffect } from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { F1Header } from './components/F1Header';
import { DriverHero } from './components/DriverHero';
import { RunningTicker } from './components/RunningTicker';
import { BiographySection } from './components/BiographySection';
import { PortfolioSection } from './components/PortfolioSection';
import { CareerHistory } from './components/CareerHistory';
import { AwardsSection } from './components/AwardsSection';
import { ContactSection } from './components/ContactSection';
import { F1Footer } from './components/F1Footer';
import { ProjectModal } from './components/ProjectModal';
import { CertificateModal } from './components/CertificateModal';
import { AdminPage } from './components/admin/AdminPage';
import { ToastContainer } from './components/admin/ToastContainer';

export const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      const h = window.location.hash.toLowerCase();
      if (p === '/admin' || p === '/admin/' || h === '#admin') {
        return '/admin';
      }
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const p = window.location.pathname.toLowerCase();
      const h = window.location.hash.toLowerCase();
      if (p === '/admin' || p === '/admin/' || h === '#admin') {
        setCurrentPath('/admin');
      } else {
        setCurrentPath(window.location.pathname);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ROUTE 1: Dedicated Admin Control Room Page (/admin)
  if (currentPath === '/admin') {
    return (
      <>
        <AdminPage onNavigateHome={() => navigateTo('/')} />
        <ToastContainer />
      </>
    );
  }

  // ROUTE 2: Clean Public Portfolio View (/)
  return (
    <div className="min-h-screen bg-f1-black text-white selection:bg-f1-red selection:text-white">
      <F1Header />
      <main>
        <DriverHero />
        <RunningTicker />
        <BiographySection />
        <PortfolioSection />
        <CareerHistory />
        <AwardsSection />
        <ContactSection />
      </main>
      <F1Footer />

      {/* Public Modals & Alerts */}
      <ProjectModal />
      <CertificateModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}
