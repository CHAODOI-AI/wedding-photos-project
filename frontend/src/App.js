import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// นำเข้าคอมโพเนนต์
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// นำเข้าหน้า
import Home from './pages/Home';
import Registration from './pages/Registration';
import PhotoUpload from './pages/PhotoUpload';
import PhotoGallery from './pages/PhotoGallery';
import GuestPage from './pages/GuestPage';

function App() {
  return (
    <div className="App">
      <Navigation />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/upload" element={<PhotoUpload />} />
          <Route path="/gallery" element={<PhotoGallery />} />
          <Route path="/guests/:guestId" element={<GuestPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;