import React from 'react';
import { shallow } from 'enzyme';

import PlayerCard from '../index';

describe('<PlayerCard />', () => {
  it('should render a div', () => {
    const renderedComponent = shallow(<Header />);
    expect(renderedComponent.length).toEqual(1);
  });
});
