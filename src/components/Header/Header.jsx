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
    const timer = window.setInterval(() => {
      const date = new persianDate(new Date());
      const elementDay = elementDate.current.children[0];
      const elementTime = elementDate.current.children[1];

      elementDay.innerText = date.format('dddd');
      elementTime.innerText = date.format('HH:MM:ss');
    }, 1000);

    // Function Cleanup
    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const itemsHeaderMenu = (
    <ul>
      <li>
        <NavLink to='/Home'>خانه</NavLink>
      </li>

      <li>
        <NavLink to='/Courses'>دوره ها</NavLink>
      </li>

      <li className='drop-down-menu'>
        <NavLink to='/Articles' className='main-menu'>
          مقالات
          <FaChevronUp className='icon' />
        </NavLink>

        <div className={'sub-menu'}>
          <Link to={''}>ایجاد مقاله</Link>
        </div>
      </li>

      <li>
        <NavLink to='/About-us'>درباره ما</NavLink>
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

      <Container fluid>
        <Row className='container-header'>
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
            <button className='btn-login'>ورود</button>
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
