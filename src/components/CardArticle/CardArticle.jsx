import { Link } from 'react-router-dom';
import './CardArticle.css';
import { FaBookReader } from 'react-icons/fa';
import { memo } from 'react';

const CardArticle = ({ id, image, title, description, writer, readingTime }) => {
  return (
    <div className='card-article'>
      <img src={image} alt='' />
      <div className='title'>
        {title}-{id}
      </div>
      <div className='desc'>{description}. </div>{' '}
      <Link to={`/Article/${id}`} className='btn-continue'>
        ادامه مقاله
      </Link>
      <div className='footer'>
        <div className='writer'>نویسنده : {writer}</div>
        <div className='reading-time'>
          {readingTime}
          <FaBookReader className='icon' />
        </div>
      </div>
    </div>
  );
};
export default memo(CardArticle);
