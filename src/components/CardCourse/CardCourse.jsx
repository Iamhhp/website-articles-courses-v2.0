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

        {off && <div className='lbl-off'>{off}%</div>}
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
        <Link className='btn-buy'>ثبت نام</Link>
        <RendingPrice {...{ off, mainPrice }} />
      </div>
    </div>
  );
};
export default memo(CardCourse);

const RendingPrice = ({ off, mainPrice }) => {
  const formattingPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className='price'>
      {off ? (
        <div className='off-price'>
          <div className='off'>{formattingPrice((off / 100) * mainPrice)}</div>
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
