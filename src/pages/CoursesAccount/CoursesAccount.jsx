import './CoursesAccount.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useChangeUserDataContext, useSetNotificationContext, useUserDataContext } from '../../context/DataContext';
import CardCourseAccount from '../../components/CardCourseAccount/CardCourseAccount';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ACTION_TYPE } from '../../context/hooks/useUserDataReducer';
import SmallLoading from '../../components/SmallLoading/SmallLoading';
import { ACTION_TYPE_NOTIFICATION } from '../../context/hooks/useNotification';
import Swal from 'sweetalert2';

const CoursesAccount = () => {
  const navigate = useNavigate();
  const { subRoute } = useParams();
  const containerCoursesAccount = useRef(null);
  const [isPosting, setIsPosting] = useState(false);
  const data = { courses: [], isCourseSelected: false, totalPriceCourses: 0 };

  const userData = useUserDataContext();
  const changeUserData = useChangeUserDataContext();
  const setNotification = useSetNotificationContext();

  useEffect(() => {
    containerCoursesAccount.current.style.transition = 'none';
    window.setTimeout(() => {
      if (containerCoursesAccount.current) {
        containerCoursesAccount.current.classList.remove('container-coursesAccount-show');

        window.setTimeout(() => {
          if (containerCoursesAccount.current) {
            containerCoursesAccount.current.style.transition = '';
            containerCoursesAccount.current.classList.add('container-coursesAccount-show');
          }
        }, 10);
      }
    }, 10);
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  if (subRoute === 'selected') {
    data.courses = [...userData.selectedCards];
    data.isCourseSelected = true;
  } else {
    data.courses = [...userData.boughtCards];
    data.isCourseSelected = false;
  }

  console.log(data.isCourseSelected);

  if (data.courses.length > 1) {
    data.totalPriceCourses = data.courses?.reduce((a, b) => {
      const priceCourseA = (Number(a.discountPrice || 100) / 100) * a.mainPrice || a;
      const priceCourseB = (Number(b.discountPrice || 100) / 100) * b.mainPrice;

      return Number(priceCourseA) + Number(priceCourseB);
    });
  } else if (data.courses.length === 1) {
    data.totalPriceCourses = (Number(data.courses[0].discountPrice || 100) / 100) * data.courses[0].mainPrice;
  }

  const clickHandlerClearingPrice = () => {
    // update userData in localStorage for when that requestAxios felid! then recover userData from localStorage
    setIsPosting(() => true);
    window.sessionStorage.setItem('userData', JSON.stringify(userData));
    changeUserData(ACTION_TYPE.ADD_CARD_BOUGHT, JSON.parse(JSON.stringify(userData.selectedCards)));
    changeUserData(ACTION_TYPE.DEL_ALL_CARD_SELECTED);
  };

  useEffect(() => {
    if (isPosting) {
      axios
        .patch(`https://dbserver.liara.run/users/${userData.id}`, userData)
        .then((response) => {
          setIsPosting(() => false);

          if (response.status === 200) {
            Swal.fire({
              icon: 'success',
              text: 'پرداخت باموفقیت انجام شد',
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 2000,
            })
              .then(() => {
                navigate('/account/courses/bought');
              })
              .catch((err) => {});
          } else {
            setNotification(ACTION_TYPE_NOTIFICATION.ADD_ERR, 'خطا! دوباره سعی کنید.');

            // Recovery Data User Login from sessionStorage!
            const recoveryUserData = JSON.parse(window.sessionStorage.getItem('userData'));
            changeUserData(ACTION_TYPE.PUT_DATA, recoveryUserData);
          }
        })

        .catch((err) => {
          setIsPosting(() => false);

          if (err.message.includes('500')) {
            Swal.fire({
              icon: 'success',
              text: 'پرداخت باموفقیت انجام شد',
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 2000,
            })
              .then(() => {
                navigate('/account/courses/bought');
              })
              .catch((err) => {});
          } else {
            setNotification(ACTION_TYPE_NOTIFICATION.ADD_ERR, 'خطا!!!! دوباره سعی کنید.');

            // Recovery Data User Login from sessionStorage!
            const recoveryUserData = JSON.parse(window.sessionStorage.getItem('userData'));
            changeUserData(ACTION_TYPE.PUT_DATA, recoveryUserData);
          }
        });
    }
  }, [userData]);

  const formattingPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className='container-coursesAccount' ref={containerCoursesAccount}>
      {data.courses.map((course) => {
        return <CardCourseAccount key={course.id} {...course} isCourseSelected={data.isCourseSelected} />;
      })}

      {data.courses.length === 0 ? (
        <b className='no-courses'>هیچ دوره انتخاب نشده است</b>
      ) : (
        data.isCourseSelected && (
          <div className='clearing-price'>
            <b className='total-price'>{formattingPrice(data.totalPriceCourses)} : مجموع پرداختی</b>

            <button className='buy-course' type='button' onClick={clickHandlerClearingPrice}>
              {isPosting ? <SmallLoading /> : 'پرداخت'}
            </button>
          </div>
        )
      )}
    </div>
  );
};
export default CoursesAccount;
