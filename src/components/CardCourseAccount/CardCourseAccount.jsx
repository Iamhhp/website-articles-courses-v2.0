import './CardCourseAccount.css';
import RendingPrice from '../RendingPrice/RendingPrice';
import { Link } from 'react-router-dom';
import { useChangeUserDataContext, useUserDataContext } from '../../context/DataContext';
import { IoMdRemoveCircleOutline } from 'react-icons/io';
import axios from 'axios';
import { useEffect, useState } from 'react';
import SmallLoading from '../SmallLoading/SmallLoading';
import { ACTION_TYPE } from '../../context/hooks/useUserDataReducer';

const CardCourseAccount = ({ id, title, image, description, mainPrice, discountPrice, isCourseSelected }) => {
  const [isPosting, setIsPosting] = useState(false);
  const userData = useUserDataContext();
  const changeUserData = useChangeUserDataContext();

  useEffect(() => {
    if (isPosting) {
      window.sessionStorage.setItem('userData', JSON.stringify({ ...userData }));
      setIsPosting(() => false);
    }
  }, [userData]);

  const clickHandlerRemoveCourses = () => {
    setIsPosting(() => true);
    const userDataNew = JSON.parse(JSON.stringify({ ...userData }));
    userDataNew.selectedCards = userDataNew.selectedCards.filter((card) => card.id !== id);

    axios
      .patch(`https://dbserver.liara.run/users/${userDataNew.id}`, userDataNew)
      .then((response) => {
        if (response.status === 200) {
          changeUserData(ACTION_TYPE.DEL_CARD_SELECTED, id);
        }
      })

      .catch((err) => {
        if (err.message.includes('500')) {
          changeUserData(ACTION_TYPE.DEL_CARD_SELECTED, id);
        } else {
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
export default CardCourseAccount;
