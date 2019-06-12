import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '../../../utils/injectReducer';
import { makeSelectTeamsStreaks } from './selectors';
import { fetchTeamsStreaks } from './actions';
import reducer from './reducer';

import PowerRankingsPage from './PowerRankingsPage';

const mapDispatchToProps = dispatch => ({
  fetchTeamsStreaks: () => dispatch(fetchTeamsStreaks()),
});

const mapStateToProps = createStructuredSelector({
  teamsStreaks: makeSelectTeamsStreaks(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });

export default compose(withReducer, withConnect)(PowerRankingsPage);
export { mapDispatchToProps };
