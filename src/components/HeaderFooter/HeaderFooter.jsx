import { Outlet } from 'react-router-dom';
import './HeaderFooter.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const HeaderFooter = () => {
  return (
    <div className='container-headerFooter'>
      <Header />
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
};
export default HeaderFooter;
