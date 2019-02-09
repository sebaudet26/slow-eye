import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '../../utils/injectReducer';
import { makeSelectPlayersStreaks } from './selectors';
import { fetchPlayersStreaks } from './actions';
import reducer from './reducer';

import HomePage from './HomePage';

const mapDispatchToProps = dispatch => ({
  fetchPlayersStreaks: () => dispatch(fetchPlayersStreaks()),
});

const mapStateToProps = createStructuredSelector({
  playersStreaks: makeSelectPlayersStreaks(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });

export default compose(withReducer, withConnect)(HomePage);
export { mapDispatchToProps };
