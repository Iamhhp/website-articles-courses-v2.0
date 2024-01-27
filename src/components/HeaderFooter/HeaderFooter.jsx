import { Outlet } from 'react-router-dom';
import './HeaderFooter.css';

const HeaderFooter = () => {
  return (
    <div className='container-headerFooter'>
      <Outlet />
    </div>
  );
};
export default HeaderFooter;
