import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart, FaCamera } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="py-4">
          <Col lg={4} md={6} className="mb-4 mb-md-0">
            <div className="d-flex align-items-center mb-3">
              <FaCamera size={24} className="me-2" />
              <h5 className="mb-0 text-white">Wedding Photos AI</h5>
            </div>
            <p className="text-white-50 mb-3">
              บริการถ่ายรูปงานแต่งงานอัจฉริยะด้วยเทคโนโลยี AI จดจำใบหน้า
              ช่วยให้แขกผู้ร่วมงานเข้าถึงภาพถ่ายของตัวเองได้ง่ายดาย
            </p>
          </Col>
          
          <Col lg={2} md={6} className="mb-4 mb-md-0">
            <h5>เมนูหลัก</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link href="/" className="footer-link">หน้าหลัก</Link>
              </li>
              <li className="mb-2">
                <Link href="/register" className="footer-link">ลงทะเบียน</Link>
              </li>
              <li className="mb-2">
                <Link href="/upload" className="footer-link">อัพโหลดรูปภาพ</Link>
              </li>
              <li className="mb-2">
                <Link href="/gallery" className="footer-link">แกลเลอรี่</Link>
              </li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5>บริการ</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link href="#" className="footer-link">จดจำใบหน้าอัตโนมัติ</Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="footer-link">QR Code สำหรับแขก</Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="footer-link">แจ้งเตือนรูปภาพใหม่</Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="footer-link">ดาวน์โหลดรูปคุณภาพสูง</Link>
              </li>
            </ul>
          </Col>
          
          <Col lg={3} md={6}>
            <h5>ติดต่อเรา</h5>
            <p className="text-white-50 mb-2">
              อีเมล: contact@weddingphotosai.com
            </p>
            <p className="text-white-50 mb-3">
              โทร: 02-123-4567
            </p>
            <div className="d-flex">
              <a href="#" className="me-3 social-icon">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="me-3 social-icon">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="me-3 social-icon">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="social-icon">
                <FaLinkedin size={20} />
              </a>
            </div>
          </Col>
        </Row>
        
        <hr className="footer-divider" />
        
        <div className="text-center py-3">
          <p className="mb-0 text-white-50">
            © {new Date().getFullYear()} Wedding Photos AI | พัฒนาด้วย <FaHeart className="mx-1 text-danger" size={12} /> โดย AI Team
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer; 