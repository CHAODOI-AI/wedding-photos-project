import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Link from 'next/link';
import { FaUserPlus, FaCamera, FaImages, FaArrowRight, FaCheckCircle, FaMobileAlt, FaQrcode, FaBell } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function Home() {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <Layout>
      <Head>
        <title>Wedding Photos AI | ระบบถ่ายรูปภาพงานแต่งงานอัจฉริยะ</title>
        <meta name="description" content="ระบบถ่ายรูปภาพงานแต่งงานพร้อมระบบจดจำใบหน้า ช่วยให้แขกผู้ร่วมงานเข้าถึงภาพถ่ายของตัวเองได้ง่าย" />
      </Head>
      
      <section className="hero-section" style={{backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("/images/wedding-hero.jpg")'}}>
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            บันทึกทุกความทรงจำในงานแต่งงาน
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            ด้วยเทคโนโลยีการจดจำใบหน้าอัตโนมัติ ที่ช่วยให้แขกผู้มาร่วมงานเข้าถึงภาพถ่ายของตัวเองได้ง่าย
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hero-buttons"
          >
            <Link href="/register" passHref>
              <Button variant="primary" size="lg" className="hero-btn me-3">
                ลงทะเบียนเลย <FaArrowRight className="ms-2" />
              </Button>
            </Link>
            <Link href="/gallery" passHref>
              <Button variant="outline-light" size="lg" className="hero-btn">
                ดูแกลเลอรี่ <FaImages className="ms-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Container>
        {/* How it works section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="text-center mb-5 pt-5"
        >
          <motion.h2 
            className="section-title"
            variants={fadeInUp}
          >
            วิธีการทำงาน
          </motion.h2>
          <motion.p 
            className="section-subtitle mb-5"
            variants={fadeInUp}
          >
            เพียง 3 ขั้นตอนง่ายๆ เพื่อจัดเก็บและแชร์ภาพงานแต่งงานอย่างอัจฉริยะ
          </motion.p>
          
          <Row className="g-4">
            <Col md={4}>
              <motion.div variants={fadeInUp}>
                <div className="how-it-works-card">
                  <div className="step-number">1</div>
                  <div className="step-icon">
                    <FaUserPlus />
                  </div>
                  <h4 className="mt-4">ลงทะเบียนผู้ร่วมงาน</h4>
                  <p className="text-muted">ลงทะเบียนพร้อมถ่ายภาพใบหน้าก่อนเข้างาน เพื่อให้ระบบจดจำได้</p>
                </div>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div variants={fadeInUp}>
                <div className="how-it-works-card">
                  <div className="step-number">2</div>
                  <div className="step-icon">
                    <FaCamera />
                  </div>
                  <h4 className="mt-4">ถ่ายภาพในงาน</h4>
                  <p className="text-muted">ช่างภาพถ่ายรูปและอัพโหลดเข้าระบบ AI จะจดจำใบหน้าโดยอัตโนมัติ</p>
                </div>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div variants={fadeInUp}>
                <div className="how-it-works-card">
                  <div className="step-number">3</div>
                  <div className="step-icon">
                    <FaQrcode />
                  </div>
                  <h4 className="mt-4">รับชมภาพผ่าน QR Code</h4>
                  <p className="text-muted">ผู้ร่วมงานสแกน QR Code เพื่อดูภาพของตนเองได้ทันที</p>
                </div>
              </motion.div>
            </Col>
          </Row>
        </motion.div>

        {/* Features section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="my-5 py-5"
        >
          <motion.div 
            className="text-center mb-5"
            variants={fadeInUp}
          >
            <h2 className="section-title">บริการของเรา</h2>
            <p className="section-subtitle">ระบบถ่ายรูปภาพงานแต่งงานอัจฉริยะด้วย AI</p>
          </motion.div>

          <Row className="g-4">
            <Col lg={4} md={6}>
              <motion.div variants={fadeInUp}>
                <Card className="feature-card h-100">
                  <Card.Body>
                    <div className="feature-icon">
                      <FaUserPlus />
                    </div>
                    <h4>ลงทะเบียนง่าย</h4>
                    <p className="text-muted">ลงทะเบียนผู้ร่วมงานพร้อมถ่ายรูปใบหน้าเพื่อจดจำในระบบ</p>
                    <Link href="/register" passHref>
                      <Button variant="link" className="feature-link">
                        ลงทะเบียนเลย <FaArrowRight className="ms-1" size={12} />
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            <Col lg={4} md={6}>
              <motion.div variants={fadeInUp}>
                <Card className="feature-card h-100">
                  <Card.Body>
                    <div className="feature-icon">
                      <FaCamera />
                    </div>
                    <h4>จดจำใบหน้าอัตโนมัติ</h4>
                    <p className="text-muted">ระบบ AI จดจำใบหน้าผู้ร่วมงานในรูปภาพได้อย่างแม่นยำ</p>
                    <Link href="/upload" passHref>
                      <Button variant="link" className="feature-link">
                        อัพโหลดรูปภาพ <FaArrowRight className="ms-1" size={12} />
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            <Col lg={4} md={6} className="mx-auto">
              <motion.div variants={fadeInUp}>
                <Card className="feature-card h-100">
                  <Card.Body>
                    <div className="feature-icon">
                      <FaBell />
                    </div>
                    <h4>แจ้งเตือนอัตโนมัติ</h4>
                    <p className="text-muted">ผู้ร่วมงานจะได้รับการแจ้งเตือนเมื่อมีรูปภาพใหม่ที่มีตนเองปรากฏอยู่</p>
                    <Link href="/gallery" passHref>
                      <Button variant="link" className="feature-link">
                        ดูแกลเลอรี่ <FaArrowRight className="ms-1" size={12} />
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.div>

        {/* Benefits section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="my-5 py-5"
        >
          <Row className="align-items-center">
            <Col lg={6}>
              <motion.div variants={fadeInUp}>
                <h2 className="section-title mb-4">ประโยชน์ที่คุณจะได้รับ</h2>
                <ul className="benefits-list">
                  <li>
                    <FaCheckCircle className="text-primary me-2" />
                    <span>ประหยัดเวลาในการค้นหารูปภาพ</span>
                  </li>
                  <li>
                    <FaCheckCircle className="text-primary me-2" />
                    <span>ระบบจดจำใบหน้าอัตโนมัติด้วย AI</span>
                  </li>
                  <li>
                    <FaCheckCircle className="text-primary me-2" />
                    <span>แขกสามารถเข้าถึงรูปภาพของตนเองได้ทันที</span>
                  </li>
                  <li>
                    <FaCheckCircle className="text-primary me-2" />
                    <span>ลดการสูญหายของรูปภาพ</span>
                  </li>
                  <li>
                    <FaCheckCircle className="text-primary me-2" />
                    <span>เพิ่มความประทับใจให้กับผู้ร่วมงาน</span>
                  </li>
                  <li>
                    <FaCheckCircle className="text-primary me-2" />
                    <span>ดาวน์โหลดรูปภาพคุณภาพสูงได้ง่าย</span>
                  </li>
                </ul>
                <Link href="/register" passHref>
                  <Button variant="primary" className="mt-3">
                    เริ่มต้นใช้งานเลย <FaArrowRight className="ms-2" />
                  </Button>
                </Link>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div 
                variants={fadeInUp}
                className="benefits-image-container"
              >
                <div className="benefits-image-wrapper">
                  <img 
                    src="/images/wedding-benefits.jpg" 
                    alt="Wedding Benefits" 
                    className="benefits-image"
                  />
                </div>
              </motion.div>
            </Col>
          </Row>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="cta-section my-5"
        >
          <div className="text-center">
            <h3>พร้อมที่จะเริ่มต้นใช้งานแล้วหรือยัง?</h3>
            <p className="mb-4">
              ลงทะเบียนเพื่อใช้งานระบบถ่ายรูปงานแต่งงานอัจฉริยะของเรา
            </p>
            <Link href="/register" passHref>
              <Button variant="light" size="lg" className="px-4 py-2">
                ลงทะเบียนเลย <FaArrowRight className="ms-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </Layout>
  );
} 