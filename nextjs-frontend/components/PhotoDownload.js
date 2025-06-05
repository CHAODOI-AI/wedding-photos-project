import { useState } from 'react';
import { Button, Modal, Spinner, Form } from 'react-bootstrap';
import { FaDownload, FaUpload, FaCheck } from 'react-icons/fa';
import { photoAPI } from '../lib/api';
import { motion } from 'framer-motion';

const PhotoDownload = ({ photo }) => {
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setShowModal(false);
    setSelectedFile(null);
    setUploadProgress(0);
    setError('');
  };

  const handleShow = () => setShowModal(true);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadHighRes = async () => {
    if (!selectedFile) return;
    
    try {
      setUploading(true);
      setUploadProgress(0);
      setError('');
      
      const formData = new FormData();
      formData.append('highResPhoto', selectedFile);
      
      await photoAPI.uploadHighResPhoto(photo._id, formData, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        setUploadProgress(progress);
      });
      
      setSuccess(true);
      
      // ซ่อน modal หลังจาก 2 วินาที
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพคุณภาพสูง: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = () => {
    photoAPI.downloadPhoto(photo._id);
  };

  const hasHighRes = photo && photo.highResPath;

  return (
    <>
      <Button 
        variant={hasHighRes ? 'primary' : 'outline-primary'} 
        onClick={hasHighRes ? handleDownload : handleShow}
        className="d-flex align-items-center"
      >
        <FaDownload className="me-2" /> {hasHighRes ? 'ดาวน์โหลดรูปภาพคุณภาพสูง' : 'อัปโหลดรูปภาพคุณภาพสูง'}
      </Button>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>อัปโหลดรูปภาพคุณภาพสูง</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="success-icon mb-3">
                <FaCheck size={30} className="text-success" />
              </div>
              <h5>อัปโหลดสำเร็จ!</h5>
              <p className="text-muted">รูปภาพคุณภาพสูงถูกอัปโหลดเรียบร้อยแล้ว</p>
            </motion.div>
          ) : (
            <>
              <p>อัปโหลดรูปภาพคุณภาพสูงเพื่อให้ผู้ร่วมงานสามารถดาวน์โหลดได้</p>
              
              <Form.Group className="mb-3">
                <Form.Label>เลือกรูปภาพ</Form.Label>
                <Form.Control 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <Form.Text className="text-muted">
                  แนะนำให้ใช้รูปภาพที่มีความละเอียดสูง (1920x1080 พิกเซลขึ้นไป)
                </Form.Text>
              </Form.Group>
              
              {uploading && (
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>กำลังอัปโหลด...</small>
                    <small>{uploadProgress}%</small>
                  </div>
                  <div className="progress">
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${uploadProgress}%` }} 
                      aria-valuenow={uploadProgress} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}
            </>
          )}
        </Modal.Body>
        {!success && (
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} disabled={uploading}>
              ยกเลิก
            </Button>
            <Button 
              variant="primary" 
              onClick={handleUploadHighRes} 
              disabled={!selectedFile || uploading}
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
                  <span>กำลังอัปโหลด...</span>
                </>
              ) : (
                <>
                  <FaUpload className="me-2" /> อัปโหลด
                </>
              )}
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
};

export default PhotoDownload; 