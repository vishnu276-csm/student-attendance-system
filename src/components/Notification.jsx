import { useData } from '../context/DataContext';
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiInformationCircle,
  HiXMark
} from 'react-icons/hi2';

export default function Notification() {
  const { notifications, dismissNotification } = useData();

  if (!notifications.length) return null;

  return (
    <div className="notifications-container" aria-live="polite">
      {notifications.map(n => {
        let Icon = HiCheckCircle;
        let toastClass = 'toast-success';

        if (n.type === 'error') {
          Icon = HiExclamationCircle;
          toastClass = 'toast-error';
        } else if (n.type === 'warning') {
          Icon = HiExclamationCircle;
          toastClass = 'toast-warning';
        } else if (n.type === 'info') {
          Icon = HiInformationCircle;
          toastClass = 'toast-info';
        }

        return (
          <div key={n.id} className={`notification-toast ${toastClass}`}>
            <Icon size={22} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, lineHeight: 1.35 }}>{n.message}</div>
            <button
              type="button"
              onClick={() => dismissNotification(n.id)}
              className="btn-icon"
              style={{ padding: 4 }}
              aria-label="Dismiss notification"
            >
              <HiXMark size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
