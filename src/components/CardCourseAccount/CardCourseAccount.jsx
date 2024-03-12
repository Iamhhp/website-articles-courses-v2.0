import './CardCourseAccount.css';
import RendingPrice from '../RendingPrice/RendingPrice';
import { Link } from 'react-router-dom';
import { useChangeUserDataContext, useSetNotificationContext, useUserDataContext } from '../../context/DataContext';
import { IoMdRemoveCircleOutline } from 'react-icons/io';
import axios from 'axios';
import { memo, useEffect, useState } from 'react';
import { ACTION_TYPE } from '../../context/hooks/useUserDataReducer';
import { ACTION_TYPE_NOTIFICATION } from '../../context/hooks/useNotification';
import SmallLoading from '../SmallLoading/SmallLoading';

const CardCourseAccount = ({ id, title, image, description, mainPrice, discountPrice, isCourseSelected, setIsRemoveCard }) => {
  useEffect(() => {
    console.log('CardCourseAccount reRender!', id);
  });

  const [isPosting, setIsPosting] = useState(false);
  const userData = useUserDataContext();
  const changeUserData = useChangeUserDataContext();
  const setNotification = useSetNotificationContext();

  const clickHandlerRemoveCourses = () => {
    setIsPosting(() => true); // don't false cause component cardCourseAccount Rerendering!
    const userNewData = JSON.parse(JSON.stringify(userData));
    userNewData.selectedCards = userNewData.selectedCards.filter((card) => card.id !== id);
    axios
      .patch(`https://dbserver.liara.run/users/${userData.id}`, userNewData)
      .then((response) => {
        if (response.status === 200) {
          changeUserData(ACTION_TYPE.DEL_CARD_SELECTED, id);
          setNotification(ACTION_TYPE_NOTIFICATION.ADD_MSG, `"${title}" از سبد خرید حذف شد!`);
        } else {
          setNotification(ACTION_TYPE_NOTIFICATION.ADD_ERR, 'خطا! دوباره سعی کنید.');
        }
      })
      .finally(() => {
        setIsPosting(() => false);
      })
      .catch((err) => {
        if (err.message.includes('500')) {
          changeUserData(ACTION_TYPE.DEL_CARD_SELECTED, id);
          setNotification(ACTION_TYPE_NOTIFICATION.ADD_MSG, `"${title}" از سبد خرید حذف شد!`);
        } else {
          setNotification(ACTION_TYPE_NOTIFICATION.ADD_ERR, 'خطا! دوباره سعی کنید.');
        }
      });
  };

  return (
    <div className='card-course-account'>
      <div className='img'>
        <img src={image} alt='' />
      </div>

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
    </div>
  );
};
export default memo(CardCourseAccount);
