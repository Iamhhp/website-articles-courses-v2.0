import './Header.css';
import { Col, Row, Container } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { SlBasket } from 'react-icons/sl';
import { FaChevronUp } from 'react-icons/fa';
import { memo, useEffect, useRef } from 'react';
import persianDate from 'persian-date';

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

  return (
    <Container fluid>
      <Row className='container-header'>
        <Col className='sec-r col-auto'>
          <ul>
            <li>
              <NavLink to='/Home' className='active'>
                خانه
              </NavLink>
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
  );
};
export default memo(Header);
