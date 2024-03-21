import './Notification.css';
import { memo, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { deleteNotification } from '../../context/Redux/notificationDataSlice';
import { IoIosCloseCircleOutline } from 'react-icons/io';

const Notification = ({ id, backgroundColor, msg, i }) => {
  const timer = { id: 0 };
  const notification = useRef(null);
  const setNotification = useDispatch();

  useEffect(() => {
    window.setTimeout(() => {
      window.setTimeout(() => {
        if (notification.current) {
          notification.current.style.top = `${i * 40 + 90}px`;
          notification.current.children[1].style.width = '0px';

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

  const closeHandlerNotification = () => {
    if (notification.current) {
      notification.current.style.top = '';

      window.setTimeout(() => {
        setNotification(deleteNotification(id));
      }, 500);
    }
  };

  return (
    <div className='notification' style={{ backgroundColor }} ref={notification}>
      <div className='message'>
        {msg}
        <IoIosCloseCircleOutline className='icon-close-notification' onClick={closeHandlerNotification} />
      </div>

      <div className='time-out-bar' />
    </div>
  );
};
export default memo(Notification);
