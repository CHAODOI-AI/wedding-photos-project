const socketIo = require('socket.io');
const nodemailer = require('nodemailer');

// สร้างตัวแปรเก็บการเชื่อมต่อ Socket
let io;

/**
 * ตั้งค่า Socket.IO สำหรับการแจ้งเตือนแบบ real-time
 * @param {Object} server - HTTP Server
 * @returns {Object} Socket.IO instance
 */
const setupSocketIO = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('ผู้ใช้เชื่อมต่อ Socket:', socket.id);

    // เมื่อผู้ใช้ลงทะเบียนห้องแชท
    socket.on('register', (guestId) => {
      socket.join(`guest-${guestId}`);
      console.log(`ผู้ใช้ ${socket.id} ลงทะเบียนห้องแชท guest-${guestId}`);
    });

    // เมื่อผู้ใช้ยกเลิกการเชื่อมต่อ
    socket.on('disconnect', () => {
      console.log('ผู้ใช้ยกเลิกการเชื่อมต่อ:', socket.id);
    });
  });

  return io;
};

/**
 * ส่งการแจ้งเตือนให้กับผู้ร่วมงาน
 * @param {Object} guest - ข้อมูลผู้ร่วมงาน
 * @param {Array} photos - รายการรูปภาพที่พบผู้ร่วมงาน
 */
const sendNotification = async (guest, photos) => {
  try {
    // ส่งการแจ้งเตือนแบบ real-time ผ่าน Socket.IO
    if (io) {
      io.to(`guest-${guest._id}`).emit('new-photos', {
        message: `พบรูปภาพใหม่ของคุณ ${photos.length} รูป`,
        photos: photos.map(photo => ({
          id: photo._id,
          imagePath: photo.imagePath
        }))
      });
      
      console.log(`ส่งการแจ้งเตือนแบบ real-time ให้กับ ${guest.name} สำเร็จ`);
    }
    
    // ส่งการแจ้งเตือนทางอีเมล (จำลองการส่ง)
    console.log(`[จำลอง] ส่งอีเมลแจ้งเตือนไปยัง ${guest.email} สำเร็จ`);
    console.log(`เนื้อหาอีเมล: พบรูปภาพใหม่ของคุณ ${photos.length} รูป`);
    
    // หมายเหตุ: ในสถานการณ์จริง เราจะใช้ Nodemailer เพื่อส่งอีเมล
    // แต่เนื่องจากนี่เป็นเวอร์ชันจำลอง เราจะแค่แสดงข้อความในคอนโซล
    
    return true;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการส่งการแจ้งเตือน:', error);
    return false;
  }
};

module.exports = { setupSocketIO, sendNotification }; 