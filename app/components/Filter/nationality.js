import React from 'react';

import { customStyles } from './helpers';

const nationalities = [
  { value: 'all', label: 'All' },
  { value: 'CAN', label: 'Canada' },
  { value: 'USA', label: 'United States' },
  { value: 'RUS', label: 'Russia' },
  { value: 'SWE', label: 'Sweden' },
  { value: 'FIN', label: 'Finland' },
  { value: 'CZE', label: 'Czech Republic' },
  { value: 'CHE', label: 'Switzerland' },
  { value: 'SVK', label: 'Slovakia' },
  { value: 'DEU', label: 'Germany' },
  { value: 'AUT', label: 'Austria' },
  { value: 'DNK', label: 'Denmark' },
  { value: 'FRA', label: 'France' },
  { value: 'LVA', label: 'Latvia' },
  { value: 'NOR', label: 'Norway' },
  { value: 'SVN', label: 'Slovenia' },
  { value: 'NLD', label: 'Netherlands' },
  { value: 'AUS', label: 'Australia' },
  { value: 'BLR', label: 'Belarus' },
  { value: 'UKR', label: 'Ukraine' },
  { value: 'KAZ', label: 'Kazakhstan' },
];

const NationalityFilter = ({ filter }) => (
  <div className="filters-item">
    <div className="filters-item-label">Filter By Nationality</div>
    <Select
      onChange={this.handleNatChange}
      classNamePrefix="react-select"
      defaultValue={nationalities[0]}
      options={nationalities}
      styles={customStyles}
      value={find(propEq('value', natSelected))(nationalities)}
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

export default NationalityFilter;
