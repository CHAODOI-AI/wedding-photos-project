import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navigation from './Navigation';
import Footer from './Footer';

const Layout = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // จัดการการโหลดหน้าเว็บ
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <div className="main-layout">
      <Navigation />
      
      {loading ? (
        <div className="page-loader">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">กำลังโหลด...</span>
          </div>
        </div>
      ) : (
        <main>
        {children}
      </main>
      )}
      
      <Footer />
    </div>
  );
};

export default Layout; 