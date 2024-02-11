import { Col, Container, Row } from 'react-bootstrap';
import './Course.css';
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

const Course = () => {
  const { idCourse } = useParams();
  const [
    {
      responseStatus,
      response: { title, image, description, teacher, descTeacher, imgProfileTeacher, studentCount, progressPercent, comments },
    },
    isPending,
  ] = useFetch(`https://dbserver.liara.run/Courses/${idCourse}`);

  const clickHandlerSendComment = (e) => {
    const inputComment = e.target.previousElementSibling;
    if (!inputComment.value) {
      Swal.fire({
        icon: 'info',
        text: 'لطفا کادر مربوط را پر کنید!',
        showConfirmButton: true,
      }).then(() => {
        window.setTimeout(() => {
          inputComment.focus();
        }, 300);
      });
      return;
    }
    inputComment.value = '';
    Swal.fire({
      icon: 'success',
      text: 'نظر شما با موفقیت ارسال شد بعد از تایید در بخش نظرات ثبت خواهد شد.',
      showConfirmButton: true,
    });
  };

  return (
    <Container className='container-course'>
      <div className='title-header'>دوره ها</div>
      {isPending ? (
        <Loading />
      ) : responseStatus !== 'dataReceived!' ? (
        <NoResponse responseState={responseStatus} />
      ) : (
        <Row>
          <Col className='col-12 col-md-6  col-lg-4'>
            <div className='details-course'>
              <div className='title'>{title}</div>

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
              </div>

              <button className='btn-login'>ثبت نام</button>
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
                    return <Comment key={comment.id} {...comment} teacher={teacher} />;
                  })}
                </div>
              </div>

              <div className='box-comment'>
                <div className='title'>ثبت نظر</div>
                <textarea className='input-comment' />
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
