import React from 'react';
import providers from '../../data/providers';
import './SelectList.scss';

const SelectList = ({ label, options, id, selected, update }) => {
  return (
    <div className='SelectList'>
      <label htmlFor={id}>{label}</label>
      <div className='select-list'>
        <select
          onClick={(event) => {
            if (
              selected.find(
                (provider) => provider.value === Number(event.target.value)
              )
            ) {
              return;
            }

            const provider = providers.find(
              (provider) => provider.value === Number(event.target.value)
            );

            if (provider) {
              update([...selected, provider]);
            }
          }}
          name={id}>
          {options.map(({ key, value }) => (
            <option value={value} key={value}>
              {key}
            </option>
          ))}
        </select>
        <div className='selected-options'>
          {selected.slice(0, 4).map(({ key, value }) => (
            <div
              className='option'
              key={value}
              onClick={() => {
                const providerIndex = selected.findIndex(
                  (provider) => provider.value === value
                );

                if (providerIndex >= 0) {
                  const tmpSelectedProviders = [...selected];
                  tmpSelectedProviders.splice(providerIndex, 1);
                  update(tmpSelectedProviders);
                }
              }}>
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
