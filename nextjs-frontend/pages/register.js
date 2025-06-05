import { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import { guestAPI } from '../lib/api';
import { FaCamera, FaUserPlus, FaRedo, FaQrcode, FaCheck, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import QRCodeModal from '../components/QRCodeModal';
import Layout from '../components/Layout';
import Head from 'next/head';

// นำเข้า Webcam แบบ dynamic เพื่อหลีกเลี่ยงปัญหา SSR
const Webcam = dynamic(() => import('react-webcam'), { 
  ssr: false,
  loading: () => <div className="webcam-loading">กำลังโหลดกล้อง...</div> 
});

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
  const [isBrowser, setIsBrowser] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [showQRModal, setShowQRModal] = useState(false);
  const [registeredName, setRegisteredName] = useState('');
  const [cameraError, setCameraError] = useState('');
  
  const webcamRef = useRef(null);

  // ตรวจสอบว่าอยู่ใน browser
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const enableCamera = () => {
    setCameraEnabled(true);
    setCameraError('');
  };

  const capturePhoto = () => {
    try {
      if (webcamRef.current && typeof webcamRef.current.getScreenshot === 'function') {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          setFaceImage(imageSrc);
          setCameraEnabled(false);
          setCameraError('');
        } else {
          setCameraError('ไม่สามารถถ่ายภาพได้ กรุณาลองใหม่อีกครั้ง');
        }
      } else {
        setCameraError('กล้องยังไม่พร้อมใช้งาน กรุณารอสักครู่หรือลองรีเฟรชหน้าเว็บ');
      }
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('เกิดข้อผิดพลาดในการใช้งานกล้อง: ' + err.message);
    }
  };

  const resetCamera = () => {
    setFaceImage(null);
    setCameraEnabled(true);
    setCameraError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaceImage(reader.result);
        setCameraError('');
      };
      reader.onerror = () => {
        setCameraError('ไม่สามารถอ่านไฟล์ได้ กรุณาลองใหม่อีกครั้ง');
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    setFormStep(2);
  };

  const prevStep = () => {
    setFormStep(1);
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
      const registerResponse = await guestAPI.register(formData);
      
      setSuccess(true);
      setQrCode(registerResponse.data.guest.qrCodePath);
      setRegisteredName(name);
      
      // เคลียร์ฟอร์ม
      setName('');
      setEmail('');
      setPhone('');
      setFaceImage(null);
      setFormStep(1);
      
      // แสดง QR Code Modal
      setShowQRModal(true);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการลงทะเบียน: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>ลงทะเบียนผู้ร่วมงาน | Wedding Photos AI</title>
        <meta name="description" content="ลงทะเบียนเพื่อเข้าร่วมงานแต่งงานและรับรูปภาพผ่านระบบจดจำใบหน้าอัตโนมัติ" />
      </Head>
      
      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <div className="text-center mb-5">
                <h2 className="section-title">ลงทะเบียนผู้ร่วมงาน</h2>
                <p className="section-subtitle">กรอกข้อมูลและถ่ายรูปใบหน้าเพื่อลงทะเบียนเข้าร่วมงาน</p>
              </div>

              {success && !showQRModal ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="success-card border-0 shadow p-4 text-center">
                    <div className="success-icon mb-4">
                      <FaCheck size={40} className="text-success" />
                    </div>
                    <h3 className="mb-4">ลงทะเบียนสำเร็จ! 🎉</h3>
                    <p>ขอบคุณที่ลงทะเบียน คุณ {registeredName}</p>
                    
                    <div className="d-flex flex-column flex-md-row justify-content-center mt-4 gap-3">
                      <Button 
                        variant="outline-primary" 
                        onClick={() => setShowQRModal(true)}
                        className="btn-lg px-4"
                      >
                        <FaQrcode className="me-2" /> แสดง QR Code
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={() => {
                          setSuccess(false);
                          setQrCode('');
                        }}
                        className="btn-lg px-4"
                      >
                        <FaUserPlus className="me-2" /> ลงทะเบียนเพิ่มเติม
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <Card className="registration-form border-0 shadow">
                  <Card.Header className="bg-white p-4 border-0">
                    <div className="d-flex justify-content-between">
                      <div className="step-indicator">
                        <div className={`step-circle ${formStep >= 1 ? 'active' : ''}`}>1</div>
                        <div className="step-text">ข้อมูลส่วนตัว</div>
                      </div>
                      <div className="step-line"></div>
                      <div className="step-indicator">
                        <div className={`step-circle ${formStep >= 2 ? 'active' : ''}`}>2</div>
                        <div className="step-text">ถ่ายรูปใบหน้า</div>
                      </div>
                    </div>
                  </Card.Header>
                  
                  <Card.Body className="p-4">
                    {error && (
                      <Alert variant="danger" className="d-flex align-items-center">
                        <div className="me-3">⚠️</div>
                        <div>{error}</div>
                      </Alert>
                    )}
                    
                    <Form onSubmit={handleSubmit}>
                      {formStep === 1 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Form.Group className="mb-4">
                            <Form.Label>ชื่อ-นามสกุล</Form.Label>
                            <Form.Control 
                              type="text" 
                              value={name} 
                              onChange={(e) => setName(e.target.value)} 
                              required 
                              placeholder="กรุณากรอกชื่อ-นามสกุล"
                              className="form-control-lg"
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-4">
                            <Form.Label>อีเมล</Form.Label>
                            <Form.Control 
                              type="email" 
                              value={email} 
                              onChange={(e) => setEmail(e.target.value)} 
                              required
                              placeholder="กรุณากรอกอีเมล"
                              className="form-control-lg"
                            />
                            <Form.Text className="text-muted">
                              เราจะใช้อีเมลนี้ในการส่งรูปภาพให้คุณ
                            </Form.Text>
                          </Form.Group>
                          
                          <Form.Group className="mb-4">
                            <Form.Label>เบอร์โทรศัพท์</Form.Label>
                            <Form.Control 
                              type="tel" 
                              value={phone} 
                              onChange={(e) => setPhone(e.target.value)} 
                              required
                              placeholder="กรุณากรอกเบอร์โทรศัพท์"
                              className="form-control-lg"
                            />
                          </Form.Group>
                          
                          <div className="d-flex justify-content-end">
                            <Button 
                              variant="primary" 
                              onClick={nextStep}
                              className="btn-lg px-4"
                              disabled={!name || !email || !phone}
                            >
                              ถัดไป <FaArrowRight className="ms-2" />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                      
                      {formStep === 2 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="face-capture-container mb-4">
                            {cameraError && (
                              <Alert variant="warning" className="mb-3">
                                {cameraError}
                              </Alert>
                            )}
                            
                            {!faceImage && !cameraEnabled && (
                              <div className="camera-placeholder">
                                <div className="camera-icon">
                                  <FaCamera size={40} />
                                </div>
                                <p>กรุณาถ่ายรูปใบหน้าหรืออัพโหลดรูปภาพ</p>
                                <div className="mt-3">
                                  <Button 
                                    variant="primary" 
                                    onClick={enableCamera}
                                    className="me-2"
                                  >
                                    <FaCamera className="me-2" /> เปิดกล้อง
                                  </Button>
                                  <Form.Group className="d-inline-block">
                                    <Form.Label htmlFor="fileInput" className="btn btn-outline-primary mb-0">
                                      อัพโหลดรูปภาพ
                                    </Form.Label>
                                    <Form.Control
                                      id="fileInput"
                                      type="file"
                                      accept="image/*"
                                      onChange={handleFileChange}
                                      className="d-none"
                                    />
                                  </Form.Group>
                                </div>
                              </div>
                            )}
                            
                            {cameraEnabled && isBrowser && (
                              <div className="webcam-container">
                                <div className="webcam-overlay">
                                  <div className="face-outline"></div>
                                </div>
                                <Webcam
                                  audio={false}
                                  ref={webcamRef}
                                  screenshotFormat="image/jpeg"
                                  videoConstraints={{
                                    width: 480,
                                    height: 480,
                                    facingMode: "user"
                                  }}
                                  className="webcam"
                                  onUserMediaError={(err) => {
                                    console.error('Webcam error:', err);
                                    setCameraError('ไม่สามารถเข้าถึงกล้องได้: ' + err.message);
                                    setCameraEnabled(false);
                                  }}
                                />
                                <Button 
                                  variant="primary" 
                                  onClick={capturePhoto}
                                  className="capture-btn"
                                >
                                  <FaCamera className="me-2" /> ถ่ายรูป
                                </Button>
                              </div>
                            )}
                            
                            {faceImage && (
                              <div className="face-preview">
                                <img 
                                  src={faceImage} 
                                  alt="Face Preview" 
                                  className="face-image"
                                />
                                <Button 
                                  variant="outline-secondary" 
                                  onClick={resetCamera}
                                  className="mt-3"
                                >
                                  <FaRedo className="me-2" /> ถ่ายใหม่
                                </Button>
                              </div>
                            )}
                          </div>
                          
                          <div className="d-flex justify-content-between">
                            <Button 
                              variant="outline-secondary" 
                              onClick={prevStep}
                            >
                              <FaArrowLeft className="me-2" /> ย้อนกลับ
                            </Button>
                            
                            <Button 
                              variant="primary" 
                              type="submit"
                              className="btn-lg px-4"
                              disabled={!faceImage || loading}
                            >
                              {loading ? (
                                <>
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                  />
                                  กำลังลงทะเบียน...
                                </>
                              ) : (
                                <>
                                  ลงทะเบียน <FaUserPlus className="ms-2" />
                                </>
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </Form>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </motion.div>
      </Container>
      
      <QRCodeModal
        show={showQRModal}
        onHide={() => setShowQRModal(false)}
        qrCode={qrCode}
        guestName={registeredName}
      />
    </Layout>
  );
};

export default Registration; 