import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { photoAPI, guestAPI } from '../services/api';

const GuestPage = () => {
  const { guestId } = useParams();
  const [guest, setGuest] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // ดึงข้อมูลผู้ร่วมงาน
        const guestResponse = await guestAPI.getGuestById(guestId);
        setGuest(guestResponse.data);
        
        // ดึงรูปภาพที่มีผู้ร่วมงานคนนี้อยู่
        const photosResponse = await photoAPI.getPhotosByGuest(guestId);
        setPhotos(photosResponse.data);
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (guestId) {
      fetchData();
    }
  }, [guestId]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">กำลังโหลด...</span>
        </Spinner>
        <p className="mt-2">กำลังโหลดข้อมูล...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
        <Link to="/gallery">
          <Button variant="primary">กลับไปยังแกลเลอรี่</Button>
        </Link>
      </Container>
    );
  }

  if (!guest) {
    return (
      <Container className="my-5">
        <Alert variant="warning">ไม่พบข้อมูลผู้ร่วมงาน</Alert>
        <Link to="/gallery">
          <Button variant="primary">กลับไปยังแกลเลอรี่</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Link to="/gallery" className="btn btn-outline-primary mb-3">
            &larr; กลับไปยังแกลเลอรี่
          </Link>
          
          <Card className="guest-card">
            <Row>
              <Col md={3} className="text-center">
                <img 
                  src={`http://localhost:5000/${guest.faceImagePath.replace(/\\/g, '/')}`} 
                  alt={guest.name} 
                  className="guest-image img-fluid mb-3 mb-md-0" 
                />
              </Col>
              <Col md={9}>
                <h2>{guest.name}</h2>
                <p className="text-muted">{guest.email}</p>
                {guest.phone && <p className="text-muted">โทรศัพท์: {guest.phone}</p>}
                <p>ลงทะเบียนเมื่อ: {new Date(guest.registeredAt).toLocaleDateString('th-TH')}</p>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <h3 className="mb-4">รูปภาพของ {guest.name}</h3>
      
      {photos.length > 0 ? (
        <div className="photo-grid">
          {photos.map(photo => (
            <Card key={photo._id} className="photo-card">
              <Card.Img 
                variant="top" 
                src={`http://localhost:5000/${photo.imagePath.replace(/\\/g, '/')}`} 
                alt="Wedding Photo" 
              />
              <Card.Body>
                <Card.Title className="small text-muted">
                  {new Date(photo.uploadedAt).toLocaleDateString('th-TH')}
                </Card.Title>
                {photo.recognizedGuests && photo.recognizedGuests.length > 0 && (
                  <Card.Text>
                    <small>ผู้ร่วมงานอื่นในภาพ: </small>
                    <div className="mt-1">
                      {photo.recognizedGuests
                        .filter(g => g._id !== guestId)
                        .map(g => (
                          <Link 
                            key={g._id} 
                            to={`/guests/${g._id}`}
                            className="badge bg-light text-dark me-1 mb-1 text-decoration-none"
                          >
                            {g.name}
                          </Link>
                        ))
                      }
                    </div>
                  </Card.Text>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Alert variant="info">ยังไม่มีรูปภาพที่มี {guest.name} ปรากฏอยู่</Alert>
      )}
    </Container>
  );
};

export default GuestPage; 