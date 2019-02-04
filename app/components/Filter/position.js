import React from 'react';
import positions from '../../constants/positions';
import BaseFilter from './base';


const PositionFilter = ({ selected, onChange }) => (
  <BaseFilter
    selected={selected}
    onChange={onChange}
    options={positions}
    label="Filter By Position"
  />
);

export default PositionFilter;
