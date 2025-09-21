import React, { useState, useEffect, createContext, useContext } from 'react';
import Icon from '../AppIcon';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    if (newNotification?.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification?.duration);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev?.filter(notification => notification?.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ 
      addNotification, 
      removeNotification, 
      clearAllNotifications 
    }}>
      {children}
      <NotificationToast 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </NotificationContext.Provider>
  );
};

const NotificationToast = ({ notifications, onRemove }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return 'CheckCircle';
      case 'error':
        return 'XCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'info':
      default:
        return 'Info';
    }
  };

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success/10 border-success/20 text-success-foreground';
      case 'error':
        return 'bg-error/10 border-error/20 text-error-foreground';
      case 'warning':
        return 'bg-warning/10 border-warning/20 text-warning-foreground';
      case 'info':
      default:
        return 'bg-accent/10 border-accent/20 text-accent-foreground';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'success':
        return 'var(--color-success)';
      case 'error':
        return 'var(--color-error)';
      case 'warning':
        return 'var(--color-warning)';
      case 'info':
      default:
        return 'var(--color-accent)';
    }
  };

  if (notifications?.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-400 space-y-2 max-w-sm w-full">
      {notifications?.map((notification, index) => (
        <NotificationItem
          key={notification?.id}
          notification={notification}
          onRemove={onRemove}
          getNotificationIcon={getNotificationIcon}
          getNotificationStyles={getNotificationStyles}
          getIconColor={getIconColor}
          index={index}
        />
      ))}
    </div>
  );
};

const NotificationItem = ({ 
  notification, 
  onRemove, 
  getNotificationIcon, 
  getNotificationStyles, 
  getIconColor,
  index 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(notification?.id);
    }, 150);
  };

  const handleSwipeStart = (e) => {
    const startX = e?.touches?.[0]?.clientX;
    const element = e?.currentTarget;
    
    const handleSwipeMove = (e) => {
      const currentX = e?.touches?.[0]?.clientX;
      const diff = startX - currentX;
      
      if (diff > 0) {
        element.style.transform = `translateX(-${Math.min(diff, 100)}px)`;
        element.style.opacity = Math.max(1 - diff / 100, 0.3);
      }
    };
    
    const handleSwipeEnd = (e) => {
      const endX = e?.changedTouches?.[0]?.clientX;
      const diff = startX - endX;
      
      if (diff > 50) {
        handleRemove();
      } else {
        element.style.transform = '';
        element.style.opacity = '';
      }
      
      element?.removeEventListener('touchmove', handleSwipeMove);
      element?.removeEventListener('touchend', handleSwipeEnd);
    };
    
    element?.addEventListener('touchmove', handleSwipeMove);
    element?.addEventListener('touchend', handleSwipeEnd);
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isRemoving ? 'translate-x-full opacity-0' : ''}
      `}
      onTouchStart={handleSwipeStart}
    >
      <div className={`
        relative p-4 rounded-lg border shadow-elevation-2 backdrop-blur-sm
        ${getNotificationStyles(notification?.type)}
      `}>
        <div className="flex items-start space-x-3">
          <Icon 
            name={getNotificationIcon(notification?.type)} 
            size={20} 
            color={getIconColor(notification?.type)}
            className="flex-shrink-0 mt-0.5"
          />
          
          <div className="flex-1 min-w-0">
            {notification?.title && (
              <div className="text-sm font-semibold mb-1">
                {notification?.title}
              </div>
            )}
            <div className="text-sm opacity-90">
              {notification?.message}
            </div>
            {notification?.action && (
              <button
                onClick={notification?.action?.onClick}
                className="mt-2 text-xs font-medium underline hover:no-underline transition-smooth duration-150"
              >
                {notification?.action?.label}
              </button>
            )}
          </div>
          
          <button
            onClick={handleRemove}
            className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-smooth duration-150"
            aria-label="Close notification"
          >
            <Icon name="X" size={14} className="opacity-60" />
          </button>
        </div>
        
        {notification?.duration > 0 && (
          <div 
            className="absolute bottom-0 left-0 h-0.5 bg-current opacity-30 animate-pulse"
            style={{
              animation: `shrink ${notification?.duration}ms linear forwards`
            }}
          />
        )}
      </div>
    </div>
  );
};

// Add the shrink animation to your CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes shrink {
    from { width: 100%; }
    to { width: 0%; }
  }
`;
document.head?.appendChild(style);

export default NotificationToast;