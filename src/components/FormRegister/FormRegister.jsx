import './FormRegister.css';
import { useEffect, useRef, useState } from 'react';
import { isEmptyInputs, showDialog } from '../../utils';
import axios from 'axios';
import zxcvbn from 'zxcvbn';
import Swal from 'sweetalert2';
import SmallLoading from '../SmallLoading/SmallLoading';
import { useNavigate } from 'react-router-dom';
import { useSetNotificationContext } from '../../context/DataContext';
import { ACTION_TYPE_NOTI, ACTION_TYPE_NOTIFICATION } from '../../context/hooks/useNotification';

const FormRegister = () => {
  const formRegister = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const cancelAxiosToken01 = useRef(axios.CancelToken.source());
  const cancelAxiosToken02 = useRef(axios.CancelToken.source());
  const isRequested = useRef(false);
  const setNotification = useSetNotificationContext();

  useEffect(() => {
    window.setTimeout(() => {
      formRegister.current?.classList.add('form-register-show');
    }, 10);

    // Function Cleanup
    return () => {
      if (isRequested.current) {
        cancelAxiosToken01.current.cancel('closeFormRegister');
        cancelAxiosToken02.current.cancel('closeFormRegister');
      }
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  ////////////////////////////////////////////////////////////////////////////////////// Function Handler Button Register
  const clickHandlerRegister = () => {
    const inputsFormRegister = [...formRegister.current.elements].slice(0, -1);
    const inputFName = inputsFormRegister[0];
    const inputLName = inputsFormRegister[1];
    const inputUsername = inputsFormRegister[2];
    const inputEmail = inputsFormRegister[3];
    const inputPass = inputsFormRegister[4];
    const inputRptPass = inputsFormRegister[6];
    const checkPass = zxcvbn(inputPass.value);

    if (isLoading) {
      return;
    }

    if (inputUsername.value && inputUsername.value.length < 4) {
      showDialog('info', 'طول نام کاربری انتخابی حداقل 4 کارکتر باشد.', inputUsername);
      return;
    }

    if (inputPass.value && checkPass.score < 2) {
      showDialog('error', 'لطفا امنیت رمز خود را با استفاده از کارکترهای زیر افزایش دهید.\n "!, ~ , @ , + , $ , uppercase"', inputPass);
      return;
    }

    if (inputPass.value && inputRptPass.value && inputPass.value !== inputRptPass.value) {
      showDialog('error', 'تکرار رمز مطابق ندارد', inputRptPass);
      return;
    }

    const { isEmpty, inputEmpty } = isEmptyInputs(inputsFormRegister);
    if (isEmpty) {
      showDialog('error', `لطفا ورودی "${inputEmpty.ariaLabel}" را پرکنید`, inputEmpty);
      return;
    }

    const postDataUser = () => {
      axios
        .post(
          'https://dbserver.liara.run/users',
          {
            username: inputUsername.value,
            password: inputPass.value,
            fName: inputFName.value,
            lName: inputLName.value,
            email: inputEmail.value,
            selectedCards: [],
            boughtCards: [],
          },
          { cancelToken: cancelAxiosToken02.current.token }
        )
        .then((response) => {
          if (response.status === 200) {
            Swal.fire({
              icon: 'success',
              text: 'ثبت نام انجام شد.\nاکنون می توانید وارد شوید',
              showConfirmButton: true,
            })
              .then(() => {
                navigate('/login-register/login'); // Move to Form Login
              })
              .catch((err) => {});
          }
        })
        .catch((err) => {
          if (err.massage.includes('500')) {
            Swal.fire({
              icon: 'success',
              text: 'ثبت نام انجام شد. \n اکنون می توانید وارد شوید',
              showConfirmButton: true,
            })
              .then(() => {
                navigate('/login-register/login'); // Move to Form Login
              })
              .catch((err) => {});
          } else if (axios.isCancel(err)) {
            setNotification(ACTION_TYPE_NOTIFICATION.ADD_ERR, 'ساخت حساب کاربری لغو شد!');
          } else if (err !== 'closeFormRegister') {
            showDialog('error', `ثبت نام انجام نشد! \n ${err}`);
          }
        })
        .finally(() => {
          setIsLoading(() => false);
          isRequested.current = false;
        });
    };

    /// Checking username is Exist!
    setIsLoading(() => true);
    isRequested.current = true;
    axios
      .get(`https://dbserver.liara.run/users?username=${inputUsername.value}`, {
        cancelToken: cancelAxiosToken01.current.token,
      })
      .then((response) => {
        if (response.status === 200) {
          const userData = response.data;
          if (userData.length) {
            setIsLoading(() => false);
            isRequested.current = false;

            showDialog('error', `نام کاربری "${inputUsername.value}" قبلا انتخاب شده یک نام کاربری دیگه انتخاب کنید!`, inputUsername);
          } else {
            postDataUser();
          }
        } else {
          setIsLoading(() => false);
          isRequested.current = false;

          showDialog('error', `خطا در ارتباط با سرور\n${response.statusText}`);
        }
      })
      .catch((err) => {
        setIsLoading(() => false);
        isRequested.current = false;

        if (err.message !== 'closeFormRegister') {
          showDialog('error', `خطا در ارتباط با سرور\n${err}`);
        }
      });
  };

  ////////////////////////////////////////////////////////////////////////////////////// Function Handler Inputs
  const changeHandlerInputPassword = (e) => {
    const colorBoxScore = ['red', 'yellow', 'yellow', 'green', 'green'];
    const boxesScore = [...e.target.nextElementSibling.children[1].children];
    const inputPass = e.target.value;
    const checkPass = zxcvbn(inputPass);
    const scorePass = checkPass.score;

    if (inputPass.length) {
      for (let l = 0; l <= 4; l++) {
        if (l <= scorePass) {
          boxesScore[l].style.backgroundColor = colorBoxScore[l];
        } else {
          boxesScore[l].style.backgroundColor = 'white';
        }
      }
    } else {
      boxesScore.forEach((box) => {
        box.style.backgroundColor = 'white';
      });
    }
  };

  const focusHandlerRptPass = (e) => {
    const inputRptPass = e.target;
    const lblRptPass = inputRptPass.previousElementSibling;
    const lblConfirmPass = inputRptPass.nextElementSibling;

    inputRptPass.classList.remove('input-rpt-pass-shake');
    lblRptPass.classList.remove('lbl-rpt-pass-shake');
    lblConfirmPass.style.visibility = 'hidden';
  };

  const blurHandlerRptPass = (e) => {
    const inputRptPass = e.target;
    inputRptPass.value = inputRptPass.value.trim();

    const inputPass = inputRptPass.parentElement.elements[4];
    const lblConfirmPass = inputRptPass.nextElementSibling;
    const lblRptPass = inputRptPass.previousElementSibling;

    if (inputRptPass.value && inputRptPass.value !== inputPass.value) {
      lblConfirmPass.style.visibility = 'visible';
      lblRptPass.classList.add('lbl-rpt-pass-shake');
      inputRptPass.classList.add('input-rpt-pass-shake');
    } else {
      lblConfirmPass.style.visibility = 'hidden';
      lblRptPass.classList.remove('lbl-rpt-pass-shake');
      inputRptPass.classList.remove('input-rpt-pass-shake');
    }
  };

  const pasteCopyHandlerInputsPass = (e) => {
    e.preventDefault();
  };

  const changeHandlerShowPass = (e) => {
    const isChecked = e.target.checked;
    const inputPass = formRegister.current.elements[4];
    const inputRptPass = formRegister.current.elements[6];

    if (isChecked) {
      inputPass.type = 'text';
      inputRptPass.type = 'text';
    } else {
      inputPass.type = 'password';
      inputRptPass.type = 'password';
    }
  };

  const keyDownHandlerInputsCheckLangPersian = (e) => {
    const codeAscii = e.key.charCodeAt(0);
    if (codeAscii >= 0x0600 && codeAscii <= 0x06ff) {
      showDialog('info', 'لطفا زبان صفحه کلید خود را انگلیسی کنید!');
    }
  };

  const blurHandlerInputs = (e) => {
    e.target.value = e.target.value.trim();
  };

  const changeHandlerUsername = (e) => {
    const inputUsername = e.target;
    const lblCheckingUser = inputUsername.nextElementSibling;

    if (!inputUsername.value) {
      lblCheckingUser.style.color = '';
      lblCheckingUser.style.visibility = 'hidden';
      return;
    }

    lblCheckingUser.innerText = 'درحال بررسی نام کاربری...';
    lblCheckingUser.style.color = 'blue';

    axios
      .get(`https://dbserver.liara.run/users?username=${inputUsername.value}`)
      .then((response) => {
        if (response.status === 200) {
          const userData = response.data;
          lblCheckingUser.style.visibility = 'visible';
          if (userData.length) {
            lblCheckingUser.innerText = 'قبلا انتخاب شده است!';
            lblCheckingUser.style.color = 'red';
          } else {
            lblCheckingUser.innerText = 'قابل دسترس!';
            lblCheckingUser.style.color = '';
          }
        }
      })
      .catch((err) => {});
  };

  const blurHandlerInputUsername = (e) => {
    const inputUsername = e.target;
    const lblCheckingUser = inputUsername.nextElementSibling;

    inputUsername.value = inputUsername.value.toLowerCase();
    if (lblCheckingUser.style.color !== 'red') {
      lblCheckingUser.style.color = '';
      lblCheckingUser.style.visibility = 'hidden';
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

  return (
    <form className='form-register' ref={formRegister}>
      <div className='title'>ثبت نام</div>

      <label className='lbl-fName'>نام</label>
      <input className='input-fName' type='text' id='fName' aria-label='نام' placeholder='نام خود را وارد کنید' onBlur={blurHandlerInputs} />

      <label className='lbl-lName'>نام خانوادگی</label>
      <input className='input-lName' type='text' id='lName' aria-label='نام خانوادگی' placeholder='نام خانوادگی خود را وارد کنید' onBlur={blurHandlerInputs} />

      <label className='lbl-username'>نام کاربری</label>
      <input
        className='input-username'
        type='text'
        name='username'
        id='username'
        aria-label='نام کاربری'
        autoComplete='username'
        placeholder='نام کاربری خود را وارد کنید'
        onChange={changeHandlerUsername}
        onBlur={blurHandlerInputUsername}
        onKeyDown={keyDownHandlerInputsCheckLangPersian}
      />
      <span className='check-username' style={{ visibility: 'hidden' }}>
        قابل دسترس
      </span>

      <label className='lbl-email'>ایمیل</label>
      <input
        className='input-email'
        type='email'
        name='email'
        id='email'
        aria-label='ایمیل'
        autoComplete='email'
        placeholder='ایمیل خود را وارد کنید'
        onBlur={blurHandlerInputEmail}
        onFocus={focusHandlerInputEmail}
      />

      <label className='lbl-pass'>پسورد</label>
      <input
        className='input-pass'
        type='password'
        id='password'
        autoComplete='new-password'
        aria-label='پسورد'
        placeholder='پسورد خود را وارد کنید'
        onBlur={blurHandlerInputs}
        onChange={changeHandlerInputPassword}
        onKeyDown={keyDownHandlerInputsCheckLangPersian}
        onCopy={pasteCopyHandlerInputsPass}
        onPaste={pasteCopyHandlerInputsPass}
      />

      <div className='footer-pass'>
        <label className='show-pass-register'>
          نمایش پسورد
          <input type='checkbox' name='show-pass-register' id='show-pass-register' onChange={changeHandlerShowPass} />
        </label>

        <div className='score-pass'>
          <div className='score-01' />
          <div className='score-02' />
          <div className='score-03' />
          <div className='score-04' />
          <div className='score-05' />
        </div>
      </div>

      <label className='lbl-rpt-pass'>تکرار پسورد</label>
      <input
        className='input-pass'
        type='password'
        id='rpt-password'
        autoComplete='new-password'
        aria-label='تکرار پسورد'
        placeholder='پسورد خود را تکرار کنید'
        onBlur={blurHandlerRptPass}
        onFocus={focusHandlerRptPass}
        onPaste={pasteCopyHandlerInputsPass}
        onCopy={pasteCopyHandlerInputsPass}
        onKeyDown={keyDownHandlerInputsCheckLangPersian}
      />
      <span className='confirm-pass' style={{ visibility: 'hidden' }}>
        عدم تطابق پسورد
      </span>

      <button type='button' className='btn-register' onClick={clickHandlerRegister}>
        {isLoading ? <SmallLoading /> : 'ثبت نام'}
      </button>
    </form>
  );
};
export default FormRegister;
