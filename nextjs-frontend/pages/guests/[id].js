import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Container, Row, Col, Card, Button, Image, Alert, Spinner } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaQrcode, FaArrowLeft, FaCamera } from 'react-icons/fa';
import Layout from '../../components/Layout';
import QRCodeModal from '../../components/QRCodeModal';
import NotificationSettings from '../../components/NotificationSettings';
import NotificationBadge from '../../components/NotificationBadge';
import PhotoDownload from '../../components/PhotoDownload';
import { guestAPI, photoAPI } from '../../lib/api';
import { motion } from 'framer-motion';

const GuestDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [guest, setGuest] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // ดึงข้อมูลผู้ร่วมงาน
        const guestResponse = await guestAPI.getGuestById(id);
        setGuest(guestResponse.data);
        
        // ดึงข้อมูลรูปภาพที่มีผู้ร่วมงานคนนี้
        const photosResponse = await photoAPI.getPhotosByGuest(id);
        setPhotos(photosResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
        setError('ไม่สามารถดึงข้อมูลได้ โปรดลองอีกครั้งในภายหลัง');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleGuestUpdate = (updatedGuest) => {
    setGuest(updatedGuest);
  };
  
  if (loading) {
    return (
      <Layout>
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">กำลังโหลดข้อมูล...</p>
        </Container>
      </Layout>
    );
  }
  
  if (error || !guest) {
    return (
      <Layout>
        <Container className="py-5">
          <Alert variant="danger">{error || 'ไม่พบข้อมูลผู้ร่วมงาน'}</Alert>
          <Button variant="outline-primary" onClick={() => router.push('/')}>
            <FaArrowLeft className="me-2" /> กลับสู่หน้าหลัก
          </Button>
        </Container>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Head>
        <title>ข้อมูลผู้ร่วมงาน - {guest.name}</title>
      </Head>
      
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button variant="outline-primary" onClick={() => router.back()}>
            <FaArrowLeft className="me-2" /> ย้อนกลับ
          </Button>
          
          <div className="d-flex align-items-center">
            <NotificationBadge guestId={guest._id} />
          </div>
        </div>
        
        <Row>
          <Col lg={4} className="mb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-sm guest-profile">
                <div className="text-center">
                  <Image 
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/${guest.faceImagePath}`} 
                    alt={guest.name}
                    className="guest-avatar"
                    roundedCircle
                  />
                  <h3 className="mb-3">{guest.name}</h3>
                  
                  <div className="d-flex justify-content-center mb-4">
                    <Button 
                      variant="outline-primary" 
                      className="d-flex align-items-center"
                      onClick={() => setShowQRModal(true)}
                    >
                      <FaQrcode className="me-2" /> แสดง QR Code
                    </Button>
                  </div>
                  
                  <div className="guest-info text-start">
                    <p className="d-flex align-items-center mb-3">
                      <FaEnvelope className="me-3 text-muted" />
                      {guest.email}
                    </p>
                    {guest.phone && (
                      <p className="d-flex align-items-center mb-3">
                        <FaPhone className="me-3 text-muted" />
                        {guest.phone}
                      </p>
                    )}
                    <p className="d-flex align-items-center">
                      <FaCamera className="me-3 text-muted" />
                      พบในรูปภาพ {photos.length} รูป
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <NotificationSettings guest={guest} onUpdate={handleGuestUpdate} />
            </motion.div>
          </Col>
          
          <Col lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="mb-4">รูปภาพของคุณ ({photos.length})</h4>
              
              {photos.length === 0 ? (
                <Alert variant="info">
                  ยังไม่มีรูปภาพที่มีคุณปรากฏอยู่ในงาน
                </Alert>
              ) : (
                <Row>
                  {photos.map((photo) => (
                    <Col key={photo._id} md={6} className="mb-4">
                      <Card className="border-0 shadow-sm h-100">
                        <Card.Img 
                          variant="top" 
                          src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/${photo.imagePath}`}
                          className="photo-image"
                        />
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              {new Date(photo.uploadedAt).toLocaleDateString('th-TH')}
                            </small>
                            <div>
                              {photo.recognizedGuests.length > 1 && (
                                <span className="badge bg-info me-2">
                                  +{photo.recognizedGuests.length - 1} คน
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-3">
                            <PhotoDownload photo={photo} />
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </motion.div>
          </Col>
        </Row>
      </Container>
      
      <QRCodeModal
        show={showQRModal}
        onHide={() => setShowQRModal(false)}
        guestId={guest._id}
        guestName={guest.name}
      />
    </Layout>
  );
};

export default GuestDetail; 