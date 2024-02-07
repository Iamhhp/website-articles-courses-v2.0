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
    console.log('Page Articles reRender!');
    window.scrollTo(0, 0);
  });

  const containerCardArticles = useRef(null);
  const [reloadAccordion, setReloadAccordion] = useState(true);
  const [dataFetchArticles, isPending] = useFetch('https://dbserver.liara.run/articles');
  const { stateDataArticles, changeStateDataArticles } = useArticlesReducer();
  useEffect(() => {
    if (dataFetchArticles.responseStatus === 'receivedData!') {
      changeStateDataArticles(ACTION_TYPE.DATA_SEARCH, [...dataFetchArticles.response]);
    } else {
      changeStateDataArticles(ACTION_TYPE.DATA_SEARCH, []);
    }
  }, [dataFetchArticles]);

  // Search Options Accordion ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const searchingDataArticles = (e) => {
    const boxSearch = e.target.parentElement;
    const inputSearch = boxSearch.children[0];
    const optionSearch = boxSearch.children[1];

    const dataArticles = { search: [] };
    dataArticles.search = dataFetchArticles.response.filter((article) => article[optionSearch.value].includes(inputSearch.value));

    optionSorting.current = 'newest';
    optionsFiltering.current = { writers: [], categories: [] };
    setReloadAccordion(false);
    changeStateDataArticles(ACTION_TYPE.DATA_SEARCH, [...dataArticles.search]);
  };
  useEffect(() => {
    setReloadAccordion(true);
  }, [reloadAccordion]);

  useEffect(() => {
    filteringDataArticles();
  }, [stateDataArticles.search]);

  // Filtering Data Articles ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const optionsFiltering = useRef({ writers: [], categories: [] });
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

  useEffect(() => {
    sortingDataArticles();
  }, [stateDataArticles.filter]);

  // Sorting Data Articles /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const changeHandlerOptionsSorting = (e) => {
    optionSorting.current = e.target.id;
    sortingDataArticles();
  };

  const optionSorting = useRef('newest');
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

    changeStateDataArticles(ACTION_TYPE.DATA_SORT, [...dataArticles.sorting]);
  };

  useEffect(() => {
    setReloadPaginate(() => false);
    paginationDataArticles({ selected: 0 });
  }, [stateDataArticles.sort]);

  // Paginate Data Articles ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [reloadPaginate, setReloadPaginate] = useState(true);
  useEffect(() => {
    setReloadPaginate(true);
  }, [reloadPaginate]);

  const paginationDataArticles = ({ selected: pageNum }) => {
    const dataArticles = { pagination: [] };
    dataArticles.pagination = stateDataArticles.sort.filter((article, i) => i >= pageNum * 6 && i < (pageNum + 1) * 6);

    containerCardArticles.current.classList.add('container-cardArticle-hide');
    window.setTimeout(() => {
      changeStateDataArticles(ACTION_TYPE.DATA_PAGINATION, [...dataArticles.pagination]);
    }, 200);
  };

  useEffect(() => {
    containerCardArticles.current.classList.remove('container-cardArticle-hide');
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
            <li>
              <input type='checkbox' id={`writer-${i}`} onChange={changeHandlerOptionsWriter} />
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
            <li>
              <input type='checkbox' id={`category-${i}`} onChange={changeHandlerOptionsCategory} />
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
  const itemsAccordionSort = useMemo(() => {
    return (
      <ul className='items-accordion'>
        <li>
          <input type='radio' name='sorting' id='newest' onChange={changeHandlerOptionsSorting} defaultChecked />
          <label htmlFor='newest'>جدیدترین</label>
        </li>
        <li>
          <input type='radio' name='sorting' id='oldest' onChange={changeHandlerOptionsSorting} />
          <label htmlFor='oldest'>قدیمی ترین</label>
        </li>
        <li>
          <input type='radio' name='sorting' id='longest' onChange={changeHandlerOptionsSorting} />
          <label htmlFor='longest'>طولانی ترین</label>
        </li>
        <li>
          <input type='radio' name='sorting' id='shortest' onChange={changeHandlerOptionsSorting} />
          <label htmlFor='shortest'>کوتاه ترین</label>
        </li>
      </ul>
    );
  }, [stateDataArticles.filter]);

  return (
    <Container fluid className='articles'>
      <Container fluid className='header-fluid'>
        <Container className='header'>
          <div className='title'>مقالات</div>

          <div className='search-box'>
            <input type='text' id='input-search' />
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

      <Container>
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
              <Row className='row-cols-1 row-cols-md-1 row-cols-lg-2 row-cols-xl-3'>
                {isPending ? (
                  <Loading />
                ) : dataFetchArticles.responseStatus !== 'receivedData!' ? (
                  <NoResponse responseState={dataFetchArticles.responseStatus} />
                ) : !stateDataArticles.pagination.length ? (
                  <b>موردی یافت نشد!</b>
                ) : (
                  stateDataArticles.pagination.map((article) => {
                    return (
                      <Col key={article.id}>
                        <CardArticle {...article} />
                      </Col>
                    );
                  })
                )}
              </Row>

              {reloadPaginate && (
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
                  onPageChange={paginationDataArticles}
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
