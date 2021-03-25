import React from 'react';
import './Select.scss';

const Select = ({ onChange, label, id, value, options }) => (
  <div className='Select'>
    <label htmlFor={id}>{label}</label>
    <select id={id} name={id} value={value} onChange={onChange}>
      {options.map(({ key, value }) => (
        <option value={value} key={value}>
          {key}
        </option>
      ))}
    </select>
  </div>
);

export default Select;
