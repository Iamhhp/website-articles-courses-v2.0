import './DetailsAccount.css';
import { memo, useEffect, useRef, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import zxcvbn from 'zxcvbn';
import { isEmptyInputs, showDialog } from '../../utils';
import Loading from '../../components/Loading/Loading';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addNotificationErr, addNotificationMsg } from '../../context/Redux/notificationDataSlice';
import { patchUserData } from '../../context/Redux/userSlice';

const DetailsAccount = () => {
  const formDetailsAccount = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const setNotification = useDispatch();
  const setUserData = useDispatch();
  const { info: userData } = useSelector((state) => state.user);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.setTimeout(() => {
      formDetailsAccount.current?.classList.add('container-details-account-show');
    }, 10);
  }, []);

  useEffect(() => {
    if (formDetailsAccount.current) {
      formDetailsAccount.current.elements[0].value = userData.fName;
      formDetailsAccount.current.elements[1].value = userData.lName;
      formDetailsAccount.current.elements[2].value = userData.username;
      formDetailsAccount.current.elements[3].value = userData.email;
    }
  }, [userData]);

  //////////////////////////////////////////////////////////////////////////////////////// Function Handler Inputs Password
  const clickHandlerSaveChange = (e) => {
    const btnSaveChange = e.target;
    const inputFName = formDetailsAccount.current.elements[0];
    const inputLName = formDetailsAccount.current.elements[1];
    const CBEnabledInputsPassword = formDetailsAccount.current.elements[4];
    const inputPass = formDetailsAccount.current.elements[5];
    const inputRptPass = formDetailsAccount.current.elements[7];
    const inputs = { i: [inputFName, inputLName, inputPass, inputRptPass] };
    const checkPass = zxcvbn(inputPass.value);

    const isEnableBtnSaveChange = btnSaveChange.classList.contains('btn-enabled-Pass-side') || btnSaveChange.classList.contains('btn-enabled-Name-side');
    if (!isEnableBtnSaveChange) {
      return;
    }

    if (!CBEnabledInputsPassword.checked) {
      inputs.i = inputs.i.slice(0, -2);
    }

    const { isEmpty, inputEmpty } = isEmptyInputs(inputs.i);
    if (isEmpty) {
      showDialog('info', `لطفا ورودی ${inputEmpty.ariaLabel} را پر کنید!`, inputEmpty);
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

    const dataPatch = { fName: inputFName.value, lName: inputLName.value };
    if (CBEnabledInputsPassword.checked) {
      dataPatch.password = inputPass.value;
    }

    setIsLoading(() => true);
    axios
      .patch(`https://dbserver.liara.run/users/${userData.id}`, dataPatch)
      .then((response) => {
        if (response.status === 200) {
          setUserData(patchUserData(dataPatch));
          setNotification(addNotificationMsg('تغییرات ذخیره شد!'));

          btnSaveChange.classList.remove('btn-enabled-Name-side');
          CBEnabledInputsPassword.checked = false;
          changeHandlerCBEnableInputsPassword({ target: CBEnabledInputsPassword });
        } else {
          setNotification(addNotificationErr('خطا! دوباره سعی کنید.'));
        }
      })
      .catch((err) => {
        if (err.message.includes('500')) {
          setUserData(patchUserData(dataPatch));
          setNotification(addNotificationMsg('تغییرات ذخیره شد!'));

          btnSaveChange.classList.remove('btn-enabled-Name-side');
          CBEnabledInputsPassword.checked = false;
          changeHandlerCBEnableInputsPassword({ target: CBEnabledInputsPassword });
        } else {
          setNotification(addNotificationErr('خطا! دوباره سعی کنید.'));
        }
      })
      .finally(() => {
        setIsLoading(() => false);
      });
  };

  //////////////////////////////////////////////////////////////////////////////////////// Function Handler Inputs Password
  const changeHandlerInputPassword = (e) => {
    const inputPass = e.target;
    const boxesScore = [...inputPass.nextElementSibling.children[1].children];
    const colorScore = ['red', 'yellow', 'yellow', 'green', 'green'];
    const checkPass = zxcvbn(inputPass.value);
    const score = checkPass.score;

    if (inputPass.value) {
      for (let l = 0; l <= 4; l++) {
        if (l <= score) {
          boxesScore[l].style.backgroundColor = colorScore[l];
        } else {
          boxesScore[l].style.backgroundColor = '';
        }
      }
    } else {
      boxesScore.forEach((box) => {
        box.style.backgroundColor = '';
      });
    }
  };

  const blurHandlerInputRptPassword = (e) => {
    const inputRptPass = e.target;
    inputRptPass.value = inputRptPass.value.trim();

    const lblRptPass = inputRptPass.previousElementSibling;
    const lblConfirmPass = inputRptPass.nextElementSibling;
    const inputPass = formDetailsAccount.current.elements[5];

    if (inputRptPass.value && inputPass.value !== inputRptPass.value) {
      inputRptPass.style.boxShadow = '1px 1px 0px 1px red';
      inputRptPass.style.borderColor = 'red';
      lblRptPass.classList.add('lbl-rpt-pass-shake');
      lblConfirmPass.style.visibility = 'visible';
    } else {
      inputRptPass.style.boxShadow = '';
      inputRptPass.style.borderColor = '';
      lblRptPass.classList.remove('lbl-rpt-pass-shake');
      lblConfirmPass.style.visibility = 'hidden';
    }
  };

  const focusHandlerInputRptPassword = (e) => {
    const inputRptPass = e.target;
    const lblRptPass = inputRptPass.previousElementSibling;
    const lblConfirmPass = inputRptPass.nextElementSibling;

    inputRptPass.style.boxShadow = '';
    inputRptPass.style.borderColor = '';
    lblRptPass.classList.remove('lbl-rpt-pass-shake');
    lblConfirmPass.style.visibility = 'hidden';
  };

  const keyDownHandlerInputsPass = (e) => {
    const codeAscii = e.key.charCodeAt(0);
    if (codeAscii >= 0x0600 && codeAscii <= 0x06ff) {
      showDialog('info', 'لطفا زبان صفحه کلید خود را انگلیسی کنید!');
    }
  };

  const pasteCopyHandlerInputsPass = (e) => {
    e.preventDefault();
  };

  const changeHandlerShowPass = (e) => {
    const CBShowPass = e.target;
    const inputPass = formDetailsAccount.current.elements[5];
    const inputRptPass = formDetailsAccount.current.elements[7];

    if (CBShowPass.checked) {
      inputPass.type = 'text';
      inputRptPass.type = 'text';
    } else {
      inputPass.type = 'password';
      inputRptPass.type = 'password';
    }
  };

  const changeHandlerCBEnableInputsPassword = (e) => {
    const CBEnableInputsPassword = e.target;
    const containerChangePassword = formDetailsAccount.current.elements[5].parentElement.parentElement;
    const inputPassword = formDetailsAccount.current.elements[5];
    const inputRptPassword = formDetailsAccount.current.elements[7];
    const CBShowPass = formDetailsAccount.current.elements[6];
    const boxesScore = [...CBShowPass.parentElement.nextElementSibling.children];
    const btnSaveChange = formDetailsAccount.current.elements[8];

    if (CBEnableInputsPassword.checked) {
      containerChangePassword.classList.add('container-pass-enabled');
      btnSaveChange.classList.add('btn-enabled-Pass-side');

      inputPassword.disabled = false;
      inputRptPassword.disabled = false;
      CBShowPass.disabled = false;
    } else {
      containerChangePassword.classList.remove('container-pass-enabled');
      btnSaveChange.classList.remove('btn-enabled-Pass-side');

      inputPassword.value = '';
      inputPassword.disabled = true;

      inputRptPassword.value = '';
      blurHandlerInputRptPassword({ target: inputRptPassword });
      inputRptPassword.disabled = true;

      CBShowPass.checked = false;
      changeHandlerShowPass({ target: CBShowPass });
      CBShowPass.disabled = true;

      boxesScore.forEach((box) => {
        box.style.backgroundColor = 'white';
      });
    }
  };

  const blurHandlerInputs = (e) => {
    const input = e.target;
    input.value = input.value.trim();
  };

  const changeHandlerInputsFNameLName = () => {
    const btnSaveChange = formDetailsAccount.current.children[3];
    const inputFName = formDetailsAccount.current.children[0].children[0].children[1];
    const inputLName = formDetailsAccount.current.children[0].children[1].children[1];

    if (inputFName.value !== userData.fName || inputLName.value !== userData.lName) {
      btnSaveChange.classList.add('btn-enabled-Name-side');
    } else if (inputFName.value === userData.fName && inputLName.value === userData.lName) {
      btnSaveChange.classList.remove('btn-enabled-Name-side');
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <form className='container-details-account' ref={formDetailsAccount}>
        <Row className='row-cols-1 row-cols-lg-2'>
          <Col>
            <label className='lbl-fName'>نام</label>
            <input className='input-fName' type='text' id='fName' aria-label='نام' placeholder='نام خود را وارد کنید' onChange={changeHandlerInputsFNameLName} onBlur={blurHandlerInputs} />
          </Col>

          <Col>
            <label className='lbl-lName'>نام خانوادگی</label>
            <input
              className='input-lName'
              type='text'
              id='lName'
              aria-label='نام خانوادگی'
              placeholder='نام خانوادگی خود را وارد کنید'
              onChange={changeHandlerInputsFNameLName}
              onBlur={blurHandlerInputs}
            />
          </Col>

          <Col>
            <label htmlFor=''>نام کاربری</label>
            <input className='input-username' type='text' name='username' aria-label='نام کاربری' autoComplete='username' id='username' disabled />
          </Col>

          <Col>
            <label htmlFor=''>ایمیل</label>
            <input className='input-email' type='text' name='email' aria-label='ایمیل' autoComplete='email' id='email' disabled />
          </Col>
        </Row>

        <label className='enable-chng-pass'>
          <input type='checkbox' name='enabel-pass' aria-label='فعال سازی تغییر رمز' id='enable-pass' onChange={changeHandlerCBEnableInputsPassword} />
          فعال سازی تغییر رمز
        </label>

        <Row className='container-pass-disabled  row-cols-1 row-cols-lg-2'>
          <Col>
            <label htmlFor=''>پسورد</label>
            <input
              className='input-pass'
              type='password'
              name='password'
              id='password'
              aria-label='پسورد'
              autoComplete='new-password'
              onBlur={blurHandlerInputs}
              onChange={changeHandlerInputPassword}
              onKeyDown={keyDownHandlerInputsPass}
              onCopy={pasteCopyHandlerInputsPass}
              onPaste={pasteCopyHandlerInputsPass}
            />

            <div className='container-boxesScore-showPass'>
              <label className='show-pass-sign'>
                <input type='checkbox' name='show-pass-sign' id='show-pass-sign' aria-label='نمایش پسورد' onChange={changeHandlerShowPass} />
                نمایش پسورد
              </label>

              <div className='score-pass'>
                <div className='score-01' />
                <div className='score-02' />
                <div className='score-03' />
                <div className='score-04' />
                <div className='score-05' />
              </div>
            </div>
          </Col>

          <Col className='container-rpt-pass'>
            <label>تکرار پسورد</label>
            <input
              className='input-rpt-pass'
              type='password'
              name='rpt-password'
              id='rpt-password'
              aria-label='تکرار پسورد'
              autoComplete='new-password'
              onBlur={blurHandlerInputRptPassword}
              onFocus={focusHandlerInputRptPassword}
              onKeyDown={keyDownHandlerInputsPass}
              onCopy={pasteCopyHandlerInputsPass}
              onPaste={pasteCopyHandlerInputsPass}
            />

            <span className='confirm-pass' style={{ visibility: 'hidden' }}>
              عدم تطابق پسورد
            </span>
          </Col>
        </Row>

        <button className='btn-save-chng-disabled' type='button' onClick={clickHandlerSaveChange}>
          ذخیره تغییرات
        </button>
      </form>
    </>
  );
};
export default memo(DetailsAccount);
