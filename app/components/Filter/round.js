import React from 'react';
import BaseFilter from './base';

const RoundFilter = ({ selected, onChange, options }) => (
  <BaseFilter
    selected={selected}
    onChange={onChange}
    options={options}
    label="Filter By Round"
  />
);

export default RoundFilter;
