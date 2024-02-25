import './Header.css';
import { Col, Row, Container } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { SlBasket } from 'react-icons/sl';
import { FaChevronUp } from 'react-icons/fa';
import { memo, useEffect, useRef, useState } from 'react';
import persianDate from 'persian-date';
import OffCanVas from '../OffCanVas/OffCanVas';
import { AiOutlineMenuFold } from 'react-icons/ai';

const Header = () => {
  useEffect(() => {
    console.log('Header reRender!');
  });

  const elementDate = useRef(null);
  useEffect(() => {
    const elementDay = elementDate.current.children[0];
    const elementTime = elementDate.current.children[1];

    const updateTime = () => {
      const date = new persianDate(new Date());
      elementDay.innerText = date.format('dddd');
      elementTime.innerText = date.format('HH:mm:ss');
    };

    const timer = window.setInterval(updateTime, 1000);

    // Function Cleanup
    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const itemsHeaderMenu = (
    <ul>
      <li>
        <NavLink tabIndex='-1' to='/Home'>
          خانه
        </NavLink>
      </li>

      <li>
        <NavLink tabIndex='-1' to='/Courses'>
          دوره ها
        </NavLink>
      </li>

      <li className='drop-down-menu'>
        <NavLink tabIndex='-1' to='/Articles' className='main-menu'>
          مقالات
          <FaChevronUp className='icon' />
        </NavLink>

        <div className={'sub-menu'}>
          <Link tabIndex='-1' to={'/Article/Create/0'}>
            ایجاد مقاله
          </Link>
        </div>
      </li>

      <li>
        <NavLink tabIndex='-1' to='/About-us'>
          درباره ما
        </NavLink>
      </li>
    </ul>
  );

  const [isShowMenu, setIsShowMenu] = useState(false);
  const iconOffMenuClickHandler = () => {
    setIsShowMenu(true);
  };

  return (
    <>
      {isShowMenu && <OffCanVas title={'منو اصلی'} itemsMenu={itemsHeaderMenu} stateShowMenu={{ isShowMenu, setIsShowMenu }} />}

      <Container fluid className='container-header'>
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
            <Link to={'/Login'} className='btn-login'>
              ورود
            </Link>
            <button className='btn-basket'>
              <SlBasket className='icon' />
            </button>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default memo(Header);
