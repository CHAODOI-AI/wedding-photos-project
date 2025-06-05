import { Modal, Button } from 'react-bootstrap';
import { FaQrcode, FaDownload, FaShare } from 'react-icons/fa';
import { motion } from 'framer-motion';

const QRCodeModal = ({ show, onHide, qrCodeUrl, guestName }) => {
  // ฟังก์ชันสำหรับดาวน์โหลด QR Code
  const downloadQRCode = () => {
    // สร้าง link สำหรับดาวน์โหลดรูปภาพ
    const link = document.createElement('a');
    link.href = `http://localhost:5000${qrCodeUrl}`;
    link.download = `qrcode-${guestName.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ฟังก์ชันสำหรับแชร์ QR Code (ใช้ Web Share API ถ้าเบราว์เซอร์รองรับ)
  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Code ของ ${guestName}`,
          text: 'สแกน QR Code นี้เพื่อดูรูปภาพของคุณในงานแต่งงาน',
          url: window.location.origin + `/qr/${encodeURIComponent(qrCodeUrl)}`
        });
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการแชร์:', error);
      }
    } else {
      // ถ้าเบราว์เซอร์ไม่รองรับ Web Share API ให้คัดลอก URL ลงคลิปบอร์ด
      const url = window.location.origin + `/qr/${encodeURIComponent(qrCodeUrl)}`;
      navigator.clipboard.writeText(url);
      alert('คัดลอก URL ไปยังคลิปบอร์ดแล้ว');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>QR Code ของคุณ</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="qr-code-container mb-4">
            <img 
              src={`http://localhost:5000${qrCodeUrl}`} 
              alt="QR Code" 
              className="qr-code-image"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <div className="qr-icon">
              <FaQrcode size={30} />
            </div>
          </div>
          
          <p className="mb-4">
            สแกน QR Code นี้เพื่อดูรูปภาพที่มีคุณ {guestName} ปรากฏอยู่
          </p>
          
          <div className="d-flex justify-content-center gap-3">
            <Button 
              variant="outline-primary" 
              onClick={downloadQRCode}
              className="d-flex align-items-center"
            >
              <FaDownload className="me-2" /> ดาวน์โหลด
            </Button>
            <Button 
              variant="outline-success" 
              onClick={shareQRCode}
              className="d-flex align-items-center"
            >
              <FaShare className="me-2" /> แชร์
            </Button>
          </div>
        </motion.div>
      </Modal.Body>
    </Modal>
  );
};

export default QRCodeModal; 