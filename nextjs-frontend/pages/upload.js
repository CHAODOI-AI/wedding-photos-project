import { useState, useCallback, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, ProgressBar, Row, Col } from 'react-bootstrap';
import { FaCloudUploadAlt, FaImage, FaTrash, FaCheck, FaUpload, FaCamera } from 'react-icons/fa';
import { photoAPI, checkAPIStatus } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';

const PhotoUpload = () => {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    // ตรวจสอบว่า API พร้อมใช้งานหรือไม่
    const checkAPI = async () => {
      try {
        const isAvailable = await checkAPIStatus();
        setApiAvailable(isAvailable);
        if (!isAvailable) {
          setError('ไม่สามารถเชื่อมต่อกับ API ได้ กรุณาตรวจสอบว่า Backend Server กำลังทำงานอยู่');
        }
      } catch (err) {
        console.error('Error checking API status:', err);
        setApiAvailable(false);
        setError('ไม่สามารถเชื่อมต่อกับ API ได้ กรุณาตรวจสอบว่า Backend Server กำลังทำงานอยู่');
      }
    };
    
    checkAPI();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      
      // ตรวจสอบว่าไฟล์เป็นรูปภาพหรือไม่
      const validFiles = filesArray.filter(file => file.type.startsWith('image/'));
      
      if (validFiles.length !== filesArray.length) {
        setError(`มีไฟล์บางไฟล์ที่ไม่ใช่รูปภาพ กรุณาเลือกเฉพาะไฟล์รูปภาพเท่านั้น`);
        return;
      }
      
      setSelectedFiles(validFiles);
      setError(''); // ล้างข้อความแจ้งเตือน
      
      // สร้าง URLs สำหรับแสดงตัวอย่าง
      const fileUrls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(fileUrls);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      
      // ตรวจสอบว่าไฟล์เป็นรูปภาพหรือไม่
      const validFiles = filesArray.filter(file => file.type.startsWith('image/'));
      
      if (validFiles.length !== filesArray.length) {
        setError(`มีไฟล์บางไฟล์ที่ไม่ใช่รูปภาพ กรุณาเลือกเฉพาะไฟล์รูปภาพเท่านั้น`);
        return;
      }
      
      setSelectedFiles(validFiles);
      setError(''); // ล้างข้อความแจ้งเตือน
      
      // สร้าง URLs สำหรับแสดงตัวอย่าง
      const fileUrls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(fileUrls);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    const newUrls = [...previewUrls];
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    newFiles.splice(index, 1);
    newUrls.splice(index, 1);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const uploadPhotos = async () => {
    if (selectedFiles.length === 0) {
      setError('กรุณาเลือกรูปภาพอย่างน้อย 1 รูป');
      return;
    }
    
    if (!apiAvailable) {
      setError('ไม่สามารถเชื่อมต่อกับ API ได้ กรุณาตรวจสอบว่า Backend Server กำลังทำงานอยู่');
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    setError('');
    setSuccess(false);
    
    try {
      // อัปโหลดรูปภาพทีละรูป
      for (let i = 0; i < selectedFiles.length; i++) {
        const formData = new FormData();
        formData.append('photo', selectedFiles[i]);
        
        try {
          await photoAPI.uploadPhoto(formData, (progressEvent) => {
            const progress = Math.round(
              ((i + (progressEvent.loaded / progressEvent.total)) / selectedFiles.length) * 100
            );
            setUploadProgress(progress);
          });
        } catch (err) {
          console.error(`Error uploading photo ${i + 1}:`, err);
          throw new Error(`ไม่สามารถอัปโหลดรูปภาพที่ ${i + 1} ได้: ${err.response?.data?.message || err.message}`);
        }
      }
      
      setSuccess(true);
      setSelectedFiles([]);
      setPreviewUrls([]);
      
      // หลังจากอัปโหลดสำเร็จ รอ 2 วินาทีแล้วนำทางไปยังหน้าแกลเลอรี่
      setTimeout(() => {
        router.push('/gallery');
      }, 2000);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
      setUploadProgress(100);
    }
  };

  return (
    <Layout>
      <Head>
        <title>อัพโหลดรูปภาพ | Wedding Photos AI</title>
        <meta name="description" content="อัพโหลดรูปภาพงานแต่งงานเพื่อให้ระบบจดจำใบหน้าผู้ร่วมงานโดยอัตโนมัติ" />
      </Head>
      
      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="text-center mb-5">
                <h2 className="section-title">อัพโหลดรูปภาพงานแต่งงาน</h2>
                <p className="section-subtitle">เลือกรูปภาพจากงานที่ต้องการอัปโหลด ระบบจะจดจำใบหน้าผู้ร่วมงานโดยอัตโนมัติ</p>
              </div>
              
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Alert variant="danger" className="d-flex align-items-center">
                      <div className="me-3">⚠️</div>
                      <div>{error}</div>
                    </Alert>
                  </motion.div>
                )}
                
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Alert variant="success" className="d-flex align-items-center">
                      <div className="me-3"><FaCheck /></div>
                      <div>อัปโหลดรูปภาพสำเร็จ! กำลังนำทางไปยังแกลเลอรี่...</div>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <Card className="mb-5 border-0 shadow">
                <Card.Body className="p-0">
                  <div 
                    className={`upload-container ${isDragging ? 'dragging' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <div className="upload-icon">
                      <FaCloudUploadAlt size={60} />
                    </div>
                    <h4 className="mt-4">ลากและวางรูปภาพที่นี่</h4>
                    <p className="text-muted mb-4">รองรับไฟล์ JPG, PNG และ JPEG</p>
                    <Form.Group>
                      <Form.Control 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleFileChange}
                        className="d-none"
                        id="photoInput"
                      />
                      <Button 
                        variant="primary"
                        onClick={() => document.getElementById('photoInput').click()}
                        className="btn-lg px-4"
                        disabled={!apiAvailable}
                      >
                        <FaCamera className="me-2" /> เลือกรูปภาพ
                      </Button>
                    </Form.Group>
                  </div>
                </Card.Body>
              </Card>
              
              <AnimatePresence>
                {previewUrls.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="border-0 shadow">
                      <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <h4 className="mb-0 fw-bold">รูปภาพที่เลือก <span className="badge bg-primary ms-2">{previewUrls.length}</span></h4>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => {
                              previewUrls.forEach(url => URL.revokeObjectURL(url));
                              setSelectedFiles([]);
                              setPreviewUrls([]);
                            }}
                            disabled={uploading}
                          >
                            ล้างทั้งหมด
                          </Button>
                        </div>
                        
                        <div className="photo-grid">
                          <AnimatePresence>
                            {previewUrls.map((url, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                layout
                                className="photo-item"
                              >
                                <div className="photo-card">
                                  <div className="photo-card-img-container">
                                    <img src={url} alt={`Preview ${index}`} />
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      className="remove-photo-btn"
                                      onClick={() => removeFile(index)}
                                      disabled={uploading}
                                    >
                                      <FaTrash />
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                        
                        {uploading && (
                          <div className="my-4">
                            <div className="d-flex justify-content-between mb-2">
                              <span>กำลังอัปโหลด...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <ProgressBar 
                              now={uploadProgress} 
                              variant="primary" 
                              className="upload-progress" 
                            />
                          </div>
                        )}
                        
                        <div className="d-flex justify-content-end mt-4">
                          <Button
                            variant="primary"
                            size="lg"
                            onClick={uploadPhotos}
                            disabled={previewUrls.length === 0 || uploading || !apiAvailable}
                            className="px-4"
                          >
                            {uploading ? (
                              <>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="me-2"
                                />
                                กำลังอัปโหลด...
                              </>
                            ) : (
                              <>
                                <FaUpload className="me-2" /> อัปโหลดรูปภาพ
                              </>
                            )}
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </Layout>
  );
};

export default PhotoUpload; 