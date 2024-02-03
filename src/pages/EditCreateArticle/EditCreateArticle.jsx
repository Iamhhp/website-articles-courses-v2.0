import './EditCreateArticle.css';
import { useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { LuRefreshCw } from 'react-icons/lu';
import useFetch from '../../hooks/useFetch';
import Swal from 'sweetalert2';
import Loading from '../../components/Loading/Loading';

const EditCreateArticle = () => {
  const { editCreate, idArticle } = useParams();
  const form = useRef(null);
  const [dataArticle, isPending] = useFetch(`https://dbserver.liara.run/articles/${idArticle}`);
  const navigate = useNavigate();

  const isEmptyInputs = () => {
    const listInputs = [...form.current.elements].slice(0, -1);

    for (let l = 0; l < listInputs.length; l++) {
      if (!listInputs[l].value) {
        return { isEmpty: true, inputEmpty: listInputs[l] };
      }
    }

    return { isEmpty: false, inputEmpty: '' };
  };

  // Replacing data in inputs //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (editCreate === 'Edit') {
      form.current.elements[0].value = dataArticle.image;
      form.current.elements[1].value = dataArticle.title;
      form.current.elements[2].value = dataArticle.description;
      form.current.elements[3].value = dataArticle.writer;
      form.current.elements[4].value = dataArticle.category;
      form.current.elements[5].value = dataArticle.readingTime;
    }
  }, [isPending]);

  // ClickHandler Button Submit ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  const editCreateArticleHandler = () => {
    const { isEmpty, inputEmpty } = isEmptyInputs();
    if (isEmpty) {
      Swal.fire({
        icon: 'error',
        text: 'لطفا تمامی ورودی ها را پرکنید!',
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          window.setTimeout(() => {
            inputEmpty.focus();
          }, 500);
        }
      });
    }
    if (isEmpty) {
      return;
    }

    if (editCreate === 'Edit') {
      Swal.fire({
        icon: 'info',
        text: 'ویرایش مقاله ثبت شود؟',
        showConfirmButton: true,
        confirmButtonText: 'بله!',
        showCancelButton: true,
        cancelButtonText: 'خیر!',
        cancelButtonColor: 'red',
      }).then((result) => {
        if (result.isConfirmed) {
          editArticleHandler();
        }
      });
    } else {
      Swal.fire({
        icon: 'info',
        text: 'مقاله ایجاد شود؟',
        showConfirmButton: true,
        confirmButtonText: 'بله!',
        showCancelButton: true,
        cancelButtonText: 'خیر!',
        cancelButtonColor: 'red',
      }).then((result) => {
        if (result.isConfirmed) {
          createArticleHandler();
        }
      });
    }
  };

  // Edit Article ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const editArticleHandler = () => {
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
          }).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              navigate('/Articles');
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            text: `ویرایش مقاله انجام نشد!\n ${response.statusText}  ${response.status}`,
            showConfirmButton: true,
            confirmButtonText: 'برو به مقالات!',
            showCancelButton: true,
            cancelButtonColor: 'red',
            cancelButtonText: 'دوباره سعی کن!',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/Articles');
            }
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          text: `ویرایش مقاله انجام نشد!\n ${err}`,
          showConfirmButton: true,
          confirmButtonText: 'برو به مقالات!',
          showCancelButton: true,
          cancelButtonColor: 'red',
          cancelButtonText: 'دوباره سعی کن!',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/Articles');
          }
        });
      });
  };

  // Create Article ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const createArticleHandler = () => {
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
          }).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              navigate('/Articles');
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            text: `ایجاد مقاله انجام نشد!\n ${response.statusText}  ${response.status}`,
            showConfirmButton: true,
            confirmButtonText: 'برو به مقالات!',
            showCancelButton: true,
            cancelButtonColor: 'red',
            cancelButtonText: 'دوباره سعی کن!',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/Articles');
            }
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          text: `ایجاد مقاله انجام نشد!\n ${err}`,
          showConfirmButton: true,
          confirmButtonText: 'برو به مقالات!',
          showCancelButton: true,
          cancelButtonText: 'دوباره سعی کن!',
          timer: 1500,
          timerProgressBar: true,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/Articles');
          }
        });
      });
  };

  const reloadHandler = (id) => {
    form.current.elements[id].value = dataArticle[id];
  };

  return (
    <Container className='container-edit-create'>
      {isPending && <Loading className='position-loading' />}
      <form ref={form}>
        <label htmlFor='image'>عکس</label>
        <div className='container-input'>
          <input
            type='text'
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
          <textarea type='text' name='' id='description' />
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
          {editCreate === 'Edit' ? 'ویرایش مقاله' : 'ایجاد مقاله'}
        </button>
      </form>
    </Container>
  );
};
export default EditCreateArticle;
