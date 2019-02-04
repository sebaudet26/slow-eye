import React from 'react';
import BaseFilter from './base';

const TeamFilter = ({ selected, onChange, options }) => (
  <BaseFilter
    selected={selected}
    onChange={onChange}
    options={options}
    label="Filter By Team"
  />
);

export default TeamFilter;
