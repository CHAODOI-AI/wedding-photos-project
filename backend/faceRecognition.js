const faceapi = require('face-api.js');
const canvas = require('canvas');
const fs = require('fs');
const path = require('path');

// นำเข้าโมดูลที่ต้องใช้สำหรับ face-api.js
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// กำหนดเส้นทางไปยังโมเดลจดจำใบหน้า
const MODELS_PATH = path.join(__dirname, 'models');

// ฟังก์ชันโหลดโมเดล
async function loadModels() {
  try {
    // ตรวจสอบว่าโฟลเดอร์โมเดลมีอยู่หรือไม่
    if (!fs.existsSync(MODELS_PATH)) {
      fs.mkdirSync(MODELS_PATH, { recursive: true });
      console.log('สร้างโฟลเดอร์โมเดลแล้ว');
    }

    // โหลดโมเดลสำหรับการรู้จำใบหน้า
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_PATH);

    console.log('โหลดโมเดลจดจำใบหน้าสำเร็จ');
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการโหลดโมเดล:', error);
    throw error;
  }
}

// ฟังก์ชันสำหรับการสกัดคุณลักษณะของใบหน้า (Face Descriptor)
async function getFaceDescriptor(imagePath) {
  try {
    // อ่านภาพ
    const img = await canvas.loadImage(imagePath);
    
    // ตรวจจับใบหน้า
    const detections = await faceapi.detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    if (!detections) {
      throw new Error('ไม่พบใบหน้าในภาพ');
    }
    
    return detections.descriptor;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสกัดลักษณะเฉพาะใบหน้า:', error);
    throw error;
  }
}

// ฟังก์ชันสำหรับการตรวจจับใบหน้าในรูปภาพงาน
async function detectFacesInEventPhoto(photoPath, registeredFaces) {
  try {
    // อ่านภาพ
    const img = await canvas.loadImage(photoPath);
    
    // ตรวจจับใบหน้าทั้งหมดในรูปภาพ
    const detections = await faceapi.detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceDescriptors();
    
    if (!detections || detections.length === 0) {
      return [];
    }
    
    // สร้างตัวจำแนกใบหน้า
    const labeledDescriptors = registeredFaces.map(face => {
      return new faceapi.LabeledFaceDescriptors(
        face.id, 
        [new Float32Array(face.descriptor)]
      );
    });
    
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
    
    // จับคู่ใบหน้าที่พบกับใบหน้าที่ลงทะเบียนไว้
    const recognizedFaces = detections.map(detection => {
      const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
      return {
        id: bestMatch.label !== 'unknown' ? bestMatch.label : null,
        match: bestMatch.distance < 0.6, // ค่า threshold สำหรับการจับคู่
        confidence: 1 - bestMatch.distance
      };
    }).filter(face => face.match);
    
    return recognizedFaces;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการตรวจจับใบหน้าในรูปภาพ:', error);
    throw error;
  }
}

module.exports = {
  loadModels,
  getFaceDescriptor,
  detectFacesInEventPhoto
}; 