import React from 'react';
import './Input.scss';

const Input = ({ onChange, label, type, id, value }) => (
  <div className='Input'>
    <label htmlFor={id}>{label}</label>
    <input id={id} name={id} type={type} onChange={onChange} value={value} />
  </div>
);

export default Input;
