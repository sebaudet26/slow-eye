import React from 'react';
import years from '../../constants/years';
import BaseFilter from './base';

const YearFilter = ({ selected, onChange, startYear }) => (
  <BaseFilter
    selected={selected}
    onChange={onChange}
    options={startYear ? years.filter(o => o.value >= startYear) : years}
    label="Filter By Year"
  />
);

export default YearFilter;
