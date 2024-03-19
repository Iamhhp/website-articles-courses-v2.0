import './EditCreateArticle.css';
import { useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { LuRefreshCw } from 'react-icons/lu';
import useFetch from '../../hooks/useFetch';
import Swal from 'sweetalert2';
import Loading from '../../components/Loading/Loading';
import NoResponse from '../../components/NoResponse/NoResponse';
import { isEmptyInputs } from '../../utils';

const EditCreateArticle = () => {
  const { editCreate, idArticle } = useParams();
  const form = useRef(null);
  const [dataArticle, isPending] = useFetch(`https://dbserver.liara.run/articles/${idArticle}`);
  const navigate = useNavigate();

  // Replacing data in inputs //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (editCreate === 'edit') {
      form.current.elements[0].value = dataArticle.response.image;
      form.current.elements[1].value = dataArticle.response.title;
      form.current.elements[2].value = dataArticle.response.description;
      form.current.elements[3].value = dataArticle.response.writer;
      form.current.elements[4].value = dataArticle.response.category;
      form.current.elements[5].value = dataArticle.response.readingTime;
    }
  }, [isPending]);

  // ClickHandler Button Submit ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  const editCreateArticleHandler = () => {
    const listInputs = [...form.current.elements].slice(0, -1);
    const { isEmpty, inputEmpty } = isEmptyInputs(listInputs);
    if (isEmpty) {
      Swal.fire({
        icon: 'error',
        text: `لطفا ورودی "${inputEmpty.ariaLabel}" را پرکنید!`,
        showConfirmButton: true,
      })
        .then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            window.setTimeout(() => {
              inputEmpty?.focus();
            }, 500);
          }
        })
        .catch((err) => {});
      return;
    }

    const propertiesSwal = {
      showConfirmButton: true,
      confirmButtonText: 'بله!',
      showCancelButton: true,
      cancelButtonText: 'خیر!',
      cancelButtonColor: 'red',
    };
    if (editCreate === 'edit') {
      Swal.fire({
        icon: 'info',
        text: 'ویرایش مقاله ثبت شود؟',
        ...propertiesSwal,
      })
        .then((result) => {
          if (result.isConfirmed) {
            editArticleHandler();
          }
        })
        .catch((err) => {});
    } else {
      Swal.fire({
        icon: 'info',
        text: 'مقاله ایجاد شود؟',
        ...propertiesSwal,
      })
        .then((result) => {
          if (result.isConfirmed) {
            createArticleHandler();
          }
        })
        .catch((err) => {});
    }
  };

  // Edit Article ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const editArticleHandler = () => {
    const propertiesSwal = {
      showConfirmButton: true,
      confirmButtonText: 'برو به مقالات!',
      showCancelButton: true,
      cancelButtonColor: 'red',
      cancelButtonText: 'دوباره سعی کن!',
    };

    fetch(`https://dbserver.liara.run/articles/${idArticle}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        [form.current.elements[0].id]: form.current.elements[0].value,
        [form.current.elements[1].id]: form.current.elements[1].value,
        [form.current.elements[2].id]: form.current.elements[2].value,
        [form.current.elements[3].id]: form.current.elements[3].value,
        [form.current.elements[4].id]: form.current.elements[4].value,
        [form.current.elements[5].id]: form.current.elements[5].value,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            text: 'ویرایش باموفقیت انجام شد!\n مسیریابی به سمت صفحه مقالات',
            showConfirmButton: true,
            confirmButtonText: 'برو به مقالات',
          })
            .then((result) => {
              if (result.isConfirmed || result.isDismissed) {
                navigate('/Articles');
              }
            })
            .catch((err) => {});
        } else {
          Swal.fire({
            icon: 'error',
            text: `ویرایش مقاله انجام نشد!\n ${response.statusText}  ${response.status}`,
            ...propertiesSwal,
          })
            .then((result) => {
              if (result.isConfirmed) {
                navigate('/Articles');
              }
            })
            .catch((err) => {});
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          text: `ویرایش مقاله انجام نشد!\n ${err}`,
          ...propertiesSwal,
        })
          .then((result) => {
            if (result.isConfirmed) {
              navigate('/Articles');
            }
          })
          .catch((err) => {});
      });
  };

  const reloadHandler = (id) => {
    form.current.elements[id].value = dataArticle.response[id];
  };
  // Create Article ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const createArticleHandler = () => {
    const propertiesSwal = {
      showConfirmButton: true,
      confirmButtonText: 'برو به مقالات!',
      showCancelButton: true,
      cancelButtonColor: 'red',
      cancelButtonText: 'دوباره سعی کن!',
    };

    fetch('https://dbserver.liara.run/articles', {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        [form.current.elements[0].id]: form.current.elements[0].value,
        [form.current.elements[1].id]: form.current.elements[1].value,
        [form.current.elements[2].id]: form.current.elements[2].value,
        [form.current.elements[3].id]: form.current.elements[3].value,
        [form.current.elements[4].id]: form.current.elements[4].value,
        [form.current.elements[5].id]: form.current.elements[5].value,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            text: 'ایجاد مقاله باموفقیت انجام شد!',
            showConfirmButton: true,
            confirmButtonText: 'برو به مقالات',
          })
            .then((result) => {
              if (result.isConfirmed || result.isDismissed) {
                navigate('/Articles');
              }
            })
            .catch((err) => {});
        } else {
          Swal.fire({
            icon: 'error',
            text: `ایجاد مقاله انجام نشد!\n ${response.statusText}  ${response.status}`,
            ...propertiesSwal,
          })
            .then((result) => {
              if (result.isConfirmed) {
                navigate('/Articles');
              }
            })
            .catch((err) => {});
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          text: `ایجاد مقاله انجام نشد!\n ${err}`,
          ...propertiesSwal,
        })
          .then((result) => {
            if (result.isConfirmed) {
              navigate('/Articles');
            }
          })
          .catch((err) => {});
      });
  };

  return (
    <Container className='container-edit-create'>
      {isPending && <Loading className='position-loading' />}
      {editCreate === 'edit' && dataArticle.responseStatus !== 'dataReceived!' && <NoResponse responseState={dataArticle.responseStatus} />}
      <form ref={form} style={{ display: editCreate === 'edit' && dataArticle.responseStatus !== 'dataReceived!' && 'none' }}>
        <label htmlFor='image'>عکس</label>
        <div className='container-input'>
          <input
            type='text'
            aria-label='عکس'
            id='image'
            onBlur={(e) => {
              e.target.value = e.target.value.trim();
            }}
          />
          <LuRefreshCw
            className='icon'
            onClick={(e) => {
              reloadHandler('image');
            }}
          />
        </div>

        <label htmlFor='title'>عنوان</label>
        <div className='container-input'>
          <input
            type='text'
            aria-label='عنوان'
            id='title'
            onBlur={(e) => {
              e.target.value = e.target.value.trim();
            }}
          />
          <LuRefreshCw
            className='icon'
            onClick={(e) => {
              reloadHandler('title');
            }}
          />
        </div>

        <label htmlFor='description'>توضیحات</label>
        <div className='container-input'>
          <textarea type='text' aria-label='توضیحات' id='description' />
          <LuRefreshCw
            className='icon'
            onClick={(e) => {
              reloadHandler('description');
            }}
          />
        </div>

        <label htmlFor='writer'>نویسنده</label>
        <div className='container-input'>
          <input
            type='text'
            aria-label='نویسنده'
            id='writer'
            onBlur={(e) => {
              e.target.value = e.target.value.trim();
            }}
          />
          <LuRefreshCw
            className='icon'
            onClick={(e) => {
              reloadHandler('writer');
            }}
          />
        </div>

        <label htmlFor='category'>موضوع</label>
        <div className='container-input'>
          <input
            type='text'
            aria-label='موضوع'
            id='category'
            onBlur={(e) => {
              e.target.value = e.target.value.trim();
            }}
          />
          <LuRefreshCw
            className='icon'
            onClick={(e) => {
              reloadHandler('category');
            }}
          />
        </div>

        <label htmlFor='readingTime'>زمان مطالعه</label>
        <div className='container-input'>
          <input
            type='text'
            aria-label='زمان مطالعه'
            id='readingTime'
            onBlur={(e) => {
              e.target.value = e.target.value.trim();
            }}
          />
          <LuRefreshCw
            className='icon'
            onClick={(e) => {
              reloadHandler('readingTime');
            }}
          />
        </div>

        <button type='button' onClick={editCreateArticleHandler}>
          {editCreate === 'edit' ? 'ویرایش مقاله' : 'ایجاد مقاله'}
        </button>
      </form>
    </Container>
  );
};
export default EditCreateArticle;
