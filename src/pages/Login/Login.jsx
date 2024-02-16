import { useState } from 'react';
import './Login.css';

const Login = () => {
  const [isShowLoginForm, setIsShowLoginForm] = useState(false);

  const changeHandlerRadioLoginSign = () => {
    setIsShowLoginForm((prevState) => !prevState);
  };

  return (
    <div className='container-login'>
      <div className='btns-login'>
        <input type='radio' name='login-sign' id='login' defaultChecked onChange={changeHandlerRadioLoginSign} />
        <label htmlFor='login' className='login'>
          ورود
        </label>

        <input type='radio' name='login-sign' id='sign' onChange={changeHandlerRadioLoginSign} />
        <label htmlFor='sign'>ثبت نام</label>
        <div className='slider' />
      </div>

      <div className={`forms ${isShowLoginForm && 'form-login-show'}`}>
        <div className='form-login'>
          <div className='title'>ورود</div>
          <label className='lbl-username' htmlFor='username'>
            نام کاربری
          </label>
          <input className='input-username' type='text' id='username' placeholder='یوزرنیم خود را وارد کنید' />

          <label className='lbl-pass' htmlFor='password'>
            پسورد
          </label>
          <input className='input-pass' type='password' id='password' placeholder='پسورد خود را وارد کنید' />
          <a href='' className='forget-pass'>
            رمز فراموش کرده اید؟
          </a>

          <label className='remember' htmlFor='remember'>
            <input type='checkbox' id='remember' />
            مرا به خاطر بسپار!
          </label>
          <button className='btn-login-sign'>ورود</button>
        </div>
        <div className='form-sign'>
          <div className='title'>ثبت نام</div>
          <label className='lbl-username' htmlFor='username'>
            نام کاربری
          </label>
          <input className='input-username' type='text' id='username' placeholder='یوزرنیم خود را وارد کنید' />

          <label className='lbl-pass' htmlFor='password'>
            پسورد
          </label>
          <input className='input-pass' type='password' id='password' placeholder='پسورد خود را وارد کنید' />

          <label className='lbl-rpt-pass' htmlFor='rpt-password'>
            تکرار پسورد
          </label>
          <input className='input-pass' type='rpt-password' id='rpt-password' placeholder='پسورد خود را تکرار کنید' />

          <button className='btn-login-sign'>ثبت نام</button>
        </div>
      </div>
    </div>
  );
};
export default Login;
