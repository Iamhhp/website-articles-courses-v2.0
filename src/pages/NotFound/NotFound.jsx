import { Container } from 'react-bootstrap';
import './NotFound.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const NotFound = () => {
  const pathUrl = useLocation().pathname;
  const navigate = useNavigate();

  useEffect(() => {
    console.log(typeof pathUrl, pathUrl);
    if (pathUrl === '/website-articles-courses/') {
      navigate('/Home');
    }
  }, []);

  return (
    <Container className='container-not-found'>
      <div className='title'>404</div>
      <div className='desc'>آدرس مورد نظر موجود نمی باشد!</div>
    </Container>
  );
};
export default NotFound;
