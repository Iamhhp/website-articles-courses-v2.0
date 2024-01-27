import './Header.css';
import { Col, Row, Container } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { SlBasket } from 'react-icons/sl';
import { FaChevronUp } from 'react-icons/fa';

const Header = () => {
  return (
    <Container fluid>
      <Row className='container-header'>
        <Col className='sec-r'>
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

        <Col className='sec-m'>
          <div className='lbl-website'>وب سایت سایت آموزشی پژوهشی</div>
          <div className='date'>17:20:22 شنیه</div>
        </Col>

        <Col className='sec-l'>
          <button className='btn-login'>ورود</button>
          <button className='btn-basket'>
            <SlBasket className='icon' />
          </button>
        </Col>
      </Row>
    </Container>
  );
};
export default Header;
