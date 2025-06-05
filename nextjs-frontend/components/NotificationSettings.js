import { useState } from 'react';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import { FaBell, FaBellSlash } from 'react-icons/fa';
import { guestAPI } from '../lib/api';
import { motion } from 'framer-motion';

const NotificationSettings = ({ guest, onUpdate }) => {
  const [notificationEnabled, setNotificationEnabled] = useState(guest.notificationEnabled);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleToggleNotification = async () => {
    try {
      setLoading(true);
      setSuccess(false);
      
      // อัปเดตการตั้งค่าการแจ้งเตือน
      const newValue = !notificationEnabled;
      await guestAPI.updateNotificationSetting(guest._id, newValue);
      
      setNotificationEnabled(newValue);
      setSuccess(true);
      
      // เรียกใช้ callback ถ้ามี
      if (onUpdate) {
        onUpdate({ ...guest, notificationEnabled: newValue });
      }
      
      // ซ่อนข้อความสำเร็จหลังจาก 3 วินาที
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตการแจ้งเตือน:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className={`notification-icon ${notificationEnabled ? 'active' : 'inactive'}`}>
              {notificationEnabled ? <FaBell size={20} /> : <FaBellSlash size={20} />}
            </div>
            <div className="ms-3">
              <h5 className="mb-1">การแจ้งเตือน</h5>
              <p className="text-muted mb-0">
                {notificationEnabled 
                  ? 'คุณจะได้รับการแจ้งเตือนเมื่อมีรูปภาพใหม่ที่มีคุณปรากฏอยู่' 
                  : 'คุณจะไม่ได้รับการแจ้งเตือนเมื่อมีรูปภาพใหม่'}
              </p>
              
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-success mt-2"
                >
                  <small>บันทึกการตั้งค่าเรียบร้อยแล้ว</small>
                </motion.div>
              )}
            </div>
          </div>
          
          <Form.Check 
            type="switch"
            id="notification-switch"
            checked={notificationEnabled}
            onChange={handleToggleNotification}
            disabled={loading}
            className="notification-switch"
          />
        </div>
        
        {loading && (
          <div className="text-center mt-3">
            <Spinner animation="border" size="sm" />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default NotificationSettings; 