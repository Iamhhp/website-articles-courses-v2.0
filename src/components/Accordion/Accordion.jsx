import { memo, useEffect, useRef } from 'react';
import './Accordion.css';
import { FaChevronDown } from 'react-icons/fa';

const Accordion = ({ title, children, reloadAccordion }) => {
  console.log('Accordion reRender!', title);

  const accordion = useRef(null);
  useEffect(() => {
    accordion.current.classList.remove('accordion-active');
    accordion.current.style.height = accordion.current.children[0].scrollHeight + 'px';
  }, [reloadAccordion]);

  const clickHandlerAccordion = (e) => {
    const heightTitle = accordion.current.children[0].scrollHeight + 'px';
    const result = accordion.current.classList.toggle('accordion-active');
    if (result) {
      accordion.current.style.height = accordion.current.scrollHeight + 'px';
    } else {
      accordion.current.style.height = heightTitle;
    }
  };

  return (
    <div className='accordion' ref={accordion}>
      <div className='title' onClick={clickHandlerAccordion}>
        {title}
        <FaChevronDown className='icon' />
      </div>

      <div className='items'>{reloadAccordion && children}</div>
    </div>
  );
};
export default memo(Accordion);
