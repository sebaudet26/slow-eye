import React from 'react';
import nationalities from '../../constants/nationalities';
import BaseFilter from './base';

const NationalityFilter = ({ selected, onChange }) => (
  <BaseFilter
    selected={selected}
    onChange={onChange}
    options={nationalities}
    label="Filter By Nationality"
  />
);

export default NationalityFilter;
