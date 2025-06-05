const fs = require('fs');
const path = require('path');
const axios = require('axios');

const MODELS_DIR = path.join(__dirname, 'models');

// สร้างโฟลเดอร์ models ถ้ายังไม่มี
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
  console.log('สร้างโฟลเดอร์ models แล้ว');
}

// รายการโมเดลที่ต้องดาวน์โหลด
const models = [
  {
    name: 'Face Detection Model',
    files: [
      'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-weights_manifest.json',
      'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-shard1'
    ]
  },
  {
    name: 'Face Landmark Model',
    files: [
      'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json',
      'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1'
    ]
  },
  {
    name: 'Face Recognition Model',
    files: [
      'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json',
      'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1'
    ]
  }
];

// ฟังก์ชันดาวน์โหลดไฟล์
async function downloadFile(url, destPath) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(destPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`เกิดข้อผิดพลาดในการดาวน์โหลด ${url}:`, error.message);
    throw error;
  }
}

// ฟังก์ชันหลักสำหรับดาวน์โหลดโมเดลทั้งหมด
async function downloadModels() {
  console.log('เริ่มดาวน์โหลดโมเดล face-api.js...');

  for (const model of models) {
    console.log(`\nกำลังดาวน์โหลด ${model.name}...`);
    
    for (const fileUrl of model.files) {
      const fileName = path.basename(fileUrl);
      const filePath = path.join(MODELS_DIR, fileName);
      
      console.log(`- ดาวน์โหลด ${fileName}...`);
      
      try {
        await downloadFile(fileUrl, filePath);
        console.log(`  ✓ ดาวน์โหลด ${fileName} สำเร็จ`);
      } catch (error) {
        console.error(`  ✗ ดาวน์โหลด ${fileName} ล้มเหลว`);
      }
    }
  }

  console.log('\nดาวน์โหลดโมเดลทั้งหมดเสร็จสิ้น');
}

// เริ่มดาวน์โหลดโมเดล
downloadModels().catch(err => {
  console.error('เกิดข้อผิดพลาดในการดาวน์โหลดโมเดล:', err);
  process.exit(1);
}); 