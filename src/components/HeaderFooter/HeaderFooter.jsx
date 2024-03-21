import './HeaderFooter.css';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useEffect, useState } from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

const HeaderFooter = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const pathRoute = window.location.pathname;
    if (pathRoute === '/') {
      navigate('/home');
    }

    const isLightMode = window.matchMedia('(prefers-color-scheme:light)').matches;
    if (isLightMode) {
      setThemeMode(() => 'light');
    } else {
      setThemeMode(() => 'dark');
    }
  }, []);

  const [themeMode, setThemeMode] = useState('light');
  const changeHandlerThemeMode = () => {
    setThemeMode((prevState) => {
      if (prevState === 'light') {
        return 'dark';
      } else {
        return 'light';
      }
    });
  };

  return (
    <>
      <Header themeMode={themeMode} />
      <div className='container-headerFooter' theme-mode={themeMode}>
        <Outlet />

        <div className='container-theme'>
          <label htmlFor='switch-theme'>
            <input type='checkbox' id='switch-theme' onChange={changeHandlerThemeMode} checked={themeMode === 'dark' ? true : false} />

            <MdDarkMode className='icon-theme dark-mode-active' />
            <MdLightMode className='icon-theme light-mode-active' />
          </label>
        </div>
      </div>
      <Footer themeMode={themeMode} />
    </>
  );
};
export default HeaderFooter;
