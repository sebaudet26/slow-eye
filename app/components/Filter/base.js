import React from 'react';
import Select from 'react-select';
import { find, propEq } from 'ramda';
import { customStyles } from './helpers';

const BaseFilter = ({
  selected, onChange, options = [], label = 'Filter',
}) => (
  <div className="filters-item">
    <div className="filters-item-label">{label}</div>
    <Select
      onChange={onChange}
      classNamePrefix="react-select"
      defaultValue={options[0]}
      isSearchable={false}
      options={options}
      styles={customStyles}
      value={find(propEq('value', selected))(options)}
      theme={theme => ({
        ...theme,
        borderRadius: 6,
        colors: {
          ...theme.colors,
          primary: '#3D5AFE',
          primary50: '#CBD1DB',
          primary25: '#E2E7EC',
        },
      })}
    />
  </div>
);

export default BaseFilter;
