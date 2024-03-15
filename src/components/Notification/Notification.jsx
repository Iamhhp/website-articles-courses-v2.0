import { memo, useEffect, useRef } from 'react';
import './Notification.css';
import { useDispatch } from 'react-redux';
import { deleteNotification } from '../../context/Redux/notificationDataSlice';

const Notification = ({ id, backgroundColor, msg, i }) => {
  const timer = { id: 0 };
  const notification = useRef(null);
  const setNotification = useDispatch();

  useEffect(() => {
    window.setTimeout(() => {
      window.setTimeout(() => {
        if (notification.current) {
          notification.current.style.top = `${i * 35 + 90}px`;

          timer.id = window.setTimeout(() => {
            if (notification.current) {
              notification.current.style.top = '';

              window.setTimeout(() => {
                setNotification(deleteNotification(id));
              }, 500);
            }
          }, 3000);
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
export default memo(Notification);
