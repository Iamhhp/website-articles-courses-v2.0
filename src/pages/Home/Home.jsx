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
          ) : dataArticle.responseStatus ? (
            <SwiperSlide>
              <NoResponse responseState={dataArticle.responseState} />
            </SwiperSlide>
          ) : (
            dataArticle
              .filter((article, i) => i >= dataArticle.length - 6)
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
          autoplay={{ disableOnInteraction: false, pauseOnMouseEnter: true, delay: 2000 }}
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
          ) : dataCourse.responseStatus ? (
            <SwiperSlide>
              <NoResponse responseState={dataCourse.responseState} />
            </SwiperSlide>
          ) : (
            dataCourse
              .filter((course, i) => i >= dataCourse.length - 6)
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
    </>
  );
};
export default Home;
