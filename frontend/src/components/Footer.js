import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col className="text-center py-3">
            &copy; {currentYear} ระบบถ่ายรูปภาพงานแต่งงาน | ทุกใบหน้าที่มีความสุขร่วมกัน
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 