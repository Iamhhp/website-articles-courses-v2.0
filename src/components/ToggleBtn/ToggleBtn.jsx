import { memo } from 'react';
import './ToggleBtn.css';

const ToggleBtn = ({ id, changeHandler }) => {
  return (
    <label className='toggle-btn' htmlFor={id}>
      <input type='checkbox' id={id} onChange={changeHandler} />
      <div className='slider' />
    </label>
  );
};
export default memo(ToggleBtn);
