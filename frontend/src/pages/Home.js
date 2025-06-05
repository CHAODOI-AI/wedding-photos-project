import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaCamera, FaImages } from 'react-icons/fa';

const Home = () => {
  return (
    <>
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">บันทึกทุกความทรงจำในงานแต่งงาน</h1>
          <p className="lead">ด้วยเทคโนโลยีการจดจำใบหน้าอัตโนมัติ ที่ช่วยให้แขกผู้มาร่วมงานเข้าถึงภาพถ่ายของตัวเองได้ง่าย</p>
          <Link to="/register">
            <Button variant="primary" size="lg" className="mt-3">ลงทะเบียนเลย</Button>
          </Link>
        </div>
      </div>

      <Container>
        <Row className="text-center mb-4">
          <Col>
            <h2>บริการของเรา</h2>
            <p className="text-muted">ระบบถ่ายรูปภาพงานแต่งงานอัจฉริยะด้วย AI</p>
          </Col>
        </Row>

        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100">
              <Card.Body className="feature-box">
                <div className="feature-icon">
                  <FaUserPlus />
                </div>
                <h4>ลงทะเบียนง่าย</h4>
                <p>ลงทะเบียนผู้ร่วมงานพร้อมถ่ายรูปใบหน้าเพื่อจดจำในระบบ</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="h-100">
              <Card.Body className="feature-box">
                <div className="feature-icon">
                  <FaCamera />
                </div>
                <h4>ถ่ายรูปอัตโนมัติ</h4>
                <p>ช่างภาพถ่ายรูปและอัพโหลดขึ้นระบบโดยระบบจะจดจำใบหน้าโดยอัตโนมัติ</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="h-100">
              <Card.Body className="feature-box">
                <div className="feature-icon">
                  <FaImages />
                </div>
                <h4>เข้าถึงรูปภาพง่าย</h4>
                <p>แขกผู้ร่วมงานสามารถเข้าถึงรูปภาพที่มีตนเองปรากฎอยู่ได้ด้วย QR Code</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5 mb-5">
          <Col className="text-center">
            <h3>เริ่มใช้งานเลย!</h3>
            <p className="mb-4">ลงทะเบียนผู้ร่วมงานและเริ่มจัดเก็บความทรงจำอันล้ำค่า</p>
            <Link to="/register">
              <Button variant="primary" size="lg" className="me-3">ลงทะเบียนผู้ร่วมงาน</Button>
            </Link>
            <Link to="/upload">
              <Button variant="outline-primary" size="lg">อัพโหลดรูปภาพ</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home; 