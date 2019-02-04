import React from 'react';
import BaseFilter from './base';

const experience = [
  { value: 'all', label: 'All' },
  { value: 'true', label: 'Rookie' },
  { value: 'false', label: 'Veteran' },
];

const ExperienceFilter = ({ selected, onChange }) => (
  <BaseFilter
    selected={selected}
    onChange={onChange}
    options={experience}
    label="Filter By Experience"
  />
);

export default ExperienceFilter;
