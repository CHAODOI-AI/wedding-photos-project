import React, { useState, useRef } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import Webcam from 'react-webcam';
import axios from 'axios';

const Registration = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [faceImage, setFaceImage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [cameraEnabled, setCameraEnabled] = useState(false);
  
  const webcamRef = useRef(null);

  const enableCamera = () => {
    setCameraEnabled(true);
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setFaceImage(imageSrc);
    setCameraEnabled(false);
  };

  const resetCamera = () => {
    setFaceImage(null);
    setCameraEnabled(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaceImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // แปลงรูปภาพ Base64 เป็น Blob
      const response = await fetch(faceImage);
      const blob = await response.blob();
      const file = new File([blob], "face-image.jpg", { type: "image/jpeg" });
      
      // สร้าง FormData
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('faceImage', file);
      
      // ส่งคำขอลงทะเบียน
      const registerResponse = await axios.post('http://localhost:5000/api/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess(true);
      setQrCode(registerResponse.data.guest.qrCodePath);
      
      // เคลียร์ฟอร์ม
      setName('');
      setEmail('');
      setPhone('');
      setFaceImage(null);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการลงทะเบียน: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2 className="page-title">ลงทะเบียนผู้ร่วมงาน</h2>
      <p className="mb-4">กรุณากรอกข้อมูลและถ่ายรูปใบหน้าเพื่อลงทะเบียน</p>

      {success ? (
        <Card className="p-4 text-center">
          <h3 className="mb-4">ลงทะเบียนสำเร็จ! 🎉</h3>
          <p>ขอบคุณที่ลงทะเบียน คุณ {name}</p>
          
          {qrCode && (
            <div className="my-3">
              <h4>QR Code ของคุณ</h4>
              <img 
                src={`http://localhost:5000${qrCode}`} 
                alt="QR Code" 
                className="qr-code"
              />
              <p className="mt-2">สแกน QR Code นี้เพื่อดูภาพที่มีคุณปรากฏอยู่</p>
            </div>
          )}
          
          <Button 
            variant="primary" 
            onClick={() => {
              setSuccess(false);
              setQrCode('');
            }}
            className="mt-3"
          >
            ลงทะเบียนผู้ร่วมงานคนใหม่
          </Button>
        </Card>
      ) : (
        <Card className="registration-form p-4">
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อ-นามสกุล</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>อีเมล</Form.Label>
                  <Form.Control 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>เบอร์โทรศัพท์</Form.Label>
                  <Form.Control 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>อัพโหลดรูปภาพ</Form.Label>
                  <Form.Control 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                  <Form.Text className="text-muted">
                    หรือใช้กล้องเว็บแคมด้านขวามือเพื่อถ่ายภาพ
                  </Form.Text>
                </Form.Group>
              </Col>
              
              <Col md={6} className="d-flex flex-column align-items-center">
                {faceImage ? (
                  <>
                    <img 
                      src={faceImage} 
                      alt="Face Preview" 
                      className="face-preview mb-3" 
                    />
                    <Button 
                      variant="outline-secondary" 
                      onClick={resetCamera}
                      className="mb-3"
                    >
                      ถ่ายภาพใหม่
                    </Button>
                  </>
                ) : cameraEnabled ? (
                  <>
                    <div className="webcam-container">
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="webcam-video"
                      />
                    </div>
                    <Button 
                      variant="primary" 
                      onClick={capturePhoto}
                      className="mt-2"
                    >
                      ถ่ายภาพ
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="primary" 
                    onClick={enableCamera}
                    className="mt-4"
                  >
                    เปิดกล้อง
                  </Button>
                )}
              </Col>
            </Row>
            
            <div className="text-center mt-4">
              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                disabled={loading || !faceImage}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="ms-2">กำลังลงทะเบียน...</span>
                  </>
                ) : "ลงทะเบียน"}
              </Button>
            </div>
          </Form>
        </Card>
      )}
    </Container>
  );
};

export default Registration; 