import './Header.css';
import { Col, Row, Container } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { SlBasket } from 'react-icons/sl';
import { FaChevronUp } from 'react-icons/fa';
import { memo, useEffect, useRef, useState } from 'react';
import persianDate from 'persian-date';
import OffCanVas from '../OffCanVas/OffCanVas';
import { AiOutlineMenuFold } from 'react-icons/ai';
import { IoCaretUpOutline } from 'react-icons/io5';
import Notification from '../Notification/Notification';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { putUserData, updateStatus } from '../../context/Redux/userSlice';
import { addNotificationErr, addNotificationMsg } from '../../context/Redux/notificationDataSlice';

const Header = ({ themeMode }) => {
  useEffect(() => {
    console.log('Header reRender!');
  });

  const {
    status: { isLogin },
    info: { selectedCards },
  } = useSelector((state) => state.user);
  const setUserData = useDispatch();
  const notification = useSelector((state) => state.notificationData);
  const setNotification = useDispatch();

  const elementDate = useRef(null);
  const [isShowMenu, setIsShowMenu] = useState(false);

  // move userData to Context-API ////////////////////////////////////////////////////////////////
  const autoLoginUser = async (userDataStorage) => {
    const response = await axios.get(`https://dbserver.liara.run/users/${userDataStorage.userId}`);
    if (response.status === 200) {
      const userDataApi = response.data;
      if (userDataApi) {
        setUserData(putUserData(userDataApi));
        setUserData(updateStatus({ isLogin: true, isRemember: userDataStorage }));
        // maybe isRemember false and Browser Refresh so data localStorage move sessionStorage and localStorage Cleared!
        window.localStorage.setItem('userData', JSON.stringify({ isRemember: userDataStorage.isRemember, userId: userDataApi.id }));

        setNotification(addNotificationMsg('ورود خودکار کاربر! شما وارد سایت شدید!'));
      } else {
        setNotification(addNotificationErr('خطا در ورود خودکار کاربر! دوباره وارد شوید'));
      }
    } else {
      setNotification(addNotificationErr('خطا در ورود خودکار کاربر! دوباره وارد شوید'));
    }
  };

  useEffect(() => {
    const userDataStorage = JSON.parse(window.localStorage.getItem('userData')) || JSON.parse(window.sessionStorage.getItem('userData'));
    if (userDataStorage) {
      if (!isLogin && userDataStorage.userId !== -1) {
        autoLoginUser(userDataStorage).catch((err) => {
          setNotification(addNotificationErr('خطا در ورود خودکار کاربر! دوباره وارد شوید'));
        });
      }
    }
  }, [isLogin]);

  // Run Code First Rendering WebSite
  useEffect(() => {
    const beforeUnloadBrowser = (e) => {
      const userDataLocal = JSON.parse(window.localStorage.getItem('userData'));
      if (userDataLocal) {
        if (userDataLocal.isRemember) {
          window.localStorage.setItem('userData', JSON.stringify(userDataLocal));
        } else {
          window.sessionStorage.setItem('userData', JSON.stringify(userDataLocal)); // for when Browser Refreshing and login again
          window.localStorage.removeItem('userData');
        }
      } else {
        // when in other tab logged out and localStorage in all tab cleared but sessionStorage in here tab not clear!
        window.sessionStorage.removeItem('userData');
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
    setNotification(addNotificationMsg('به وب سایت آموزشی و پژوهشی خوش آمدید!'));

    // Function Cleanup //////////////////////////////////////////////////////////////////////////////
    return () => {
      window.clearInterval(timerId01);
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
    <Container fluid className='container-header' theme-mode={themeMode}>
      {isShowMenu && <OffCanVas title={'منو اصلی'} itemsMenu={itemsHeaderMenu} stateShowMenu={{ isShowMenu, setIsShowMenu }} />}

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

        <Col className='col-auto'>
          <div className='sec-l'>
            <Link to={'/account/details'} className={'btn-login'} style={!isLogin ? { width: '20px' } : { width: '' }} tabIndex={-1}>
              {isLogin ? 'حساب کاربری' : 'ورود'}
              <IoCaretUpOutline className='icon-drop-down' />
            </Link>

            <Link to={'/account/courses/selected'} className='btn-basket' tabIndex={-1}>
              <SlBasket className='icon' />

              {selectedCards.length !== 0 && <span className='number-courses'>{selectedCards.length}</span>}
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default memo(Header);
