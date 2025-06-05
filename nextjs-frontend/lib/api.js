import axios from 'axios';

// กำหนดค่า API URL โดยใช้ค่าจาก environment variable หรือค่าเริ่มต้น
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// สร้าง instance ของ axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // เพิ่ม timeout เพื่อป้องกันการรอนานเกินไป
  timeout: 30000,
});

// เพิ่ม interceptors เพื่อจัดการข้อผิดพลาด
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API สำหรับผู้ร่วมงาน
export const guestAPI = {
  // ลงทะเบียนผู้ร่วมงาน
  register: (formData) => {
    return apiClient.post('/guests/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // ดึงข้อมูลผู้ร่วมงานทั้งหมด
  getAllGuests: () => {
    return apiClient.get('/guests');
  },
  
  // ดึงข้อมูลผู้ร่วมงานตาม ID
  getGuestById: (id) => {
    return apiClient.get(`/guests/${id}`);
  },
  
  // ดึงข้อมูล QR Code ของผู้ร่วมงาน
  getGuestQRCode: (id) => {
    return apiClient.get(`/guests/${id}/qrcode`);
  },
  
  // ดึงข้อมูลผู้ร่วมงานจาก QR Code
  getGuestByQRCode: (code) => {
    return apiClient.get(`/guests/qrcode/${code}`);
  },
  
  // อัปเดตการตั้งค่าการแจ้งเตือน
  updateNotificationSetting: (id, enabled) => {
    return apiClient.put(`/guests/${id}/notification`, { enabled });
  },
};

// API สำหรับรูปภาพ
export const photoAPI = {
  // อัปโหลดรูปภาพ
  uploadPhoto: (formData, onUploadProgress) => {
    return apiClient.post('/photos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },
  
  // อัปโหลดรูปภาพคุณภาพสูง
  uploadHighResPhoto: (id, formData, onUploadProgress) => {
    return apiClient.post(`/photos/${id}/high-res`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },
  
  // ดาวน์โหลดรูปภาพ
  downloadPhoto: (id) => {
    window.open(`${API_URL}/photos/${id}/download`, '_blank');
  },
  
  // ดึงข้อมูลรูปภาพทั้งหมด
  getAllPhotos: () => {
    return apiClient.get('/photos');
  },
  
  // ดึงข้อมูลรูปภาพที่มีผู้ร่วมงานคนนั้นปรากฏอยู่
  getPhotosByGuest: (guestId) => {
    return apiClient.get(`/photos?guest=${guestId}`);
  },
  
  // ดึงข้อมูลรูปภาพตาม ID
  getPhotoById: (id) => {
    return apiClient.get(`/photos/${id}`);
  },
};

// เพิ่มฟังก์ชันสำหรับตรวจสอบว่า API พร้อมใช้งานหรือไม่
export const checkAPIStatus = async () => {
  try {
    await apiClient.get('/health');
    return true;
  } catch (error) {
    console.error('API is not available:', error);
    return false;
  }
};

export default {
  guest: guestAPI,
  photo: photoAPI,
  checkStatus: checkAPIStatus,
}; 