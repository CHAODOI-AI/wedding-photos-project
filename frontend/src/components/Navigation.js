import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">📸 ระบบภาพงานแต่งงาน</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">หน้าหลัก</Nav.Link>
            <Nav.Link as={Link} to="/register">ลงทะเบียนผู้ร่วมงาน</Nav.Link>
            <Nav.Link as={Link} to="/upload">อัพโหลดรูปภาพ</Nav.Link>
            <Nav.Link as={Link} to="/gallery">แกลเลอรี่</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation; 