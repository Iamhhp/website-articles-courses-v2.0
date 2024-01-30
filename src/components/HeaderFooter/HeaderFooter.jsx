import { Outlet } from 'react-router-dom';
import './HeaderFooter.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const HeaderFooter = () => {
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
