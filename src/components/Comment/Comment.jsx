import { FaChalkboardTeacher } from 'react-icons/fa';
import './Comment.css';
import { PiStudentBold } from 'react-icons/pi';
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';

const Comment = ({ user, type, date, text, replies }) => {
  const [showBoxComment, setShowBoxComment] = useState(false);

  const clickHandlerReply = () => {
    setShowBoxComment((prevState) => !prevState);
  };

  const clickHandlerReplySend = (e) => {
    const inputReplyComment = e.target.previousElementSibling;
    if (!inputReplyComment.value) {
      Swal.fire({
        icon: 'info',
        text: 'لطفا کادر مربوط را پر کنید!',
        showConfirmButton: true,
      }).then(() => {
        window.setTimeout(() => {
          inputReplyComment.focus();
        }, 300);
      });
      return;
    }
    inputReplyComment.value = '';
    Swal.fire({
      icon: 'success',
      text: 'پاسخ شما ارسال شد بعد از تایید در بخش نظرات ثبت می شود!',
      showConfirmButton: true,
    });
  };

  const initialHeight = useRef();
  const elementComment = useRef(null);
  useEffect(() => {
    initialHeight.current = elementComment.current.scrollHeight;
  }, []);

  useEffect(() => {
    if (showBoxComment) {
      elementComment.current.style.height = `${initialHeight.current}px`;

      window.setTimeout(() => {
        if (elementComment.current) {
          elementComment.current.style.height = `${elementComment.current.scrollHeight}px`;

          window.setTimeout(() => {
            if (elementComment.current) {
              elementComment.current.style.height = 'fit-content';
            }
          }, 120);
        }
      }, 10);
    } else {
      elementComment.current.style.height = `${elementComment.current.scrollHeight}px`;

      window.setTimeout(() => {
        if (elementComment.current) {
          elementComment.current.style.height = 'fit-content';
        }
      }, 50);
    }
  }, [showBoxComment]);

  return (
    <div className='comment' ref={elementComment}>
      <div className='header-comment'>
        <div className='img'>
          <img src={'https://banner2.cleanpng.com/20180329/zue/kisspng-computer-icons-user-profile-person-5abd85306ff7f7.0592226715223698404586.jpg'} alt='' />
        </div>
        <div className='container-user'>
          {type === 'teacher' ? (
            <div className='label-user-teacher'>
              <FaChalkboardTeacher className='icon' /> مدرس
            </div>
          ) : (
            <div className='label-user-student'>
              <PiStudentBold className='icon' /> دانشجو
            </div>
          )}

          <div className='name'>{user}</div>
        </div>
        <div className='date'>{date}</div>
      </div>

      <div className='body'>
        <div className='text'>{text}</div>
        <button type='button' className='reply-comment' onClick={clickHandlerReply} style={showBoxComment ? { color: 'white', backgroundColor: 'green' } : {}}>
          پاسخ
        </button>
      </div>

      {showBoxComment && (
        <div className='box-comment'>
          <div className='title'>ثبت پاسخ</div>
          <textarea className='input-comment' />
          <button type='button' className='send-comment' onClick={clickHandlerReplySend}>
            ارسال پاسخ
          </button>
        </div>
      )}

      {replies?.map((comment) => {
        return <Comment key={comment.id} {...comment} />;
      })}
    </div>
  );
};
export default Comment;
