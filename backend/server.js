const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const qrcode = require('qrcode');
const http = require('http');
const notification = require('./notification');
const memoryDB = require('./db-memory'); // เพิ่มการนำเข้าโมดูลฐานข้อมูลจำลอง

// โหลดค่าจากไฟล์ .env
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = notification.setupSocketIO(server);
const PORT = process.env.PORT || 5000;

// กำหนด Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads')); // เพิ่มเส้นทางสำหรับเข้าถึงรูปภาพ

// สร้างโฟลเดอร์สำหรับเก็บรูปภาพ
const uploadsDir = path.join(__dirname, 'uploads');
const registrationDir = path.join(uploadsDir, 'registrations');
const eventsDir = path.join(uploadsDir, 'events');
const highResDir = path.join(uploadsDir, 'high-res');
const publicDir = path.join(__dirname, 'public');
const qrCodeDir = path.join(publicDir, 'qrcodes');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(registrationDir)) {
  fs.mkdirSync(registrationDir);
}
if (!fs.existsSync(eventsDir)) {
  fs.mkdirSync(eventsDir);
}
if (!fs.existsSync(highResDir)) {
  fs.mkdirSync(highResDir);
}
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}
if (!fs.existsSync(qrCodeDir)) {
  fs.mkdirSync(qrCodeDir, { recursive: true });
}

// กำหนดการเก็บไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ตรวจสอบว่าเป็นการอัปโหลดรูปลงทะเบียนหรือรูปงาน
    if (req.path.includes('register')) {
      cb(null, registrationDir);
    } else if (req.path.includes('high-res')) {
      cb(null, highResDir);
    } else {
      cb(null, eventsDir);
    }
  },
  filename: (req, file, cb) => {
    // สร้างชื่อไฟล์พร้อมวันที่และเวลา
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// โมเดลข้อมูลผู้ร่วมงาน
const GuestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  faceImagePath: { type: String, required: true },
  faceDescriptor: { type: Array }, // เพิ่มฟิลด์สำหรับเก็บค่า descriptor ของใบหน้า
  qrCodePath: { type: String },
  registeredAt: { type: Date, default: Date.now },
  notificationEnabled: { type: Boolean, default: true }
});

const Guest = mongoose.model('Guest', GuestSchema);

// โมเดลข้อมูลรูปถ่ายงาน
const PhotoSchema = new mongoose.Schema({
  imagePath: { type: String, required: true },
  highResPath: { type: String },
  uploadedAt: { type: Date, default: Date.now },
  recognizedGuests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Guest' }],
  notificationSent: { type: Boolean, default: false }
});

const Photo = mongoose.model('Photo', PhotoSchema);

// เชื่อมต่อกับฐานข้อมูล MongoDB จำลอง
async function startServer() {
  try {
    // เชื่อมต่อกับฐานข้อมูลจำลอง
    await memoryDB.connect();
    
    // เริ่มการทำงานของเซิร์ฟเวอร์
    server.listen(PORT, () => {
      console.log(`เซิร์ฟเวอร์กำลังทำงานที่พอร์ต ${PORT}`);
    });
    
    // จัดการเมื่อปิดเซิร์ฟเวอร์
    process.on('SIGINT', async () => {
      await memoryDB.closeDatabase();
      process.exit(0);
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการเริ่มต้นเซิร์ฟเวอร์:', error);
    process.exit(1);
  }
}

// API สำหรับตรวจสอบสถานะเซิร์ฟเวอร์
app.get('/', (req, res) => {
  res.json({ message: 'ยินดีต้อนรับสู่ API ระบบถ่ายรูปงานแต่งงาน' });
});

// API สำหรับลงทะเบียนผู้ร่วมงาน
app.post('/api/register', upload.single('faceImage'), async (req, res) => {
  try {
    const { name, email, phone, notificationEnabled = true } = req.body;
    const faceImagePath = req.file ? req.file.path : null;
    
    if (!faceImagePath) {
      return res.status(400).json({ message: 'กรุณาอัปโหลดรูปภาพใบหน้า' });
    }

    // สร้าง QR Code
    const qrCodeFileName = `${Date.now()}.png`;
    const qrCodePath = path.join(qrCodeDir, qrCodeFileName);
    const qrCodeData = JSON.stringify({ name, email, date: Date.now() });
    
    await qrcode.toFile(qrCodePath, qrCodeData);
    const qrCodeUrl = `/qrcodes/${qrCodeFileName}`;

    // บันทึกข้อมูลผู้ร่วมงาน (ไม่มีการสกัดลักษณะเฉพาะของใบหน้า)
    const guest = new Guest({
      name,
      email,
      phone,
      faceImagePath,
      faceDescriptor: null, // ไม่มีการสกัดลักษณะเฉพาะของใบหน้า
      qrCodePath: qrCodeUrl,
      notificationEnabled: notificationEnabled === 'true' || notificationEnabled === true
    });

    await guest.save();
    res.status(201).json({ message: 'ลงทะเบียนสำเร็จ', guest });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลงทะเบียน:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน', error: error.message });
  }
});

// API สำหรับอัปโหลดรูปภาพจากงาน
app.post('/api/photos/upload', upload.single('photo'), async (req, res) => {
  try {
    const imagePath = req.file ? req.file.path : null;
    
    if (!imagePath) {
      return res.status(400).json({ message: 'กรุณาอัปโหลดรูปภาพ' });
    }
    
    // บันทึกข้อมูลรูปภาพ
    const photo = new Photo({
      imagePath,
      recognizedGuests: [] // เริ่มต้นด้วยรายการว่าง
    });

    await photo.save();
    
    // ในเวอร์ชันจำลอง เราจะไม่มีการตรวจจับใบหน้า
    res.status(201).json({ 
      message: 'อัปโหลดรูปภาพสำเร็จ', 
      photo,
      recognizedFaces: 0
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ', error: error.message });
  }
});

// API สำหรับอัปโหลดรูปภาพคุณภาพสูง
app.post('/api/photos/:id/high-res', upload.single('highResPhoto'), async (req, res) => {
  try {
    const { id } = req.params;
    const highResPath = req.file ? req.file.path : null;
    
    if (!highResPath) {
      return res.status(400).json({ message: 'กรุณาอัปโหลดรูปภาพคุณภาพสูง' });
    }
    
    // ค้นหาและอัปเดตรูปภาพ
    const photo = await Photo.findById(id);
    
    if (!photo) {
      return res.status(404).json({ message: 'ไม่พบรูปภาพ' });
    }
    
    photo.highResPath = highResPath;
    await photo.save();
    
    res.status(200).json({ 
      message: 'อัปโหลดรูปภาพคุณภาพสูงสำเร็จ', 
      photo
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพคุณภาพสูง:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพคุณภาพสูง', error: error.message });
  }
});

// API สำหรับดาวน์โหลดรูปภาพคุณภาพสูง
app.get('/api/photos/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findById(id);
    
    if (!photo) {
      return res.status(404).json({ message: 'ไม่พบรูปภาพ' });
    }
    
    // ตรวจสอบว่ามีรูปภาพคุณภาพสูงหรือไม่
    const filePath = photo.highResPath || photo.imagePath;
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'ไม่พบไฟล์รูปภาพ' });
    }
    
    res.download(filePath);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดาวน์โหลดรูปภาพ:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดาวน์โหลดรูปภาพ', error: error.message });
  }
});

// API สำหรับดึงข้อมูลผู้ร่วมงานทั้งหมด
app.get('/api/guests', async (req, res) => {
  try {
    const guests = await Guest.find();
    res.status(200).json(guests);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ร่วมงาน:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ร่วมงาน', error: error.message });
  }
});

// API สำหรับดึงข้อมูลผู้ร่วมงานตาม ID
app.get('/api/guests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const guest = await Guest.findById(id);
    
    if (!guest) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ร่วมงาน' });
    }
    
    res.status(200).json(guest);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ร่วมงาน:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ร่วมงาน', error: error.message });
  }
});

// API สำหรับดึงข้อมูลผู้ร่วมงานจาก QR Code
app.get('/api/guests/qrcode/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const guest = await Guest.findOne({ qrCodePath: `/qrcodes/${code}` });
    
    if (!guest) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ร่วมงาน' });
    }
    
    res.status(200).json(guest);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ร่วมงาน:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ร่วมงาน', error: error.message });
  }
});

// API สำหรับอัปเดตการตั้งค่าการแจ้งเตือน
app.put('/api/guests/:id/notification', async (req, res) => {
  try {
    const { id } = req.params;
    const { notificationEnabled } = req.body;
    
    const guest = await Guest.findById(id);
    
    if (!guest) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ร่วมงาน' });
    }
    
    guest.notificationEnabled = notificationEnabled;
    await guest.save();
    
    res.status(200).json({ message: 'อัปเดตการตั้งค่าการแจ้งเตือนสำเร็จ', guest });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปเดตการตั้งค่าการแจ้งเตือน:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตการตั้งค่าการแจ้งเตือน', error: error.message });
  }
});

// API สำหรับดึงข้อมูลรูปภาพทั้งหมด
app.get('/api/photos', async (req, res) => {
  try {
    const { guest } = req.query;
    let query = {};
    
    if (guest) {
      query.recognizedGuests = guest;
    }
    
    const photos = await Photo.find(query).populate('recognizedGuests');
    res.status(200).json(photos);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลรูปภาพ:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรูปภาพ', error: error.message });
  }
});

// API สำหรับดึงข้อมูลรูปภาพตาม ID
app.get('/api/photos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findById(id).populate('recognizedGuests');
    
    if (!photo) {
      return res.status(404).json({ message: 'ไม่พบรูปภาพ' });
    }
    
    res.status(200).json(photo);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลรูปภาพ:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรูปภาพ', error: error.message });
  }
});

// เริ่มการทำงานของเซิร์ฟเวอร์
startServer(); 