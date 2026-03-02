import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500',
          text: 'text-white',
          icon: '🎉',
        };
      case 'error':
        return {
          bg: 'bg-red-500',
          text: 'text-white',
          icon: '❌',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-500',
          text: 'text-white',
          icon: 'ℹ️',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg animate-slide-in ${styles.bg} ${styles.text}`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{styles.icon}</span>
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 hover:opacity-80 transition-opacity"
          aria-label="Close notification"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div
        className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-lg"
        style={{
          width: '100%',
          animation: `shrink ${duration}ms linear forwards`,
        }}
      />
    </div>
  );
};
