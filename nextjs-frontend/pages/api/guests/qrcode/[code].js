import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function handler(req, res) {
  const { code } = req.query;
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  try {
    const response = await axios.get(`${API_URL}/guests/qrcode/${code}`);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching guest from QR code:', error);
    
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ร่วมงานจาก QR Code';
    
    return res.status(statusCode).json({ message: errorMessage });
  }
} 