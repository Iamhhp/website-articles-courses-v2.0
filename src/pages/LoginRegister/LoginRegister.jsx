import './LoginRegister.css';
import { useEffect, useState } from 'react';
import FromForgetPass from '../../components/FormForgetPass/FromForgetPass';
import FormLogin from '../../components/FormLogin/FormLogin';
import FormRegister from '../../components/FormRegister/FormRegister';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';

const LoginRegister = () => {
  const pathRoute = window.location.pathname;
  const navigate = useNavigate();
  const [isShowFormLoginRegister, setIsShowFormLoginRegister] = useState(true);
  useEffect(() => {
    if (pathRoute === '/login-register') {
      navigate('login');
    }
  }, []);

  return (
    <div className='container-user-login'>
      <Routes>
        <Route path='forget-password' element={<FromForgetPass setIsShowFormLoginRegister={setIsShowFormLoginRegister} />} />
      </Routes>

      {isShowFormLoginRegister && (
        <div className='container-form-login-register'>
          <div className='btns-switch-login'>
            <NavLink to={'login'} className='login' tabIndex={-1}>
              ورود
            </NavLink>

            <NavLink to={'register'} className='register' tabIndex={-1}>
              ثبت نام
            </NavLink>
            <div className='slider' />
          </div>

          <div className='forms'>
            <Routes>
              <Route path='login' element={<FormLogin setIsShowFormLoginRegister={setIsShowFormLoginRegister} />} />
              <Route path='register' element={<FormRegister />} />
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
};
export default LoginRegister;
