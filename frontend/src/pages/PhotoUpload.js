import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import { FaCloudUploadAlt } from 'react-icons/fa';
import axios from 'axios';

const PhotoUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      
      // สร้าง URLs สำหรับแสดงตัวอย่าง
      const fileUrls = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(fileUrls);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles(filesArray);
      
      // สร้าง URLs สำหรับแสดงตัวอย่าง
      const fileUrls = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(fileUrls);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const uploadPhotos = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    setError('');
    setSuccess(false);
    
    try {
      // อัปโหลดรูปภาพทีละรูป
      for (let i = 0; i < selectedFiles.length; i++) {
        const formData = new FormData();
        formData.append('photo', selectedFiles[i]);
        
        await axios.post('http://localhost:5000/api/photos/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              ((i + (progressEvent.loaded / progressEvent.total)) / selectedFiles.length) * 100
            );
            setUploadProgress(progress);
          }
        });
      }
      
      setSuccess(true);
      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
      setUploadProgress(100);
    }
  };

  return (
    <Container>
      <h2 className="page-title">อัพโหลดรูปภาพงานแต่งงาน</h2>
      <p className="mb-4">เลือกรูปภาพจากงานที่ต้องการอัปโหลด ระบบจะจดจำใบหน้าผู้ร่วมงานโดยอัตโนมัติ</p>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">อัปโหลดรูปภาพสำเร็จ!</Alert>}
      
      <Card className="mb-4">
        <Card.Body>
          <div 
            className="upload-container"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <FaCloudUploadAlt size={50} className="mb-3 text-primary" />
            <h4>ลากและวางรูปภาพที่นี่</h4>
            <p>หรือ</p>
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
                variant="outline-primary"
                onClick={() => document.getElementById('photoInput').click()}
              >
                เลือกรูปภาพ
              </Button>
            </Form.Group>
          </div>
        </Card.Body>
      </Card>
      
      {previewUrls.length > 0 && (
        <>
          <h4 className="mb-3">รูปภาพที่เลือก ({previewUrls.length})</h4>
          <div className="photo-grid">
            {previewUrls.map((url, index) => (
              <Card key={index} className="photo-card">
                <Card.Img variant="top" src={url} alt={`Preview ${index}`} />
                <Card.Footer className="text-center">
                  {selectedFiles[index]?.name}
                </Card.Footer>
              </Card>
            ))}
          </div>
          
          <div className="mt-4">
            {uploading && (
              <ProgressBar 
                now={uploadProgress} 
                label={`${uploadProgress}%`} 
                className="mb-3" 
              />
            )}
            
            <Button 
              variant="primary" 
              size="lg" 
              onClick={uploadPhotos}
              disabled={uploading}
              className="w-100"
            >
              {uploading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="ms-2">กำลังอัปโหลด...</span>
                </>
              ) : "อัปโหลดรูปภาพ"}
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default PhotoUpload; 