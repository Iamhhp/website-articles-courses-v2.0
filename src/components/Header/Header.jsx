import './Header.css';
import { Col, Row, Container } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { SlBasket } from 'react-icons/sl';
import { FaChevronUp } from 'react-icons/fa';
import { memo, useEffect, useRef, useState } from 'react';
import persianDate from 'persian-date';
import OffCanVas from '../OffCanVas/OffCanVas';
import { AiOutlineMenuFold } from 'react-icons/ai';
import { useChangeUserDataContext, useNotificationContext, useSetNotificationContext, useUserDataContext } from '../../context/DataContext';
import { ACTION_TYPE } from '../../context/hooks/useUserDataReducer';
import Notification from '../Notification/Notification';
import { ACTION_TYPE_NOTIFICATION } from '../../context/hooks/useNotification';
import axios from 'axios';

const Header = () => {
  useEffect(() => {
    console.log('Header reRender!');
  });

  const { isLogin, selectedCards } = useUserDataContext();
  const changeUserData = useChangeUserDataContext();
  const notification = useNotificationContext();
  const setNotification = useSetNotificationContext();

  const elementDate = useRef(null);
  const [isShowMenu, setIsShowMenu] = useState(false);

  // // move userData to Context-API ////////////////////////////////////////////////////////////////
  const autoLoginUser = async (userDataStorage) => {
    const response = await axios.get(`https://dbserver.liara.run/users/${userDataStorage.userId}`);
    if (response.status === 200) {
      const userDataApi = response.data;
      if (userDataApi) {
        changeUserData(ACTION_TYPE.PATCH_DATA, { isLogin: true, isRemember: userDataStorage.isRemember, ...userDataApi });
        window.localStorage.setItem('userData', JSON.stringify({ isLogin: true, isRemember: userDataStorage.isRemember, userId: userDataApi.id }));

        setNotification(ACTION_TYPE_NOTIFICATION.ADD_MSG, 'ورود خودکار کاربر! شما وارد سایت شدید!');
      } else {
        setNotification(ACTION_TYPE_NOTIFICATION.ADD_MSG, 'خطا در ورود خودکار کاربر! دوباره وارد شوید');
      }
    } else {
      setNotification(ACTION_TYPE_NOTIFICATION.ADD_MSG, 'خطا در ورود خودکار کاربر! دوباره وارد شوید');
    }
  };

  // localStorage for when isRemember true and before browser closed!
  // sessionStorage for when isRemember false and Browser Refreshing not Close
  const userDataStorage = JSON.parse(window.localStorage.getItem('userData')) || JSON.parse(window.sessionStorage.getItem('userData')) || { isLogin: false, userId: -1 };
  if (!userDataStorage.isLogin && userDataStorage.userId !== -1) {
    // if isRemember equal false then refresh browser move data from localStorage to sessionStorage and clear localStorage in FunctionCleanup so need

    autoLoginUser(userDataStorage).catch((err) => {
      setNotification(ACTION_TYPE_NOTIFICATION.ADD_MSG, 'خطا در ورود خودکار کاربر! دوباره وارد شوید');
    });
  }

  // Run Code First Rendering WebSite
  useEffect(() => {
    const beforeUnloadBrowser = () => {
      // // update userData in localStorage and sessionStorage
      const userData = JSON.parse(window.localStorage.getItem('userData')) || { isRemember: false };
      if (!userData.isRemember) {
        // localStorage for when isRemember true and before browser closed!
        // sessionStorage for when isRemember false and Browser Refreshing not Close
        window.sessionStorage.setItem('userData', JSON.stringify({ ...userData, isLogin: false }));
        window.localStorage.removeItem('userData');
      }
    };
    window.addEventListener('beforeunload', beforeUnloadBrowser);

    // update Time ///////////////////////////////////////////////////////////////////////////////////
    const elementDay = elementDate.current.children[0];
    const elementTime = elementDate.current.children[1];

    const updateTime = () => {
      const date = new persianDate(new Date());
      elementDay.innerText = date.format('dddd');
      elementTime.innerText = date.format('HH:mm:ss');
    };
    const timerId01 = window.setInterval(updateTime, 1000);

    // ADD Notification WellCome ////////////////////////////////////////////////////////////////////
    setNotification(ACTION_TYPE_NOTIFICATION.ADD_MSG, 'به وب سایت آموزشی و پژوهشی خوش آمدید!');

    const timerId02 = window.setTimeout(() => {
      const { isLogin } = JSON.parse(window.localStorage.getItem('userData')) || JSON.parse(window.sessionStorage.getItem('userData')) || { isLogin: false };
      if (!isLogin) {
        setNotification(ACTION_TYPE_NOTIFICATION.ADD_ERR, 'جهت استفاده از امکانات سایت لطفا وارد شوید!!');
      }
    }, 500);

    // Function Cleanup //////////////////////////////////////////////////////////////////////////////
    return () => {
      window.clearInterval(timerId01);
      window.clearTimeout(timerId02);
      window.removeEventListener('beforeunload', beforeUnloadBrowser);
    };
  }, []);

  const itemsHeaderMenu = (
    <ul>
      <li>
        <NavLink tabIndex='-1' to='/home'>
          خانه
        </NavLink>
      </li>

      <li>
        <NavLink tabIndex='-1' to='/courses'>
          دوره ها
        </NavLink>
      </li>

      <li className='drop-down-menu'>
        <NavLink tabIndex='-1' to='/articles' className='main-menu'>
          مقالات
          <FaChevronUp className='icon' />
        </NavLink>

        <div className={'sub-menu'}>
          <Link tabIndex='-1' to={'/article/create/0'}>
            ایجاد مقاله
          </Link>
        </div>
      </li>

      <li>
        <NavLink tabIndex='-1' to='/about-us'>
          درباره ما
        </NavLink>
      </li>
    </ul>
  );

  const iconOffMenuClickHandler = () => {
    setIsShowMenu(true);
  };

  return (
    <>
      {isShowMenu && <OffCanVas title={'منو اصلی'} itemsMenu={itemsHeaderMenu} stateShowMenu={{ isShowMenu, setIsShowMenu }} />}

      <Container fluid className='container-header'>
        {notification.map((noti, i) => (
          <Notification key={noti.id} {...{ ...noti, i }} />
        ))}

        <Row className='row-header'>
          <Col className='sec-r col-auto'>
            {itemsHeaderMenu} <AiOutlineMenuFold className='icon-OffCanVas' onClick={iconOffMenuClickHandler} />
          </Col>

          <Col className='sec-m col-auto'>
            <div className='lbl-website'>وب سایت سایت آموزشی پژوهشی</div>
            <div className='date' ref={elementDate}>
              <div className='day'>شنبه</div>
              <div className='time'>17:22:22</div>
            </div>
          </Col>

          <Col className='sec-l col-auto'>
            <Link to={'/account/details'} className='btn-login'>
              {isLogin ? 'حساب کاربری' : 'ورود'}
            </Link>

            <Link to={'/account/courses/selected'} className='btn-basket'>
              <SlBasket className='icon' />

              {selectedCards.length !== 0 && <span className='number-courses'>{selectedCards.length}</span>}
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default memo(Header);
