import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import './RendingPrice.css';

const RendingPrice = ({ discountPrice, mainPrice }) => {
  const formattingPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className='price'>
      {discountPrice ? (
        <div className='off-price'>
          <div className='off'>{formattingPrice((discountPrice / 100) * mainPrice)}</div>
          <div className='main'>{formattingPrice(mainPrice)}</div>
        </div>
      ) : (
        <>
          <div className='main-price'>{formattingPrice(mainPrice)}</div>
        </>
      )}
      <RiMoneyDollarCircleFill className='icon' />
    </div>
  );
};
export default RendingPrice;
