import './Course.css';
import { Col, Container, Row } from 'react-bootstrap';
import useFetch from '../../hooks/useFetch';
import { useParams } from 'react-router-dom';
import { PiStudentBold } from 'react-icons/pi';
import { GiProgression } from 'react-icons/gi';
import Accordion from '../../components/Accordion/Accordion';
import { FaRegCommentAlt, FaRegFileVideo } from 'react-icons/fa';
import Comment from '../../components/Comment/Comment';
import Swal from 'sweetalert2';
import Loading from '../../components/Loading/Loading';
import NoResponse from '../../components/NoResponse/NoResponse';
import RendingPrice from '../../components/RendingPrice/RendingPrice';
import { useEffect, useRef, useState } from 'react';
import { useChangeUserDataContext, useSetNotificationContext, useUserDataContext } from '../../context/DataContext';
import { ACTION_TYPE } from '../../context/hooks/useUserDataReducer';
import SmallLoading from '../../components/SmallLoading/SmallLoading';
import axios from 'axios';
import { ACTION_TYPE_NOTIFICATION } from '../../context/hooks/useNotification';
import { showDialog } from '../../utils';

const Course = () => {
  const { idCourse } = useParams();
  const [isPosting, setIsPosting] = useState(false);

  const userData = useUserDataContext();
  const changeUserData = useChangeUserDataContext();
  const setNotification = useSetNotificationContext();

  const form = useRef();
  const [
    {
      responseStatus,
      response: { id, title, image, description, teacher, descTeacher, imgProfileTeacher, studentCount, progressPercent, mainPrice, discountPrice, comments },
    },
    isPending,
  ] = useFetch(`https://dbserver.liara.run/Courses/${idCourse}`);

  const clickHandlerRegisterCourse = () => {
    if (isPosting) {
      return;
    }

    const dataCourse = {
      id,
      title,
      image,
      description,
      mainPrice,
      discountPrice,
    };

    // checking course Exit in boughtCards
    const result = userData.boughtCards.some((card) => card.id === id);
    if (result) {
      setNotification(ACTION_TYPE_NOTIFICATION.ADD_ERR, `"${title}" قبلا خریداری شد!`);
      return;
    }

    // checking course Exist in selectedCards
    const result01 = userData.selectedCards.some((card) => card.id === id);
    if (result01) {
      setNotification(ACTION_TYPE_NOTIFICATION.ADD_ERR, `"${title}" قبلا انتخاب شد!`);

      return;
    }

    setIsPosting(() => true);
    changeUserData(ACTION_TYPE.ADD_CARD_SELECTED, dataCourse);
  };

  // patch course
  useEffect(() => {
    if (isPosting) {
      axios
        .patch(`https://dbserver.liara.run/users/${userData.id}`, userData)
        .then((response) => {
          if (response.status === 200) {
            setNotification(ACTION_TYPE_NOTIFICATION.ADD_MSG, `"${title}" به سبد خرید اضافه شد!`);
          } else {
            setNotification(ACTION_TYPE_NOTIFICATION.ADD_ERR, 'خطا! دوباره سعی کنید.');

            // Recovery Data User Login from sessionStorage!
            changeUserData(ACTION_TYPE.DEL_CARD_SELECTED, id);
          }
        })
        .catch((err) => {
          if (err.message.includes('500')) {
            setNotification(ACTION_TYPE_NOTIFICATION.ADD_MSG, `"${title}" به سبد خرید اضافه شد!`);
          } else {
            setNotification(ACTION_TYPE_NOTIFICATION.ADD_ERR, 'خطاqq! دوباره سعی کنید.');

            // Recovery Data User Login from sessionStorage!
            changeUserData(ACTION_TYPE.DEL_CARD_SELECTED, id);
          }
        })
        .finally(() => {
          setIsPosting(() => false);
        });
    }
  }, [userData]);

  const clickHandlerSendComment = (e) => {
    const inputComment = e.target.previousElementSibling;
    if (!inputComment.value) {
      showDialog('err', 'لطفا ابتدا نظر خود را در کادر مربوطه وارد کنید', inputComment);
      return;
    }

    inputComment.value = '';
    showDialog('success', 'نظر شما با موفقیت ارسال شد بعد از تایید در بخش نظرات ثبت خواهد شد.');
  };

  return (
    <Container className='container-course' ref={form}>
      <div className='title-header'>دوره آموزشی</div>
      {isPending ? (
        <Loading />
      ) : responseStatus !== 'dataReceived!' ? (
        <NoResponse responseState={responseStatus} />
      ) : (
        <Row>
          <Col className='col-12 col-md-6  col-lg-4'>
            <div className='details-course'>
              <div className='title'>
                {title}-{id}
              </div>

              <div className='intro-teacher'>
                <div className='img-profile-teacher'>
                  <img src={imgProfileTeacher} alt='' />
                </div>

                <div className='details-teacher'>
                  <div className='name-teacher'>{teacher}</div>
                  <div className='desc-teacher'>{descTeacher}</div>
                </div>
              </div>

              <div className='footer'>
                <div className='description'>{description}</div>

                <div className='count-student'>
                  <PiStudentBold className='icon' /> تعداد دانشجوها دوره : {studentCount}
                </div>

                <div className='progress-course'>
                  <GiProgression className='icon' /> درصد پیشرفت دوره : {progressPercent}%
                  <div className='progress-bar'>
                    <div className='fill' style={{ width: progressPercent + '%' }} />
                  </div>
                </div>

                <div className='price-course'>
                  قیمت دوره :
                  <RendingPrice {...{ mainPrice, discountPrice }} />
                </div>
              </div>

              <button className='btn-login' onClick={clickHandlerRegisterCourse}>
                {isPosting ? <SmallLoading /> : 'ثبت نام'}
              </button>
            </div>
          </Col>

          <Col className='col-12 col-md-6 col-lg-8'>
            <div className='info-course'>
              <div className='img-course'>
                <img src={image} alt='' />
              </div>

              <div className='chapter-course'>
                <Accordion
                  title={
                    <div className='accordion-title'>
                      <b className='chapter'>معرفی و مقدمه</b>
                      <p className='desc'>برای مشاهده ویدئو های آموزشی کلیک کنید</p>
                    </div>
                  }
                >
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 1</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 1</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 2</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 3</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 4</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 5</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 6</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 7</a>
                  </li>
                </Accordion>

                <Accordion
                  title={
                    <div className='accordion-title'>
                      <b className='chapter'>مفاهیم پایه</b>
                      <p className='desc'>برای مشاهده ویدئو های آموزشی کلیک کنید</p>
                    </div>
                  }
                >
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 1</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 1</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 2</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 3</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 4</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 5</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 6</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 7</a>
                  </li>
                </Accordion>

                <Accordion
                  title={
                    <div className='accordion-title'>
                      <b className='chapter'>آشنایی با قوانین</b>
                      <p className='desc'>برای مشاهده ویدئو های آموزشی کلیک کنید</p>
                    </div>
                  }
                >
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 1</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 1</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 2</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 3</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 4</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 5</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 6</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 7</a>
                  </li>
                </Accordion>

                <Accordion
                  title={
                    <div className='accordion-title'>
                      <b className='chapter'>پروژه پایانی</b>
                      <p className='desc'>برای مشاهده ویدئو های آموزشی کلیک کنید</p>
                    </div>
                  }
                >
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 1</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 1</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 2</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 3</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 4</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 5</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 6</a>
                  </li>
                  <li className='item-accordion'>
                    <FaRegFileVideo className='icon-item' />
                    <a href=''>ویوئو آموزشی - 7</a>
                  </li>
                </Accordion>
              </div>
            </div>

            <div className='sec-comments'>
              <div className='container-comments'>
                <div className='header'>
                  <p className='title'>
                    <FaRegCommentAlt className='icon' />
                    نظرات
                  </p>
                </div>
                <div className='comments'>
                  {comments?.map((comment) => {
                    return <Comment key={comment.id} {...comment} />;
                  })}
                </div>
              </div>

              <div className='box-comment'>
                <div className='title'>ثبت نظر</div>
                <textarea
                  className='input-comment'
                  onBlur={(e) => {
                    e.target.value = e.target.value.trim();
                  }}
                />
                <button type='button' className='send-comment' onClick={clickHandlerSendComment}>
                  ارسال نظر
                </button>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};
export default Course;
