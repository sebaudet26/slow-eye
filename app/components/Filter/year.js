import React from 'react';
import years from '../../constants/years';
import BaseFilter from './base';

const YearFilter = ({ selected, onChange }) => (
  <BaseFilter
    selected={selected}
    onChange={onChange}
    options={years}
    label="Filter By Year"
  />
);

export default YearFilter;
