import { Col, Container, Row } from 'react-bootstrap';
import './Courses.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import Accordion from '../../components/Accordion/Accordion';
import CardCourse from '../../components/CardCourse/CardCourse';
import useCoursesReducer from '../../hooks/useCoursesReducer';
import { ACTION_TYPE } from '../../hooks/useArticlesReducer';
import ToggleBtn from '../../components/ToggleBtn/ToggleBtn';
import ReactPaginate from 'react-paginate';
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io';
import Loading from '../../components/Loading/Loading';
import NoResponse from '../../components/NoResponse/NoResponse';

const Courses = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const { changeStateDataCourses, stateDataCourses } = useCoursesReducer();
  const [dataFetchCourse, isPending] = useFetch('https://dbserver.liara.run/courses');

  const [reloadAccordion, setReloadAccordion] = useState(false);
  const [reloadPaginate, setReloadPaginate] = useState(false);

  const optionSorting = useRef('newest');
  const optionsFiltering = useRef({ teachers: [], categories: [], stateCourse: [] });

  useEffect(() => {
    changeStateDataCourses(ACTION_TYPE.DATA_SEARCH, [...dataFetchCourse.response]);
  }, [dataFetchCourse]);

  // Filtering Data Courses //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const searchingDataCourses = (e) => {
    const dataCourses = { search: [] };
    const inputSearch = e.target.parentElement.children[0].value;
    const optionSearch = e.target.parentElement.children[1].value;
    dataCourses.search = dataFetchCourse.response.filter((course) => course[optionSearch].includes(inputSearch));

    optionSorting.current = 'newest';
    optionsFiltering.current = { teachers: [], categories: [], stateCourse: [] };
    setReloadAccordion(() => true);
    changeStateDataCourses(ACTION_TYPE.DATA_SEARCH, [...dataCourses.search]);
  };

  useEffect(() => {
    setReloadAccordion(() => false);
  }, [reloadAccordion]);

  // Filtering Data Courses //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    filteringDataCourses();
  }, [stateDataCourses.search]);

  const filteringDataCourses = () => {
    const dataCourses = { filter: [] };
    if (optionsFiltering.current.teachers.length) {
      dataCourses.filter = stateDataCourses.search.filter((course) => optionsFiltering.current.teachers.includes(course.teacher));
    } else {
      dataCourses.filter = [...stateDataCourses.search];
    }

    if (optionsFiltering.current.categories.length) {
      dataCourses.filter = dataCourses.filter.filter((course) => optionsFiltering.current.categories.includes(course.category));
    }

    if (optionsFiltering.current.stateCourse.length) {
      dataCourses.filter = dataCourses.filter.filter((course) => optionsFiltering.current.stateCourse.includes(course.state));
    }

    changeStateDataCourses(ACTION_TYPE.DATA_FILTER, [...dataCourses.filter]);
  };

  // Sorting Data Courses //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    sortingDataCourses();
  }, [stateDataCourses.filter]);

  const sortingDataCourses = () => {
    const dataCourses = { sorting: [] };
    switch (optionSorting.current) {
      case 'newest':
        dataCourses.sorting = stateDataCourses.filter.sort((a, b) => b.id - a.id);
        break;
      case 'oldest':
        dataCourses.sorting = stateDataCourses.filter.sort((a, b) => a.id - b.id);
        break;
      case 'longest':
        dataCourses.sorting = stateDataCourses.filter.sort((a, b) => {
          const durationA = a.duration.split(':');
          const timeA = Number(durationA[0]) * 60 + Number(durationA[1]);

          const durationB = b.duration.split(':');
          const timeB = Number(durationB[0]) * 60 + Number(durationB[1]);

          return timeB - timeA;
        });
        break;
      case 'shortest':
        dataCourses.sorting = stateDataCourses.filter.sort((a, b) => {
          const durationA = a.duration.split(':');
          const timeA = Number(durationA[0]) * 60 + Number(durationA[1]);

          const durationB = b.duration.split(':');
          const timeB = Number(durationB[0]) * 60 + Number(durationB[1]);

          return timeA - timeB;
        });
        break;
      case 'expensive':
        dataCourses.sorting = stateDataCourses.filter.sort((a, b) => {
          const costA = a.discountPrice || a.mainPrice;
          const costB = b.discountPrice || b.mainPrice;

          return costB - costA;
        });
        break;
      default: // 'cheapest'
        dataCourses.sorting = stateDataCourses.filter.sort((a, b) => {
          const costA = a.discountPrice || a.mainPrice;
          const costB = b.discountPrice || b.mainPrice;

          return costA - costB;
        });
        break;
    }

    setReloadPaginate(() => true);
    changeStateDataCourses(ACTION_TYPE.DATA_SORT, [...dataCourses.sorting]);
  };

  // Pagination Data Courses //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    setReloadPaginate(() => false);
  }, [reloadPaginate]);

  useEffect(() => {
    changeHandlerPagination({ selected: 0 });
  }, [stateDataCourses.sort]);

  const containerCardCourses = useRef(null);
  const changeHandlerPagination = ({ selected: pageNum }) => {
    const dataCourses = { pagination: [] };
    dataCourses.pagination = stateDataCourses.sort.filter((course, i) => i >= pageNum * 6 && i < (pageNum + 1) * 6);

    containerCardCourses.current.classList.add('container-cardCourses-hide');
    window.setTimeout(() => {
      changeStateDataCourses(ACTION_TYPE.DATA_PAGINATION, [...dataCourses.pagination]);
    }, 200);
  };

  useEffect(() => {
    containerCardCourses.current.classList.remove('container-cardCourses-hide');
  }, [stateDataCourses.pagination]);

  // Items Accordion Menu ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Extract options Filtering ///////////////////////////////////////////////////////////
  const changeHandlerOptionsTeacher = (e) => {
    const optionTeacher = e.target;
    const labelTeacher = optionTeacher.nextSibling.innerText;
    if (optionTeacher.checked) {
      optionsFiltering.current.teachers.push(labelTeacher);
    } else {
      optionsFiltering.current.teachers = optionsFiltering.current.teachers.filter((teacher) => teacher !== labelTeacher);
    }

    filteringDataCourses();
  };

  const changeHandlerOptionsCategory = (e) => {
    const optionCategory = e.target;
    const labelCategory = optionCategory.nextSibling.innerText;
    if (optionCategory.checked) {
      optionsFiltering.current.categories.push(labelCategory);
    } else {
      optionsFiltering.current.categories = optionsFiltering.current.categories.filter((category) => category !== labelCategory);
    }

    filteringDataCourses();
  };

  const extractOptionsFiltering = useMemo(() => {
    const optionsTeacher = [];
    const optionsCategory = [];
    stateDataCourses.search.forEach((course) => {
      if (!optionsTeacher.includes(course.teacher)) {
        optionsTeacher.push(course.teacher);
      }

      if (!optionsCategory.includes(course.category)) {
        optionsCategory.push(course.category);
      }
    });

    const itemsAccordionTeacher = (
      <ul className='items-accordion'>
        {optionsTeacher.map((teacher, i) => {
          return (
            <li key={i}>
              <input type='checkbox' id={`${teacher}-${i}`} onChange={changeHandlerOptionsTeacher} tabIndex='-1' />
              <label htmlFor={`${teacher}-${i}`}>{teacher}</label>
            </li>
          );
        })}
      </ul>
    );

    const itemsAccordionCategory = (
      <ul className='items-accordion'>
        {optionsCategory.map((category, i) => {
          return (
            <li key={i}>
              <input type='checkbox' id={`${category}-${i}`} onChange={changeHandlerOptionsCategory} tabIndex='-1' />
              <label htmlFor={`${category}-${i}`}>{category}</label>
            </li>
          );
        })}
      </ul>
    );

    return {
      itemsAccordionTeacher,
      itemsAccordionCategory,
    };
  }, [stateDataCourses.search]);

  // Items Options State ////////////////////////////////////////////////////////////////
  const changeHandlerOptionsState = (e) => {
    const optionState = e.target;
    const labelState = optionState.id;
    if (optionState.checked) {
      optionsFiltering.current.stateCourse.push(labelState);
    } else {
      optionsFiltering.current.stateCourse = optionsFiltering.current.stateCourse.filter((state) => state !== labelState);
    }

    filteringDataCourses();
  };

  const itemsAccordionState = useMemo(() => {
    return (
      <ul className='items-accordion'>
        <li>
          <ToggleBtn id={'presell'} changeHandler={changeHandlerOptionsState} />
          <label htmlFor='presell'>پیش فروش</label>
        </li>
        <li>
          <ToggleBtn id={'recording'} changeHandler={changeHandlerOptionsState} />
          <label htmlFor='recording'>در حال ضبط</label>
        </li>
        <li>
          <ToggleBtn id={'completed'} changeHandler={changeHandlerOptionsState} />
          <label htmlFor='completed'>تکمیل شده</label>
        </li>
      </ul>
    );
  }, [stateDataCourses.filter]);

  // Items Options Sorting ////////////////////////////////////////////////////////////
  const changeHandlerOptionsSorting = (e) => {
    optionSorting.current = e.target.id;

    sortingDataCourses();
  };

  const itemsAccordionSort = useMemo(() => {
    return (
      <ul className='items-accordion'>
        <li>
          <input type='radio' name='sorting' id='newest' tabIndex='-1' onChange={changeHandlerOptionsSorting} defaultChecked />
          <label htmlFor='newest'>جدیدترین</label>
        </li>
        <li>
          <input type='radio' name='sorting' id='oldest' tabIndex='-1' onChange={changeHandlerOptionsSorting} />
          <label htmlFor='oldest'>قدیمی ترین</label>
        </li>
        <li>
          <input type='radio' name='sorting' id='longest' tabIndex='-1' onChange={changeHandlerOptionsSorting} />
          <label htmlFor='longest'>طولانی ترین</label>
        </li>
        <li>
          <input type='radio' name='sorting' id='shortest' tabIndex='-1' onChange={changeHandlerOptionsSorting} />
          <label htmlFor='shortest'>کوتاه ترین</label>
        </li>
        <li>
          <input type='radio' name='sorting' id='expensive' tabIndex='-1' onChange={changeHandlerOptionsSorting} />
          <label htmlFor='expensive'>گران ترین</label>
        </li>
        <li>
          <input type='radio' name='sorting' id='cheapest' tabIndex='-1' onChange={changeHandlerOptionsSorting} />
          <label htmlFor='cheapest'>ارزان ترین</label>
        </li>
      </ul>
    );
  }, [stateDataCourses.filter]);

  return (
    <Container fluid className='courses'>
      <Container fluid className='header-fluid'>
        <Container className='header'>
          <div className='title'>دوره ها</div>

          <div className='search-box'>
            <input type='text' id='input-search' />
            <select id='option-search'>
              <option value='title'>عنوان</option>
              <option value='teacher'>مدرس</option>
              <option value='category'>موضوع</option>
            </select>

            <button type='button' className='btn-search' onClick={searchingDataCourses}>
              جستوجو
            </button>
          </div>
        </Container>
      </Container>

      <Container>
        <Row>
          <Col className='col-12 col-sm-4 col-md-3 col-lg-2'>
            <div className='container-accordions'>
              <Accordion title={'مرتب سازی'} reloadAccordion={reloadAccordion}>
                {itemsAccordionSort}
              </Accordion>

              <Accordion title={'مدرس'} reloadAccordion={reloadAccordion}>
                {extractOptionsFiltering.itemsAccordionTeacher}
              </Accordion>

              <Accordion title={'موضوع'} reloadAccordion={reloadAccordion}>
                {extractOptionsFiltering.itemsAccordionCategory}
              </Accordion>

              <Accordion title={'وضعیت دوره'} reloadAccordion={reloadAccordion}>
                {itemsAccordionState}
              </Accordion>
            </div>
          </Col>

          <Col className='col-12 col-sm-8 col-md-9 col-lg-10' style={{ overflow: 'hidden' }}>
            <div className='container-cardCourses' ref={containerCardCourses}>
              <Row className='row-cols-1 row-cols-md-1 row-cols-lg-2 row-cols-xl-3'>
                {isPending ? (
                  <Loading />
                ) : dataFetchCourse.responseStatus !== 'dataReceived!' ? (
                  <NoResponse responseState={dataFetchCourse.responseStatus} />
                ) : !stateDataCourses.pagination.length ? (
                  <b>موردی یافت نشد!</b>
                ) : (
                  stateDataCourses.pagination.map((course) => {
                    return (
                      <Col key={course.id}>
                        <CardCourse {...course} />
                      </Col>
                    );
                  })
                )}
              </Row>

              {!reloadPaginate && (
                <ReactPaginate
                  renderOnZeroPageCount={null}
                  pageCount={stateDataCourses.sort.length <= 6 ? 0 : Math.ceil(stateDataCourses.sort.length / 6)}
                  containerClassName='container-paginate'
                  nextLabel={<IoIosArrowDropright className='icon' />}
                  nextClassName='btn-next'
                  previousLabel={<IoIosArrowDropleft className='icon' />}
                  previousClassName='btn-previous'
                  breakClassName='btn-num'
                  pageClassName='btn-num'
                  activeClassName='btn-active'
                  onPageChange={changeHandlerPagination}
                />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};
export default Courses;
