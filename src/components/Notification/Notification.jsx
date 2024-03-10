import { useEffect, useRef } from 'react';
import './Notification.css';
import { useSetNotificationContext } from '../../context/DataContext';
import { ACTION_TYPE_NOTIFICATION } from '../../context/hooks/useNotification';

const Notification = ({ id, backgroundColor, msg, i }) => {
  const timer = { id: 0 };
  const notification = useRef();
  const setNotification = useSetNotificationContext();

  useEffect(() => {
    window.setTimeout(() => {
      window.setTimeout(() => {
        if (notification.current) {
          notification.current.style.top = `${i * 35 + 90}px`;

          timer.id = window.setTimeout(() => {
            if (notification.current) {
              notification.current.style.top = '';

              window.setTimeout(() => {
                setNotification(ACTION_TYPE_NOTIFICATION.DEL_NOTI, id);
              }, 500);
            }
          }, 4000);
        }
      });
    }, 10);

    return () => {
      window.clearTimeout(timer.id);
    };
  }, []);

  return (
    <div className='notification' style={{ backgroundColor }} ref={notification}>
      {msg}
    </div>
  );
};
export default Notification;
