import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Form, InputGroup, Button, Modal } from 'react-bootstrap';
import { FaSearch, FaFilter, FaDownload, FaShare, FaEye, FaTimes, FaHeart, FaImage } from 'react-icons/fa';
import { photoAPI, guestAPI } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import Head from 'next/head';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGuest, setSelectedGuest] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState('');

  useEffect(() => {
    // กำหนดค่า API Base URL
    setApiBaseUrl(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000');
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // ดึงข้อมูลรูปภาพทั้งหมด
        const photosResponse = await photoAPI.getAllPhotos();
        console.log('Photos data:', photosResponse.data);
        setPhotos(photosResponse.data);
        
        // ดึงข้อมูลผู้ร่วมงานทั้งหมด
        const guestsResponse = await guestAPI.getAllGuests();
        setGuests(guestsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // กรองรูปภาพตามผู้ร่วมงานที่เลือก
  const filteredPhotos = photos.filter(photo => {
    // กรองตามผู้ร่วมงาน
    if (selectedGuest && photo.recognizedGuests) {
      if (!photo.recognizedGuests.some(guest => guest._id === selectedGuest)) {
        return false;
      }
    }
    
    // กรองตามการค้นหา (ถ้ามี)
    if (searchQuery) {
      // ในสถานการณ์จริง คุณอาจต้องค้นหาจากข้อมูลอื่น ๆ เช่น คำอธิบายรูปภาพ
      return photo.imagePath.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };

  const closePhotoModal = () => {
    setShowPhotoModal(false);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setSelectedGuest('');
    setSearchQuery('');
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // ตรวจสอบว่า imagePath เป็น URL เต็มหรือไม่
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // ถ้าเป็น path แบบสัมพัทธ์ ให้เพิ่ม API base URL
    return `${apiBaseUrl}/${imagePath.replace(/^\//, '')}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <Layout>
      <Head>
        <title>แกลเลอรี่รูปภาพ | Wedding Photos AI</title>
        <meta name="description" content="ชมรูปภาพงานแต่งงานที่มีคุณปรากฏอยู่ผ่านระบบจดจำใบหน้าอัตโนมัติ" />
      </Head>
      
      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-5">
            <h2 className="section-title">แกลเลอรี่รูปภาพงานแต่งงาน</h2>
            <p className="section-subtitle">ภาพความทรงจำอันล้ำค่าจากงานแต่งงาน</p>
          </div>
          
          {error && (
            <Alert variant="danger" className="d-flex align-items-center">
              <div className="me-3">⚠️</div>
              <div>{error}</div>
            </Alert>
          )}
          
          <Card className="mb-4 border-0 shadow">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-bold">ค้นหาและกรองรูปภาพ</h5>
                <Button 
                  variant="link" 
                  className="p-0 text-decoration-none filter-toggle" 
                  onClick={toggleFilters}
                >
                  <FaFilter className="me-1" /> {showFilters ? 'ซ่อนตัวกรอง' : 'แสดงตัวกรอง'}
                </Button>
              </div>
              
              <Row>
                <Col md={12}>
                  <InputGroup className="mb-3 search-input">
                    <InputGroup.Text className="bg-white border-end-0">
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control 
                      type="text" 
                      placeholder="ค้นหารูปภาพ..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-start-0 ps-0 form-control-lg"
                    />
                    {(searchQuery || selectedGuest) && (
                      <Button 
                        variant="outline-secondary" 
                        onClick={clearFilters}
                        className="clear-btn"
                      >
                        <FaTimes />
                      </Button>
                    )}
                  </InputGroup>
                </Col>
              </Row>
              
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="filter-container"
                  >
                    <Row className="mt-3">
                      <Col md={6} className="mb-3 mb-md-0">
                        <Form.Group>
                          <Form.Label className="fw-bold">กรองตามผู้ร่วมงาน</Form.Label>
                          <Form.Select 
                            value={selectedGuest} 
                            onChange={(e) => setSelectedGuest(e.target.value)}
                            className="form-select-lg"
                          >
                            <option value="">ทั้งหมด</option>
                            {guests.map(guest => (
                              <option key={guest._id} value={guest._id}>
                                {guest.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex h-100 align-items-end">
                          <div className="gallery-stats">
                            <div className="d-flex align-items-center">
                              <div className="stats-icon">
                                <FaImage />
                              </div>
                              <div>
                                <div className="stats-value">{filteredPhotos.length}</div>
                                <div className="stats-label">รูปภาพที่แสดง</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card.Body>
          </Card>
          
          {loading ? (
            <div className="text-center my-5 py-5">
              <div className="loader">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">กำลังโหลด...</span>
                </Spinner>
              </div>
              <p className="mt-3 text-muted">กำลังโหลดรูปภาพ...</p>
            </div>
          ) : filteredPhotos.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="photo-gallery-grid"
            >
              {filteredPhotos.map(photo => (
                <motion.div
                  key={photo._id}
                  variants={itemVariants}
                  className="gallery-item"
                >
                  <div className="gallery-photo-card">
                    <div 
                      className="gallery-photo-img-container"
                      onClick={() => openPhotoModal(photo)}
                    >
                      <img 
                        src={getImageUrl(photo.imagePath)} 
                        alt="Wedding Photo" 
                        className="gallery-photo-img"
                        onError={(e) => {
                          console.error('Image load error:', e);
                          e.target.src = '/images/photo-placeholder.jpg';
                          e.target.alt = 'รูปภาพไม่สามารถโหลดได้';
                        }}
                      />
                      <div className="gallery-photo-overlay">
                        <div className="gallery-action-btn">
                          <FaEye />
                        </div>
                      </div>
                    </div>
                    
                    {photo.recognizedGuests && photo.recognizedGuests.length > 0 && (
                      <div className="guests-tags">
                        {photo.recognizedGuests.slice(0, 3).map(guest => (
                          <span key={guest._id} className="guest-tag">
                            {guest.name.split(' ')[0]}
                          </span>
                        ))}
                        {photo.recognizedGuests.length > 3 && (
                          <span className="guest-tag guest-tag-more">
                            +{photo.recognizedGuests.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center my-5 py-5">
              <div className="empty-state">
                <FaImage size={50} className="text-muted mb-3" />
                <h4>ไม่พบรูปภาพ</h4>
                <p className="text-muted">
                  ไม่พบรูปภาพที่ตรงกับเงื่อนไขการค้นหา กรุณาลองค้นหาด้วยคำค้นอื่น
                </p>
                {(searchQuery || selectedGuest) && (
                  <Button 
                    variant="outline-primary" 
                    onClick={clearFilters}
                    className="mt-3"
                  >
                    ล้างตัวกรอง
                  </Button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </Container>
      
      {/* Photo Modal */}
      <Modal 
        show={showPhotoModal} 
        onHide={closePhotoModal}
        centered
        size="lg"
        className="photo-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>รูปภาพงานแต่งงาน</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedPhoto && (
            <div className="photo-modal-content">
              <img 
                src={getImageUrl(selectedPhoto.imagePath)} 
                alt="Wedding Photo" 
                className="photo-modal-img"
                onError={(e) => {
                  e.target.src = '/images/photo-placeholder.jpg';
                  e.target.alt = 'รูปภาพไม่สามารถโหลดได้';
                }}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            <div>
              {selectedPhoto && selectedPhoto.recognizedGuests && (
                <div className="guests-tags">
                  <span className="me-2 fw-bold">ผู้ร่วมงานในภาพ:</span>
                  {selectedPhoto.recognizedGuests.map(guest => (
                    <span key={guest._id} className="guest-tag">
                      {guest.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Button variant="outline-primary" className="me-2">
                <FaShare className="me-2" /> แชร์
              </Button>
              <Button variant="primary">
                <FaDownload className="me-2" /> ดาวน์โหลด
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default PhotoGallery; 