import './FormLogin.css';
import { useEffect, useRef, useState } from 'react';
import { isEmptyInputs, showDialog } from '../../utils';
import { useChangeUserDataContext } from '../../context/UserDataContext';
import { ACTION_TYPE } from '../../context/useUserDataReducer';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const FormLogin = ({ setIsShowForgetPass }) => {
  const formLogin = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const changeUserData = useChangeUserDataContext();

  useEffect(() => {
    window.setTimeout(() => {
      formLogin.current.classList.add('form-login-show');
    }, 100);
  }, []);

  ////////////////////////////////////////////////////////////////////////////////////// Function Handler Button Login
  const clickHandlerLogin = () => {
    const inputsFormLogin = [...formLogin.current.elements].slice(0, -1);
    const inputUsername = inputsFormLogin[0];
    const inputPassword = inputsFormLogin[1];
    const CBRememberMe = inputsFormLogin[2];

    if (isLoading) {
      return;
    }

    const { isEmpty, inputEmpty } = isEmptyInputs(inputsFormLogin.slice(0, -1));
    if (isEmpty) {
      showDialog('error', `لطفا ورودی "${inputEmpty.ariaLabel}" را پر کنید!`, inputEmpty);
      return;
    }

    setIsLoading(() => true);
    fetch(`https://dbserver.liara.run/users?username=${inputUsername.value}`).then((response) => {
      if (response.status === 200) {
        response
          .json()
          .then((userData) => {
            setIsLoading(() => false);
            if (userData.length) {
              const passwordUser = userData[0].password;
              if (inputPassword.value === passwordUser) {
                if (CBRememberMe.checked) {
                  window.localStorage.setItem('userData', JSON.stringify(userData[0]));
                }

                changeUserData(ACTION_TYPE.PUT_ALL, userData[0]);
                changeUserData(ACTION_TYPE.IS_LOGIN, true);
                Swal.fire({
                  icon: 'success',
                  text: 'ورود با موفقیت انجام شد!',
                  showConfirmButton: true,
                }).then(() => {
                  navigate('/Home');
                });
              } else {
                showDialog('error', 'رمز عبور وارد شده اشتباه می باشد!');
              }
            } else {
              showDialog('error', `همچین نام کاربری "${inputUsername.value}" ثبت نشده است`);
            }
          })
          .catch((err) => {
            setIsLoading(() => false);
            showDialog('error', `خطا در ارتباط با سرور!\n${err}`);
          });
      }
    });
  };

  ////////////////////////////////////////////////////////////////////////////////////// Function Handler CheckBox Show Password
  const changeHandlerShowPass = (e) => {
    const isChecked = e.target.checked;
    const inputPass = formLogin.current.elements[1];

    if (isChecked) {
      inputPass.type = 'text';
    } else {
      inputPass.type = 'password';
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////// Function Handler Forget Password
  const clickHandlerForgetPass = () => {
    setIsShowForgetPass(() => true);
  };

  ////////////////////////////////////////////////////////////////////////////////////// Function Handler Inputs Pass & RptPass
  const keyDownHandlerInputPassword = (e) => {
    const codeAscii = e.key.charCodeAt(0);
    if (codeAscii >= 0x0600 && codeAscii <= 0x06ff) {
      showDialog('info', 'لطفا زبان صفحه کلید خود را انگلیسی کنید!');
    }
  };

  const blurHandlerInputs = (e) => {
    e.target.value = e.target.value.trim();
  };

  return (
    <form className='form-login' ref={formLogin}>
      <div className='title'>ورود</div>

      <label className='lbl-username'>نام کاربری</label>
      <input
        className='input-username'
        type='text'
        id='username'
        name='username'
        autoComplete='username'
        aria-label='نام کاربری'
        placeholder='نام کاربری خود را وارد کنید'
        onBlur={blurHandlerInputs}
      />

      <label className='lbl-pass'>پسورد</label>
      <input
        className='input-pass'
        type='password'
        id='password'
        name='password'
        aria-label='پسورد'
        autoComplete='current-password'
        placeholder='پسورد خود را وارد کنید'
        onBlur={blurHandlerInputs}
        onKeyDown={keyDownHandlerInputPassword}
      />
      <div className='forget-show-pass'>
        <label htmlFor='show-pass-login'>
          <input type='checkbox' name='show-pass-login' id='show-pass-login' onChange={changeHandlerShowPass} />
          نمایش رمز عبور
        </label>

        <b className='forget-pass' onClick={clickHandlerForgetPass}>
          رمز فراموش کرده اید؟
        </b>
      </div>

      <label className='remember' htmlFor='remember'>
        <input type='checkbox' id='remember' />
        مرا به خاطر بسپار!
      </label>
      <button type='button' className='btn-login' onClick={clickHandlerLogin}>
        {isLoading ? <div className='btn-loading' /> : 'ورود'}
      </button>
    </form>
  );
};
export default FormLogin;
