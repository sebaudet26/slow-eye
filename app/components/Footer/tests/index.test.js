import React from 'react';
import { shallow } from 'enzyme';

import Footer from '../index';

describe('<Footer />', () => {
  it('should render the credits', () => {
    const renderedComponent = shallow(<Footer />);
    expect(renderedComponent.text()).toContain('Seb and Alex');
  });
});
