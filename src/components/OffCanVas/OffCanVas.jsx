import { memo, useEffect, useRef } from 'react';
import './OffCanVas.css';

const OffCanVas = ({ itemsMenu, title, stateShowMenu }) => {
  useEffect(() => {
    console.log('OffCanVas reRender!');
  });

  const elementContainerMenu = useRef(null);
  useEffect(() => {
    window.setTimeout(() => {
      elementContainerMenu.current?.classList.remove('container-OffCanVas-hide');
    }, 50);
  }, [stateShowMenu.isShowMenu]);

  const showMenuHandler = () => {
    elementContainerMenu.current.classList.add('container-OffCanVas-hide');

    window.setTimeout(() => {
      stateShowMenu.setIsShowMenu(false);
    }, 500);
  };

  return (
    <div className='container-OffCanVas container-OffCanVas-hide' ref={elementContainerMenu} onClick={showMenuHandler}>
      <div className='menu'>
        <div className='title'>{title}</div>
        <div className='items'> {itemsMenu}</div>
      </div>
    </div>
  );
};
export default memo(OffCanVas);
