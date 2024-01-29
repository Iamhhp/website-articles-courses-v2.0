import './CardCourse.css';
import { Link } from 'react-router-dom';
import { GiDuration } from 'react-icons/gi';
import { FaChalkboardTeacher, FaRegQuestionCircle } from 'react-icons/fa';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { memo, useEffect } from 'react';
import { PiStudentFill } from 'react-icons/pi';

const CardCourse = ({ id, studentCount, image, title, description, teacher, duration, off, mainPrice }) => {
  useEffect(() => {
    console.log('CardCourse reRender!');
  });

  const formattingPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

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
      </div>

      <div className='title'>{title}</div>
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
        <Link className='btn-buy'>ثبت نام</Link>
        <div className='price'>
          {off ? formattingPrice((off / 100) * mainPrice) : formattingPrice(mainPrice)}
          <RiMoneyDollarCircleFill className='icon' />
        </div>
      </div>
    </div>
  );
};
export default memo(CardCourse);
