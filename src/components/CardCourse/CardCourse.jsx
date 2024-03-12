import './CardCourse.css';
import { Link } from 'react-router-dom';
import { GiDuration } from 'react-icons/gi';
import { FaChalkboardTeacher, FaRegQuestionCircle } from 'react-icons/fa';
import { memo, useEffect } from 'react';
import { PiStudentFill } from 'react-icons/pi';
import RendingPrice from '../RendingPrice/RendingPrice';

const CardCourse = ({ id, studentCount, image, title, description, teacher, duration, discountPrice, mainPrice }) => {
  useEffect(() => {
    console.log('CardCourse reRender!');
  });

  return (
    <div className='card-course'>
      <div className='image'>
        <img src={image} alt='' />

        <div className='student-count'>
          {studentCount}
          <div className='q-mark'>
            <FaRegQuestionCircle className='icon' />
          </div>
          <PiStudentFill className='icon-student' />
        </div>

        {discountPrice && <div className='lbl-off'>{discountPrice}%</div>}
      </div>

      <div className='title'>
        {title}-{id}
      </div>
      <div className='desc'>{description}</div>

      <div className='details-course'>
        <div className='teacher'>
          <FaChalkboardTeacher className='icon' />
          مدرس : {teacher}
        </div>

        <div className='duration'>
          {duration}
          <GiDuration className='icon' />
        </div>
      </div>

      <div className='footer'>
        <Link to={`/course/${id}`} className='btn-buy'>
          جزئیات دوره
        </Link>
        <RendingPrice {...{ discountPrice, mainPrice }} />
      </div>
    </div>
  );
};
export default memo(CardCourse);
