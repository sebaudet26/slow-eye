import 'babel-polyfill';

// Enzyme adapter for React 16

// eslint-disable-next-line
import Enzyme from 'enzyme';
// eslint-disable-next-line
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
