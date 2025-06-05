import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// สร้าง instance ของ axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API สำหรับผู้ร่วมงาน
export const guestAPI = {
  // ลงทะเบียนผู้ร่วมงาน
  register: (formData) => {
    return apiClient.post('/register', formData, {
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
  
  // ดึงข้อมูลรูปภาพทั้งหมด
  getAllPhotos: () => {
    return apiClient.get('/photos');
  },
  
  // ดึงข้อมูลรูปภาพที่มีผู้ร่วมงานคนนั้นปรากฏอยู่
  getPhotosByGuest: (guestId) => {
    return apiClient.get(`/photos?guest=${guestId}`);
  },
};

export default {
  guest: guestAPI,
  photo: photoAPI,
}; 