import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { photoAPI, guestAPI } from '../services/api';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGuest, setSelectedGuest] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // ดึงข้อมูลรูปภาพทั้งหมด
        const photosResponse = await photoAPI.getAllPhotos();
        setPhotos(photosResponse.data);
        
        // ดึงข้อมูลผู้ร่วมงานทั้งหมด
        const guestsResponse = await guestAPI.getAllGuests();
        setGuests(guestsResponse.data);
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + err.message);
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

  return (
    <Container>
      <h2 className="page-title">แกลเลอรี่รูปภาพงานแต่งงาน</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>กรองตามผู้ร่วมงาน</Form.Label>
            <Form.Select 
              value={selectedGuest} 
              onChange={(e) => setSelectedGuest(e.target.value)}
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
          <Form.Group>
            <Form.Label>ค้นหารูปภาพ</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control 
                type="text" 
                placeholder="ค้นหา..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">กำลังโหลด...</span>
          </Spinner>
          <p className="mt-2">กำลังโหลดรูปภาพ...</p>
        </div>
      ) : filteredPhotos.length > 0 ? (
        <div className="photo-grid">
          {filteredPhotos.map(photo => (
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
                    <small>ผู้ร่วมงานในภาพ: </small>
                    <div className="mt-1">
                      {photo.recognizedGuests.map(guest => (
                        <span 
                          key={guest._id} 
                          className="badge bg-light text-dark me-1 mb-1"
                        >
                          {guest.name}
                        </span>
                      ))}
                    </div>
                  </Card.Text>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Alert variant="info">ไม่พบรูปภาพตามเงื่อนไขที่ค้นหา</Alert>
      )}
    </Container>
  );
};

export default PhotoGallery; 