import './Articles.css';
import Accordion from '../../components/Accordion/Accordion';
import { Col, Container, Row } from 'react-bootstrap';
import { useEffect, useMemo, useRef, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import useArticlesReducer, { ACTION_TYPE } from '../../hooks/useArticlesReducer';
import CardArticle from '../../components/CardArticle/CardArticle';
import ReactPaginate from 'react-paginate';
import { IoIosArrowDropright, IoIosArrowDropleft } from 'react-icons/io';
import Loading from '../../components/Loading/Loading';
import NoResponse from '../../components/NoResponse/NoResponse';

const Articles = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const [dataFetchArticles, isPending] = useFetch('https://dbserver.liara.run/articles');
  const { stateDataArticles, changeStateDataArticles } = useArticlesReducer();

  const containerCardArticles = useRef(null);
  const [reloadAccordion, setReloadAccordion] = useState(false);
  const [reloadPaginate, setReloadPaginate] = useState(true); // true for don't show in the first rendering component

  const optionSorting = useRef('newest');
  const optionsFiltering = useRef({ writers: [], categories: [] });

  useEffect(() => {
    // for stop call function in first rendering and stop over animation
    if (!isPending) {
      changeStateDataArticles(ACTION_TYPE.DATA_SEARCH, [...dataFetchArticles.response]);
    }
  }, [dataFetchArticles]);

  // Search Options Accordion ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const searchingDataArticles = (e) => {
    const dataArticles = { search: [] };
    const inputSearch = e.target.parentElement.children[0].value;
    const optionSearch = e.target.parentElement.children[1].value;
    dataArticles.search = dataFetchArticles.response.filter((article) => article[optionSearch].includes(inputSearch));

    optionSorting.current = 'newest';
    optionsFiltering.current = { writers: [], categories: [] };
    setReloadAccordion(() => true);
    changeStateDataArticles(ACTION_TYPE.DATA_SEARCH, [...dataArticles.search]);
  };

  useEffect(() => {
    // for stop call function in first rendering and stop over animation
    if (!isPending) {
      setReloadAccordion(() => false);
    }
  }, [reloadAccordion]);

  // Filtering Data Articles ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    // for stop call function in first rendering and stop over animation
    if (!isPending) {
      filteringDataArticles();
    }
  }, [stateDataArticles.search]);

  const filteringDataArticles = () => {
    const dataArticles = { filtering: [] };
    if (optionsFiltering.current.writers.length) {
      dataArticles.filtering = stateDataArticles.search.filter((article) => optionsFiltering.current.writers.includes(article.writer));
    } else {
      dataArticles.filtering = [...stateDataArticles.search];
    }

    if (optionsFiltering.current.categories.length) {
      dataArticles.filtering = dataArticles.filtering.filter((article) => optionsFiltering.current.categories.includes(article.category));
    }

    changeStateDataArticles(ACTION_TYPE.DATA_FILTER, [...dataArticles.filtering]);
  };

  // Sorting Data Articles /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    // for stop call function in first rendering and stop over animation
    if (!isPending) {
      sortingDataArticles();
    }
  }, [stateDataArticles.filter]);

  const sortingDataArticles = () => {
    const dataArticles = { sorting: [] };
    switch (optionSorting.current) {
      case 'newest':
        dataArticles.sorting = stateDataArticles.filter.sort((a, b) => b.id - a.id);
        break;
      case 'oldest':
        dataArticles.sorting = stateDataArticles.filter.sort((a, b) => a.id - b.id);
        break;
      case 'longest':
        dataArticles.sorting = stateDataArticles.filter.sort((a, b) => {
          const readingTimeA = a.readingTime.split(':');
          const timeA = Number(readingTimeA[0]) * 60 + Number(readingTimeA[1]);

          const readingTimeB = b.readingTime.split(':');
          const timeB = Number(readingTimeB[0]) * 60 + Number(readingTimeB[1]);

          return timeB - timeA;
        });
        break;
      default: // 'shortest':
        dataArticles.sorting = stateDataArticles.filter.sort((a, b) => {
          const readingTimeA = a.readingTime.split(':');
          const timeA = Number(readingTimeA[0]) * 60 + Number(readingTimeA[1]);

          const readingTimeB = b.readingTime.split(':');
          const timeB = Number(readingTimeB[0]) * 60 + Number(readingTimeB[1]);

          return timeA - timeB;
        });
        break;
    }

    setReloadPaginate(() => true);
    changeStateDataArticles(ACTION_TYPE.DATA_SORT, [...dataArticles.sorting]);
  };

  // Paginate Data Articles /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    // for stop call function in first rendering and stop over animation
    if (!isPending) {
      changeHandlerPagination({ selected: 0 });
    }
  }, [stateDataArticles.sort]);

  const changeHandlerPagination = ({ selected: pageNum }) => {
    const dataArticles = { pagination: [] };
    dataArticles.pagination = stateDataArticles.sort.filter((article, i) => i >= pageNum * 6 && i < (pageNum + 1) * 6);

    containerCardArticles.current.classList.add('container-cardArticles-hide');

    window.setTimeout(() => {
      changeStateDataArticles(ACTION_TYPE.DATA_PAGINATION, [...dataArticles.pagination]);
      setReloadPaginate(() => false);
    }, 200);
  };

  useEffect(() => {
    // for stop call function in first rendering and stop over animation
    if (!isPending) {
      containerCardArticles.current.classList.remove('container-cardArticles-hide');
    }
  }, [stateDataArticles.pagination]);

  // Items Accordions ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Extract Items Filtering Accordion //////////////////
  const changeHandlerOptionsCategory = (e) => {
    const optionCategory = e.target;
    const categoryLabel = optionCategory.nextSibling.innerText;
    if (optionCategory.checked) {
      optionsFiltering.current.categories.push(categoryLabel);
    } else {
      optionsFiltering.current.categories = optionsFiltering.current.categories.filter((category) => category !== categoryLabel);
    }

    filteringDataArticles();
  };

  const changeHandlerOptionsWriter = (e) => {
    const optionWriter = e.target;
    const writerLabel = optionWriter.nextSibling.innerText;
    if (optionWriter.checked) {
      optionsFiltering.current.writers.push(writerLabel);
    } else {
      optionsFiltering.current.writers = optionsFiltering.current.writers.filter((writer) => writer !== writerLabel);
    }

    filteringDataArticles();
  };

  const extractOptionsFiltering = useMemo(() => {
    const optionsWriter = [];
    const optionsCategory = [];
    stateDataArticles.search.forEach((article) => {
      if (!optionsWriter.includes(article.writer)) {
        optionsWriter.push(article.writer);
      }

      if (!optionsCategory.includes(article.category)) {
        optionsCategory.push(article.category);
      }
    });

    const itemsAccordionWriter = (
      <ul className='items-accordion'>
        {optionsWriter.map((writer, i) => {
          return (
            <li key={i}>
              <input type='checkbox' id={`writer-${i}`} onChange={changeHandlerOptionsWriter} tabIndex='-1' />
              <label htmlFor={`writer-${i}`}>{writer}</label>
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
              <input type='checkbox' id={`category-${i}`} onChange={changeHandlerOptionsCategory} tabIndex='-1' />
              <label htmlFor={`category-${i}`}>{category}</label>
            </li>
          );
        })}
      </ul>
    );

    return {
      itemsAccordionWriter,
      itemsAccordionCategory,
    };
  }, [stateDataArticles.search]);

  // Items Accordion Sorting ///////////////////////////
  const changeHandlerOptionsSorting = (e) => {
    optionSorting.current = e.target.id;
    sortingDataArticles();
  };

  const itemsAccordionSort = useMemo(() => {
    return (
      <ul className='items-accordion'>
        <li>
          <input type='radio' name='sorting' id='newest' onChange={changeHandlerOptionsSorting} defaultChecked tabIndex='-1' />
          <label htmlFor='newest'>جدیدترین</label>
        </li>
        <li>
          <input type='radio' name='sorting' id='oldest' onChange={changeHandlerOptionsSorting} tabIndex='-1' />
          <label htmlFor='oldest'>قدیمی ترین</label>
        </li>
        <li>
          <input type='radio' name='sorting' id='longest' onChange={changeHandlerOptionsSorting} tabIndex='-1' />
          <label htmlFor='longest'>طولانی ترین</label>
        </li>
        <li>
          <input type='radio' name='sorting' id='shortest' onChange={changeHandlerOptionsSorting} tabIndex='-1' />
          <label htmlFor='shortest'>کوتاه ترین</label>
        </li>
      </ul>
    );
  }, [stateDataArticles.filter]);

  const keyDownHandlerInputSearch = (e) => {
    const elementBtnSearch = e.target.nextElementSibling.nextElementSibling;
    const key = e.key;
    if (key === 'Enter') {
      searchingDataArticles({ target: elementBtnSearch });
    }
  };

  return (
    <Container fluid className='articles'>
      <Container fluid className='header-fluid'>
        <Container className='header' fluid='xl'>
          <div className='title'>مقالات</div>

          <div className='search-box'>
            <input type='text' id='input-search' onKeyDown={keyDownHandlerInputSearch} />
            <select id='option-search'>
              <option value='title'>عنوان</option>
              <option value='writer'>نویسنده</option>
              <option value='category'>موضوع</option>
            </select>

            <button type='button' className='btn-search' onClick={searchingDataArticles}>
              جستوجو
            </button>
          </div>
        </Container>
      </Container>

      <Container fluid='xl'>
        <Row>
          <Col className='col-12 col-sm-4 col-md-3 col-lg-2'>
            <div className='container-accordions'>
              <Accordion title={'مرتب سازی'} reloadAccordion={reloadAccordion}>
                {itemsAccordionSort}
              </Accordion>

              <Accordion title={'نویسنده'} reloadAccordion={reloadAccordion}>
                {extractOptionsFiltering.itemsAccordionWriter}
              </Accordion>

              <Accordion title={'موضوع'} reloadAccordion={reloadAccordion}>
                {extractOptionsFiltering.itemsAccordionCategory}
              </Accordion>
            </div>
          </Col>

          <Col className='col-12 col-sm-8 col-md-9 col-lg-10' style={{ overflow: 'hidden' }}>
            <div className='container-cardArticle' ref={containerCardArticles}>
              <Row className='row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4'>
                {isPending ? (
                  <Loading />
                ) : dataFetchArticles.responseStatus !== 'dataReceived!' ? (
                  <NoResponse responseState={dataFetchArticles.responseStatus} />
                ) : !stateDataArticles.pagination.length ? (
                  <b>موردی یافت نشد!</b>
                ) : (
                  stateDataArticles.pagination[0] && // for don't show card in the first rendering component
                  stateDataArticles.pagination.map((article) => {
                    return (
                      <Col key={article.id}>
                        <CardArticle {...article} />
                      </Col>
                    );
                  })
                )}
              </Row>

              {!reloadPaginate && (
                <ReactPaginate
                  renderOnZeroPageCount={null}
                  pageCount={stateDataArticles.sort.length <= 6 ? 0 : Math.ceil(stateDataArticles.sort.length / 6)}
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
export default Articles;
