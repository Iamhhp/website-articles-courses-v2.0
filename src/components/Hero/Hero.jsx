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
