import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaCamera, FaBars, FaTimes, FaUserPlus, FaImages, FaHome, FaHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = () => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const navItems = [
    { path: '/', label: 'หน้าหลัก', icon: <FaHome /> },
    { path: '/register', label: 'ลงทะเบียน', icon: <FaUserPlus /> },
    { path: '/upload', label: 'อัพโหลดรูปภาพ', icon: <FaImages /> },
    { path: '/gallery', label: 'แกลเลอรี่', icon: <FaHeart /> },
  ];

  return (
    <Navbar 
      expand="lg" 
      expanded={expanded}
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      fixed="top"
      variant="light"
    >
      <Container>
        <Link href="/" passHref legacyBehavior>
          <Navbar.Brand className="d-flex align-items-center">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
              className="me-2 brand-icon-container"
            >
              <FaCamera size={24} className="brand-icon" />
            </motion.div>
            <span className="brand-text">Wedding Photos AI</span>
          </Navbar.Brand>
        </Link>
        
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setExpanded(expanded ? false : "expanded")}
          className="border-0 shadow-none toggle-btn"
        >
          {expanded ? <FaTimes /> : <FaBars />}
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-100"
            >
              <Nav className="ms-auto align-items-center">
                {navItems.map((item) => (
                  <Link key={item.path} href={item.path} passHref legacyBehavior>
                    <Nav.Link 
                      active={router.pathname === item.path} 
                      onClick={() => setExpanded(false)}
                      className={`nav-item ${router.pathname === item.path ? 'active' : ''}`}
                    >
                      <span className="nav-icon me-1">{item.icon}</span>
                      {item.label}
                    </Nav.Link>
                  </Link>
                ))}
                <Link href="/register" passHref legacyBehavior>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="ms-lg-3 mt-3 mt-lg-0 register-btn"
                    onClick={() => setExpanded(false)}
                  >
                    <FaUserPlus className="me-1" /> เริ่มต้นใช้งาน
                  </Button>
                </Link>
              </Nav>
            </motion.div>
          </AnimatePresence>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation; 