import { useState, useEffect } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { FaBell } from 'react-icons/fa';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBadge = ({ guestId }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!guestId) return;
    
    // เชื่อมต่อกับ socket.io server
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      withCredentials: true,
    });
    
    // ลงทะเบียนผู้ใช้กับ guestId
    socket.emit('register-guest', guestId);
    
    // รับการแจ้งเตือนใหม่
    socket.on('new-photo-notification', (data) => {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: data.message,
        photoIds: data.photoIds,
        timestamp: new Date()
      }]);
    });
    
    return () => {
      socket.disconnect();
    };
  }, [guestId]);

  const handleNotificationClick = (photoIds) => {
    // ไปที่หน้าแกลเลอรี่หรือหน้ารายละเอียดรูปภาพ
    if (photoIds && photoIds.length === 1) {
      router.push(`/photos/${photoIds[0]}`);
    } else {
      router.push(`/guests/${guestId}`);
    }
    
    setShowNotifications(false);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  return (
    <div className="notification-badge-container">
      <div className="position-relative">
        <Button 
          variant="link" 
          className="notification-bell p-0" 
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <FaBell size={20} />
          {notifications.length > 0 && (
            <Badge 
              bg="danger" 
              pill 
              className="notification-count"
            >
              {notifications.length}
            </Badge>
          )}
        </Button>
        
        <AnimatePresence>
          {showNotifications && (
            <motion.div 
              className="notification-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="notification-header">
                <h6 className="mb-0">การแจ้งเตือน</h6>
                {notifications.length > 0 && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 text-muted" 
                    onClick={clearNotifications}
                  >
                    ล้างทั้งหมด
                  </Button>
                )}
              </div>
              
              <div className="notification-body">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <motion.div 
                      key={notification.id}
                      className="notification-item"
                      onClick={() => handleNotificationClick(notification.photoIds)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                    >
                      <div className="notification-icon">
                        <FaBell />
                      </div>
                      <div className="notification-content">
                        <p className="mb-1">{notification.message}</p>
                        <small className="text-muted">
                          {new Date(notification.timestamp).toLocaleTimeString('th-TH')}
                        </small>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-3 text-muted">
                    <p className="mb-0">ไม่มีการแจ้งเตือนใหม่</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationBadge; 