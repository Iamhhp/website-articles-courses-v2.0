import './FormSign.css';
import { useEffect, useRef, useState } from 'react';
import { isEmptyInputs, showDialog } from '../../utils';
import axios from 'axios';
import zxcvbn from 'zxcvbn';
import Swal from 'sweetalert2';

const FormSign = ({ setIsShowFormLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const formSign = useRef(null);

  useEffect(() => {
    window.setTimeout(() => {
      formSign.current.classList.add('form-sign-show');
    }, 100);
  }, []);

  ////////////////////////////////////////////////////////////////////////////////////// Function Handler Button Sign up
  const clickHandlerSignUp = () => {
    const inputsFormSignUp = [...formSign.current.elements].slice(0, -1);
    const inputFName = inputsFormSignUp[0];
    const inputLName = inputsFormSignUp[1];
    const inputUsername = inputsFormSignUp[2];
    const inputEmail = inputsFormSignUp[3];
    const inputPass = inputsFormSignUp[4];
    const inputRptPass = inputsFormSignUp[5];
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

    const { isEmpty, inputEmpty } = isEmptyInputs(inputsFormSignUp);
    if (isEmpty) {
      showDialog('error', `لطفا ورودی "${inputEmpty.ariaLabel}" را پرکنید`, inputEmpty);
      return;
    }

    const postDataUser = () => {
      axios
        .post('https://dbserver.liara.run/users', {
          username: inputUsername.value,
          password: inputPass.value,
          fName: inputFName.value,
          lName: inputLName.value,
          email: inputEmail.value,
          cards: [],
        })
        .then((response) => {
          setIsLoading(() => false);
          if (response.status === 200) {
            Swal.fire({
              icon: 'success',
              text: 'ثبت نام انجام شد.\nاکنون می توانید وارد شوید',
              showConfirmButton: true,
            }).then(() => {
              setIsShowFormLogin(() => true);
            });
          }
        })
        .catch((err) => {
          setIsLoading(() => false);
          // showDialog('error', `ثبت نام انجام نشد! \n ${err}`);
          Swal.fire({
            icon: 'success',
            text: 'ثبت نام انجام شد.\nاکنون می توانید وارد شوید',
            showConfirmButton: true,
          }).then(() => {
            setIsShowFormLogin(() => true); // Move to Form Login
          });
        });
    };

    /// Checking username is Exist!
    fetch(`https://dbserver.liara.run/users?username=${inputUsername.value}`)
      .then((response) => {
        console.log(response.status);
        if (response.status === 200) {
          response.json().then((userData) => {
            if (userData.length) {
              showDialog('error', `نام کاربری "${inputUsername.value}" قبلا انتخاب شده یک نام کاربری دیگه انتخاب کنید!`, inputUsername);
            } else {
              setIsLoading(() => true);
              postDataUser();
            }
          });
        } else {
          showDialog('error', `خطا در ارتباط با سرور\n${response.statusText}`);
        }
      })
      .catch((err) => {
        showDialog('error', `خطا در ارتباط با سرور\n${err}`);
      });
  };

  ////////////////////////////////////////////////////////////////////////////////////// Function Handler Inputs
  const changeHandlerPassword = (e) => {
    const colorBoxScore = ['red', 'yellow', 'yellow', 'green', 'green'];
    const boxesScore = [...e.target.nextElementSibling.children];
    const inputPass = e.target.value;
    const checkPass = zxcvbn(inputPass);
    let scorePass = checkPass.score;

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
    const lblConfirmPass = inputRptPass.nextElementSibling.children[1];

    lblRptPass.classList.remove('lbl-rpt-pass-shake');
    lblConfirmPass.style.visibility = 'hidden';
  };

  const blurHandlerRptPass = (e) => {
    const inputRptPass = e.target;
    inputRptPass.value = inputRptPass.value.trim();

    const inputPass = inputRptPass.parentElement.elements[4];
    const lblConfirmPass = inputRptPass.nextElementSibling.children[1];
    const lblRptPass = inputRptPass.previousElementSibling;

    if (inputRptPass.value && inputRptPass.value !== inputPass.value) {
      lblConfirmPass.style.visibility = 'visible';
      lblRptPass.classList.add('lbl-rpt-pass-shake');
      inputRptPass.classList.add('input-rpt-pass-shake');
    } else {
      lblRptPass.classList.remove('lbl-rpt-pass-shake');
      inputRptPass.classList.remove('input-rpt-pass-shake');
      lblConfirmPass.style.visibility = 'hidden';
    }
  };

  const pasteHandlerInputsPass = (e) => {
    e.preventDefault();
  };

  const changeHandlerShowPass = (e) => {
    const isChecked = e.target.checked;
    const inputPass = formSign.current.elements[4];
    const inputRptPass = formSign.current.elements[5];

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

    fetch(`https://dbserver.liara.run/users?username=${inputUsername.value}`)
      .then((response) => {
        if (response.status === 200) {
          response.json().then((userData) => {
            lblCheckingUser.style.visibility = 'visible';
            if (userData.length) {
              lblCheckingUser.innerText = 'قبلا انتخاب شده است!';
              lblCheckingUser.style.color = 'red';
            } else {
              lblCheckingUser.innerText = 'قابل دسترس!';
              lblCheckingUser.style.color = '';
            }
          });
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
    <form className='form-sign' ref={formSign}>
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
        onChange={changeHandlerPassword}
        onKeyDown={keyDownHandlerInputsCheckLangPersian}
      />
      <div className='score-pass'>
        <div className='score-01' />
        <div className='score-02' />
        <div className='score-03' />
        <div className='score-04' />
        <div className='score-05' />
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
        onPaste={pasteHandlerInputsPass}
        onKeyDown={keyDownHandlerInputsCheckLangPersian}
      />
      <div className='footer-rpt-pass'>
        <label htmlFor='show-pass-sign'>
          نمایش پسورد
          <input type='checkbox' name='show-pass-sign' id='show-pass-sign' onChange={changeHandlerShowPass} />
        </label>

        <span className='confirm-pass' style={{ visibility: 'hidden' }}>
          عدم تطابق پسورد
        </span>
      </div>

      <button type='button' className='btn-sign' onClick={clickHandlerSignUp}>
        {isLoading ? <div className='btn-loading' /> : 'ثبت نام'}
      </button>
    </form>
  );
};
export default FormSign;
