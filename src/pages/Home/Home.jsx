import { Container } from 'react-bootstrap';
import './Home.css';
import Hero from '../../components/Hero/Hero';

const Home = () => {
  return (
    <>
      <Hero />
      <Container fluid className='container-home'></Container>
    </>
  );
};
export default Home;
