import './FormLogin.css';
import { useEffect, useRef, useState } from 'react';
import { isEmptyInputs, showDialog } from '../../utils';
import { useChangeUserDataContext, useSetNotificationContext, useUserDataContext } from '../../context/DataContext';
import { ACTION_TYPE } from '../../context/hooks/useUserDataReducer';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import SmallLoading from '../SmallLoading/SmallLoading';
import axios from 'axios';
import { ACTION_TYPE_NOTIFICATION } from '../../context/hooks/useNotification';

const FormLogin = ({ setIsShowFormLoginRegister }) => {
  const formLogin = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { isLogin } = useUserDataContext();
  const changeUserData = useChangeUserDataContext();
  const setNotification = useSetNotificationContext();
  const cancelAxiosToken = useRef(axios.CancelToken.source());
  const isRequested = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  useEffect(() => {
    if (isLogin) {
      navigate('/home');
      return;
    }

    window.setTimeout(() => {
      formLogin.current?.classList.add('form-login-show');
    }, 10);

    // Function Clean up
    return () => {
      if (isRequested.current) {
        cancelAxiosToken.current.cancel('closeFormLogin');
      }
    };
  }, []);

  ////////////////////////////////////////////////////////////////////////////////////// Function Handler Button Login
  const clickHandlerLogin = () => {
    const inputsFormLogin = [...formLogin.current.elements].slice(0, -1);
    const inputUsername = inputsFormLogin[0];
    const inputPassword = inputsFormLogin[1];
    const CBRememberMe = inputsFormLogin[3];

    if (isLoading) {
      return;
    }

    const { isEmpty, inputEmpty } = isEmptyInputs(inputsFormLogin.slice(0, -1));
    if (isEmpty) {
      showDialog('error', `لطفا ورودی "${inputEmpty.ariaLabel}" را پر کنید!`, inputEmpty);
      return;
    }

    setIsLoading(() => true);
    isRequested.current = true;
    axios
      .get(`https://dbserver.liara.run/users?username=${inputUsername.value}`, { cancelToken: cancelAxiosToken.current.token })
      .then((response) => {
        if (response.status === 200) {
          const userData = response.data[0];
          if (userData) {
            const passwordUser = userData.password;
            if (inputPassword.value === passwordUser) {
              changeUserData(ACTION_TYPE.PATCH_DATA, { isLogin: true, isRemember: CBRememberMe.checked, ...userData }); // move userData to ContextApi
              window.localStorage.setItem('userData', JSON.stringify({ isLogin: true, isRemember: CBRememberMe.checked, userId: userData.id })); // save userData in the localStorage for when refresh page

              Swal.fire({
                icon: 'success',
                text: 'ورود با موفقیت انجام شد!',
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 900,
              })
                .then(() => {
                  navigate('/account/details');
                })
                .catch((err) => {});
            } else {
              showDialog('error', 'رمز عبور وارد شده اشتباه می باشد!');
            }
          } else {
            showDialog('error', `همچین نام کاربری "${inputUsername.value}" ثبت نشده است`);
          }
        }
      })
      .catch((err) => {
        if (err.message !== 'closeFormLogin') {
          showDialog('error', `خطا در ارتباط با سرور! ${err}`);
        } else if (axios.isCancel(err)) {
          setNotification(ACTION_TYPE_NOTIFICATION.ADD_ERR, 'ورود به سایت لغو شد!');
        }
      })
      .finally(() => {
        setIsLoading(() => false);
        isRequested.current = false;
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
    navigate('/login-register/forget-password');
    setIsShowFormLoginRegister(() => false);
  };

  ////////////////////////////////////////////////////////////////////////////////////// Function Handler Inputs Pass & RptPass
  const keyDownHandlerInputPassword = (e) => {
    const keyDown = e.key;
    const codeAscii = keyDown.charCodeAt(0);
    if (keyDown === 'Enter') {
      e.preventDefault();
      clickHandlerLogin();
      return;
    }

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
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            clickHandlerLogin();
          }
        }}
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
        <label className='show-pass-login'>
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
        {isLoading ? <SmallLoading /> : 'ورود'}
      </button>
    </form>
  );
};
export default FormLogin;
