import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="offline-pill" role="status" aria-live="polite">
      وضع عدم الاتصال — يعمل التطبيق من الذاكرة المحلية
    </div>
  );
};
