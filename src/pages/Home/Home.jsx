import './Home.css';
import useFetch from '../../hooks/useFetch';
import Hero from '../../components/Hero/Hero';
import CardArticle from '../../components/CardArticle/CardArticle';
import CardCourse from '../../components/CardCourse/CardCourse';
import NoResponse from '../NoResponse/NoResponse';
import { Container } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import BtnSwiper from '../../components/BtnSwiper/BtnSwiper';
import { useEffect } from 'react';

const Home = () => {
  const [dataArticle, isPendingArticle] = useFetch('https://dbserver.liara.run/articles');
  const [dataCourse, isPendingCourse] = useFetch('https://dbserver.liara.run/courses');

  return (
    <>
      <Hero />

      <Container className='container-home'>
        <Swiper
          slidesPerView={1}
          spaceBetween={100}
          breakpoints={{ 768: { slidesPerView: 1 }, 992: { slidesPerView: 2 }, 1200: { slidesPerView: 3 }, 1400: { slidesPerView: 4 } }}
          autoplay={{ disableOnInteraction: false, pauseOnMouseEnter: true, delay: 2000 }}
          modules={[Autoplay]}
          className='container-slider'
        >
          <div className='header-new-articles'>
            <div className='title'>جدیدترین مقالات</div>

            <div className='btn-swiper'>
              <BtnSwiper />
            </div>
          </div>

          {isPendingArticle ? (
            <SwiperSlide>
              <h3>درحال بارگذاری...</h3>
            </SwiperSlide>
          ) : dataArticle.responseStatus !== 'receivedData!' ? (
            <SwiperSlide>
              <NoResponse responseState={dataArticle.responseStatus} />
            </SwiperSlide>
          ) : (
            dataArticle.response
              .filter((article, i) => i >= dataArticle.response.length - 6)
              .map((article) => {
                return (
                  <SwiperSlide key={article.id}>
                    <CardArticle {...article} />
                  </SwiperSlide>
                );
              })
          )}
        </Swiper>

        <Swiper
          slidesPerView={1}
          spaceBetween={100}
          breakpoints={{ 768: { slidesPerView: 1 }, 992: { slidesPerView: 2 }, 1200: { slidesPerView: 3 }, 1400: { slidesPerView: 4 } }}
          autoplay={{ disableOnInteraction: false, pauseOnMouseEnter: true, delay: 2500 }}
          modules={[Autoplay]}
          className='container-slider'
        >
          <div className='header-new-articles'>
            <div className='title'>جدیدترین دوره ها</div>

            <div className='btn-swiper'>
              <BtnSwiper />
            </div>
          </div>

          {isPendingCourse ? (
            <SwiperSlide>
              <h3>درحال بارگذاری...</h3>
            </SwiperSlide>
          ) : dataCourse.responseStatus !== 'receivedData!' ? (
            <SwiperSlide>
              <NoResponse responseState={dataCourse.responseStatus} />
            </SwiperSlide>
          ) : (
            dataCourse.response
              .filter((course, i) => i >= dataCourse.response.length - 6)
              .map((course) => {
                return (
                  <SwiperSlide key={course.id}>
                    <CardCourse {...course} />
                  </SwiperSlide>
                );
              })
          )}
        </Swiper>
      </Container>

      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
        <path
          fill='#00a9ff'
          d='M0 32l26.7 42.7C53.3 117 107 203 160 218.7c53.3 16.3 107-37.7 160-48 53.3-10.7 107 21.3 160 42.6 53.3 21.7 107 31.7 160 16C693.3 213 747 171 800 144c53.3-27 107-37 160-26.7 53.3 10.7 107 42.7 160 48 53.3 5.7 107-16.3 160 5.4 53.3 21.3 107 85.3 133 117.3l27 32H0z'
        ></path>
      </svg>
    </>
  );
};
export default Home;
