import './Account.css';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import DetailsAccount from '../DetailsAccount/DetailsAccount';
import CoursesAccount from '../CoursesAccount/CoursesAccount';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../context/Redux/userSlice';

const Account = () => {
  const navigate = useNavigate();
  const setUserData = useDispatch();
  const {
    info: { boughtCards, selectedCards },
  } = useSelector((state) => state.user);

  const clickHandlerExitAccount = () => {
    Swal.fire({
      icon: 'question',
      text: 'آیا از سایت خارج می شوید؟',
      showCancelButton: true,
      cancelButtonText: 'خیر',
      cancelButtonColor: 'green',
      showConfirmButton: true,
      confirmButtonText: 'بله',
      confirmButtonColor: 'red',
    })
      .then((result) => {
        if (result.isConfirmed) {
          setUserData(logOut());
          window.localStorage.removeItem('userData');
          window.sessionStorage.removeItem('userData');
          navigate('/home');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container fluid='md'>
      <div className='container-account'>
        <Row>
          <Col className='col-12 col-lg-4 col-xl-3'>
            <div className='sec-r'>
              <div className='img'>
                <img src='https://secure.gravatar.com/avatar/957e7f28ff111d0eb26e0fe51d9650d5?s=80&d=mm&r=g' alt='' />
              </div>
              <div className='name-user'>حسن پور</div>
              <ul className='items-menu-account'>
                <Row className='row-cols-1 row-cols-sm-2 row-cols-lg-1'>
                  <Col>
                    <li>
                      <NavLink tabIndex='-1' to='/account/courses/selected'>
                        سبد خرید
                        {selectedCards.length !== 0 && <span className='number-courses'>{selectedCards.length}</span>}
                      </NavLink>
                    </li>
                  </Col>

                  <Col>
                    <li>
                      <NavLink tabIndex='-1' to='/account/courses/bought'>
                        دوره های خریداری شده
                        {boughtCards.length !== 0 && <span className='number-courses'>{boughtCards.length}</span>}
                      </NavLink>
                    </li>
                  </Col>

                  <Col>
                    <li>
                      <NavLink tabIndex='-1' to='/account/details'>
                        اطلاعات حساب کاربری
                      </NavLink>
                    </li>
                  </Col>

                  <Col>
                    <li>
                      <button type='button' className='btn-exit' tabIndex='-1' onClick={clickHandlerExitAccount}>
                        خروج از سایت
                      </button>
                    </li>
                  </Col>
                </Row>
              </ul>
            </div>
          </Col>

          <Col className='col-12 col-lg-8 col-xl-9'>
            <div className='sec-l'>
              <Routes>
                <Route path='Details' element={<DetailsAccount />} />
                <Route path='Courses/:subRoute' element={<CoursesAccount />} />
              </Routes>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};
export default Account;
