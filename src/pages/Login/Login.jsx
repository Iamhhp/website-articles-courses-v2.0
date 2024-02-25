import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormLogin from '../../components/FormLogin/FormLogin';
import FormSign from '../../components/FormSign/FromSign';
import FromForgetPass from '../../components/FormForgetPass/FromForgetPass';

const Login = () => {
  const navigte = useNavigate();
  const [isShowFormLogin, setIsShowFormLogin] = useState(true);
  const [isShowForgetPass, setIsShowForgetPass] = useState(false);

  ////////////////////////////////////////////////////////////////////////////////////// Function Handler Select From Login OR Sign
  const changeHandlerRadioLoginSign = () => {
    setIsShowFormLogin((prevState) => !prevState);
  };

  return (
    <div className='container-user-login'>
      {isShowForgetPass ? (
        <FromForgetPass setIsShowForgetPass={setIsShowForgetPass} />
      ) : (
        <div className='container-form-login-sign'>
          <div className='btns-switch-login'>
            <input type='radio' name='login-sign' id='login' defaultChecked onChange={changeHandlerRadioLoginSign} />
            <label htmlFor='login' className='login'>
              ورود
            </label>

            <input type='radio' name='login-sign' id='sign' onChange={changeHandlerRadioLoginSign} />
            <label htmlFor='sign'>ثبت نام</label>
            <div className='slider' />
          </div>

          <div className='forms'>{isShowFormLogin ? <FormLogin setIsShowForgetPass={setIsShowForgetPass} /> : <FormSign setIsShowFormLogin={setIsShowFormLogin} />}</div>
        </div>
      )}
    </div>
  );
};
export default Login;
