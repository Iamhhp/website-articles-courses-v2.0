import './Hero.css';
import { memo, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import imgHero from '../../assets/images/hero.svg';
import { FaGooglePlay, FaRProject } from 'react-icons/fa';
import { PiStudentFill } from 'react-icons/pi';
import { RiArticleFill } from 'react-icons/ri';
import { GiTeacher } from 'react-icons/gi';
import aos from 'aos';
import 'aos/dist/aos.css';
import CountUp from 'react-countup';

const Hero = () => {
  useEffect(() => {
    console.log('Hero reRender!');
  });

  useEffect(() => {
    aos.init();
  }, []);

  const dataHeroBox = [
    { id: 0, title: 'تعداد دانشجوها', icon: <PiStudentFill className='icon' />, count: 1072 },
    { id: 1, title: 'تعداد پروژه ها', icon: <FaRProject className='icon' />, count: 76 },
    { id: 2, title: 'تعداد مقالات', icon: <RiArticleFill className='icon' />, count: 14 },
    { id: 3, title: 'تعداد دوره ها', icon: <GiTeacher className='icon' />, count: 11 },
  ];

  return (
    <>
      <Container fluid className='container-hero'>
        <Container>
          <Row>
            <Col className='sec-r col-12 col-md-5 col-lg-5' data-aos='fade-left'>
              <img src={imgHero} alt='Hero images' />
            </Col>

            <Col className='sec-l col-12 col-md-7 col-lg-7' data-aos='fade-right'>
              <div className='title-hero'>آمارها باعث افتخار ما هستند!</div>

              <Row className='row-cols-1 row-cols-sm-2'>
                {dataHeroBox.map((data) => {
                  return (
                    <Col data-aos='flip-right' key={data.id}>
                      <HeroBox {...data} />
                    </Col>
                  );
                })}
              </Row>

              <div className='btn-start-learn'>
                شروع یادگیری <FaGooglePlay className='icon' />
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
        <path
          fill='#0073e6 '
          d='M0 224l30-32c30-32 90-96 150-101.3 60-5.7 120 48.3 180 90.6 60 42.7 120 74.7 180 69.4 60-5.7 120-47.7 180-69.4C780 160 840 160 900 144c60-16 120-48 180-26.7 60 21.7 120 95.7 180 90.7s120-91 150-133.3l30-42.7V0H0z'
        ></path>
      </svg>
    </>
  );
};
export default memo(Hero);

const HeroBox = ({ icon, title, count }) => {
  return (
    <Container className='container-heroBox'>
      <div className='title'>
        {icon} {title}
      </div>
      <CountUp className='count' delay={1} end={count} />
    </Container>
  );
};
