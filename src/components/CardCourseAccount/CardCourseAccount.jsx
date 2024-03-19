import './CardCourseAccount.css';
import RendingPrice from '../RendingPrice/RendingPrice';
import { Link } from 'react-router-dom';
import { IoMdRemoveCircleOutline } from 'react-icons/io';
import axios from 'axios';
import { memo, useEffect, useState } from 'react';
import SmallLoading from '../SmallLoading/SmallLoading';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSelectedCard } from '../../context/Redux/userSlice';
import { addNotificationErr, addNotificationMsg } from '../../context/Redux/notificationDataSlice';
import { Col, Row } from 'react-bootstrap';

const CardCourseAccount = ({ id, title, image, description, mainPrice, discountPrice, isCourseSelected }) => {
  useEffect(() => {
    console.log('CardCourseAccount reRender!', id);
  });

  const [isPosting, setIsPosting] = useState(false);
  const { info: userData } = useSelector((state) => state.user);
  const setUserData = useDispatch();
  const setNotification = useDispatch();

  const clickHandlerRemoveCourses = () => {
    setIsPosting(() => true); // don't false cause component cardCourseAccount Rerendering!
    const userNewData = JSON.parse(JSON.stringify(userData));
    userNewData.selectedCards = userNewData.selectedCards.filter((card) => card.id !== id);
    axios
      .patch(`https://dbserver.liara.run/users/${userData.id}`, userNewData)
      .then((response) => {
        if (response.status === 200) {
          setUserData(deleteSelectedCard(id));
          setNotification(addNotificationMsg(`"${title}" از سبد خرید حذف شد!`));
        } else {
          setNotification(addNotificationErr('خطا! دوباره سعی کنید.'));
        }
      })
      .finally(() => {
        setIsPosting(() => false);
      })
      .catch((err) => {
        if (err.message.includes('500')) {
          setUserData(deleteSelectedCard(id));
          setNotification(addNotificationMsg(`"${title}" از سبد خرید حذف شد!`));
        } else {
          setNotification(addNotificationErr('خطا! دوباره سعی کنید.'));
        }
      });
  };

  return (
    <div className='card-course-account'>
      <Row>
        <Col className='col-12 col-sm-6 col-lg-5 col-xl-4'>
          <div className='img'>
            <img src={image} alt='' />
          </div>
        </Col>

        <Col className='col-12 col-sm-6 col-lg-7 col-xl-8'>
          <div className='body'>
            <h3 className='title'>
              {title}-{id}
              {isCourseSelected && (isPosting ? <SmallLoading /> : <IoMdRemoveCircleOutline className='remove-course' onClick={clickHandlerRemoveCourses} />)}
            </h3>
            <p className='description'>{description}</p>
            <div className='footer-card'>
              <Link to={`/course/${id}`} className='details-course'>
                جزئیات دوره
              </Link>

              {isCourseSelected && (
                <div className='price'>
                  <RendingPrice {...{ discountPrice, mainPrice }} />
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default memo(CardCourseAccount);
