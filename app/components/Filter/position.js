import React from 'react';
import positions from '../../constants/positions';
import BaseFilter from './base';

const all = {
  value: '',
  label: 'All',
};

const PositionFilter = ({ selected, onChange, enableAllOption }) => (
  <BaseFilter
    selected={selected}
    onChange={onChange}
    options={enableAllOption ? [all, ...positions] : positions}
    label="Filter By Position"
  />
);

export default PositionFilter;
