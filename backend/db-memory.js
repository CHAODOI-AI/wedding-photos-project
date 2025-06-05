const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod = null;

/**
 * เชื่อมต่อกับฐานข้อมูล MongoDB จำลองในหน่วยความจำ
 */
const connect = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  console.log('กำลังเชื่อมต่อกับฐานข้อมูลจำลอง:', uri);
  
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  await mongoose.connect(uri, mongooseOpts);
  
  console.log('เชื่อมต่อกับฐานข้อมูลจำลองสำเร็จ');
  return uri;
};

/**
 * ปิดการเชื่อมต่อและหยุดการทำงานของฐานข้อมูลจำลอง
 */
const closeDatabase = async () => {
  if (mongod) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
    console.log('ปิดการเชื่อมต่อฐานข้อมูลจำลองแล้ว');
  }
};

/**
 * ล้างข้อมูลทั้งหมดในฐานข้อมูล
 */
const clearDatabase = async () => {
  if (mongod) {
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
    
    console.log('ล้างข้อมูลในฐานข้อมูลจำลองแล้ว');
  }
};

module.exports = { connect, closeDatabase, clearDatabase }; 