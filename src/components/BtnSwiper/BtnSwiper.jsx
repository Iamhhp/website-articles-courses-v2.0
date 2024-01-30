import { useSwiper } from 'swiper/react';
import './BtnSwiper.css';
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';

const BtnSwiper = () => {
  const swiper = useSwiper();

  return (
    <div className='container-btns-swiper'>
      <button
        type='button'
        onClick={() => {
          swiper.slideNext();
        }}
      >
        <FaChevronCircleRight className='icon' />
      </button>
      <button
        type='button'
        onClick={() => {
          swiper.slidePrev();
        }}
      >
        <FaChevronCircleLeft className='icon' />
      </button>
    </div>
  );
};
export default BtnSwiper;
