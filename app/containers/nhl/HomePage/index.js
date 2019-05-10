import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '../../../utils/injectReducer';
import { makeSelectPlayersStreaks, makeSelectTeamsStreaks } from './selectors';
import { fetchPlayersStreaks, fetchTeamsStreaks } from './actions';
import reducer from './reducer';

import HomePage from './HomePage';

const mapDispatchToProps = dispatch => ({
  fetchPlayersStreaks: () => dispatch(fetchPlayersStreaks()),
  fetchTeamsStreaks: () => dispatch(fetchTeamsStreaks()),
});

const mapStateToProps = createStructuredSelector({
  playersStreaks: makeSelectPlayersStreaks(),
  teamsStreaks: makeSelectTeamsStreaks(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });

export default compose(withReducer, withConnect)(HomePage);
export { mapDispatchToProps };
