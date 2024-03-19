import './LoginRegister.css';
import { useEffect, useState } from 'react';
import FromForgetPass from '../../components/FormForgetPass/FromForgetPass';
import FormLogin from '../../components/FormLogin/FormLogin';
import FormRegister from '../../components/FormRegister/FormRegister';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';

const LoginRegister = () => {
  const navigate = useNavigate();
  const pathRoute = window.location.pathname;
  const [isShowFormForgetPass, setIsShowFormForgetPass] = useState(false);

  useEffect(() => {
    if (pathRoute === '/login-register' || pathRoute === '/login-register/' || pathRoute === '/login-register/forget-password') {
      navigate('login');
    }
  }, []);

  return (
    <div className='container-user-login'>
      <Routes>
        <Route path='forget-password' element={<FromForgetPass setIsShowFormForgetPass={setIsShowFormForgetPass} />} />
      </Routes>

      {!isShowFormForgetPass && (
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
              <Route path='login' element={<FormLogin setIsShowFormForgetPass={setIsShowFormForgetPass} />} />
              <Route path='register' element={<FormRegister />} />
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
};
export default LoginRegister;
