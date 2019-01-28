import React from 'react';
import seasons from '../../constants/seasons';
import BaseFilter from './base';

const SeasonFilter = ({ selected, onChange }) => (
  <BaseFilter
    selected={selected}
    onChange={onChange}
    options={seasons}
    label="Filter By Season"
  />
);

export default SeasonFilter;
