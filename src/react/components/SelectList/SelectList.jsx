import React from 'react';
import './SelectList.scss';

const SelectList = ({ label, options, onChange, id, selected, onRemove }) => {
  return (
    <div className='SelectList'>
      <label htmlFor={id}>{label}</label>
      <div className='select-list'>
        <select onChange={onChange} name={id}>
          {options.map(({ key, value }) => (
            <option value={value} key={value}>
              {key}
            </option>
          ))}
        </select>
        <div className='selected-options'>
          {selected.slice(0, 4).map(({ key, value }) => (
            <div className='option' key={value} onClick={() => onRemove(value)}>
              <span>{key}</span>
              <b>X</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectList;
