import './FromForgetPass.css';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { showDialog } from '../../utils';
import { memo, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const FromForgetPass = ({ setIsShowFormForgetPass }) => {
  const navigate = useNavigate();
  const formForgetPass = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.setTimeout(() => {
      formForgetPass.current?.classList.add('form-forget-pass-show');
    }, 10);
  }, []);

  ////////////////////////////////////////////////////////////////////////////////////// Function Handler Button Forget Password
  const clickHandlerRecoveryPassword = () => {
    const inputEmail = formForgetPass.current.children[3];

    if (isLoading) {
      return;
    }

    if (!inputEmail.value) {
      showDialog('error', `لطفا ورودی "ایمیل" پرکنید`, inputEmail);
      return;
    }

    setIsLoading(() => true);
    window.setTimeout(() => {
      setIsLoading(() => false);

      inputEmail.value = '';
      Swal.fire({
        icon: 'success',
        text: 'ایمیل بازیابی رمز فرستاده شد!',
        showConfirmButton: true,
      }).then(() => {
        clickHandlerForgetPass();
      });
    }, 500);
  };

  const blurHandlerInputEmail = (e) => {
    const inputEmail = e.target;
    const lblInputEmail = inputEmail.previousElementSibling;
    if (inputEmail.value && (!inputEmail.value.includes('@') || !inputEmail.value.includes('.'))) {
      showDialog('error', 'فرمت ایمیل وارد شده صحیح نمی باشد! \t"info@example.com"');
      lblInputEmail.style.color = 'red';
      inputEmail.style.color = 'red';
      inputEmail.style.borderColor = 'red';
      inputEmail.style.boxShadow = '1px 1px 1px 0px red';
    }
  };

  const focusHandlerInputEmail = (e) => {
    const inputEmail = e.target;
    const lblInputEmail = inputEmail.previousElementSibling;
    lblInputEmail.style.color = '';
    inputEmail.style.color = '';
    inputEmail.style.boxShadow = '';
    inputEmail.style.borderColor = '';
  };

  ////////////////////////////////////////////////////////////////////////////////////// Function Handler Forget Password
  const clickHandlerForgetPass = () => {
    formForgetPass.current.classList.remove('form-forget-pass-show');
    window.setTimeout(() => {
      setIsShowFormForgetPass(() => false);
      navigate('/login-register/login');
    }, 200);
  };

  return (
    <div className='form-forget-pass' ref={formForgetPass}>
      <div className='header'>
        <div className='title'>فراموشی رمز عبور</div>
        <IoMdArrowRoundBack className='icon-back' onClick={clickHandlerForgetPass} />
      </div>
      <div className='desc'>لطفا ایمیلی را که با آن ثبت نام کرده اید وارد کنید!</div>

      <label className='lbl-email'>ایمیل</label>
      <input className='input-email' type='email' name='email' id='email' aria-label='ایمیل' placeholder='ایمیل خود را وارد کنید!' onBlur={blurHandlerInputEmail} onFocus={focusHandlerInputEmail} />

      <button className='btn-recovery' type='button' onClick={clickHandlerRecoveryPassword}>
        {isLoading ? <div className='btn-loading' /> : 'بازیابی رمز عبور'}
      </button>
    </div>
  );
};
export default memo(FromForgetPass);
