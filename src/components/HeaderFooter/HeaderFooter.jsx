import './HeaderFooter.css';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useEffect } from 'react';

const HeaderFooter = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const pathRoute = window.location.pathname;
    if (pathRoute === '/') {
      navigate('/home');
    }
  }, []);

  return (
    <>
      <Header />
      <div className='container-headerFooter'>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};
export default HeaderFooter;
