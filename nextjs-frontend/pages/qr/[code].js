import { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaQrcode, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { photoAPI, guestAPI } from '../../lib/api';

const QRCodePage = () => {
  const router = useRouter();
  const { code } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [guest, setGuest] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!code) return;
      
      try {
        setLoading(true);
        
        // ดึงข้อมูลผู้ร่วมงานจาก QR Code
        const guestResponse = await guestAPI.getGuestByQRCode(code);
        setGuest(guestResponse.data);
        
        // ดึงรูปภาพที่มีผู้ร่วมงานคนนี้อยู่
        const photosResponse = await photoAPI.getPhotosByGuest(guestResponse.data._id);
        setPhotos(photosResponse.data);
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [code]);

  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <div className="loader">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">กำลังโหลด...</span>
          </Spinner>
          <p className="mt-3 text-muted">กำลังโหลดข้อมูล...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
        <Link href="/" passHref>
          <Button variant="primary">กลับไปยังหน้าหลัก</Button>
        </Link>
      </Container>
    );
  }

  if (!guest) {
    return (
      <Container className="my-5">
        <Alert variant="warning">ไม่พบข้อมูลผู้ร่วมงานจาก QR Code นี้</Alert>
        <Link href="/" passHref>
          <Button variant="primary">กลับไปยังหน้าหลัก</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/" passHref>
          <Button variant="link" className="mb-4 p-0 text-decoration-none">
            <FaArrowLeft className="me-2" /> กลับไปยังหน้าหลัก
          </Button>
        </Link>
        
        <Card className="border-0 shadow-sm mb-5">
          <Card.Body className="p-4">
            <div className="d-flex align-items-center mb-4">
              <div className="qr-icon-bg me-3">
                <FaQrcode size={30} />
              </div>
              <div>
                <h2 className="mb-1">รูปภาพของ {guest.name}</h2>
                <p className="text-muted mb-0">รูปภาพทั้งหมดที่มีคุณปรากฏอยู่</p>
              </div>
            </div>
            
            {photos.length > 0 ? (
              <div className="photo-grid">
                {photos.map(photo => (
                  <motion.div 
                    key={photo._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="photo-card">
                      <div className="photo-card-img-container">
                        <Card.Img 
                          variant="top" 
                          src={`http://localhost:5000/${photo.imagePath.replace(/\\/g, '/')}`} 
                          alt="Wedding Photo" 
                        />
                      </div>
                      <Card.Footer className="text-center">
                        <small className="text-muted">
                          {new Date(photo.uploadedAt).toLocaleDateString('th-TH')}
                        </small>
                      </Card.Footer>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Alert variant="info">
                ยังไม่มีรูปภาพที่มีคุณ {guest.name} ปรากฏอยู่
              </Alert>
            )}
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default QRCodePage; 