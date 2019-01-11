import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '../../utils/injectReducer';
import { makeSelectTeamsStats } from './selectors';
import { fetchAllTeams } from './actions';
import reducer from './reducer';
import TeamStatsPage from './TeamStatsPage';

const mapDispatchToProps = dispatch => ({
  fetchAllTeams: () => dispatch(fetchAllTeams()),
});

const mapStateToProps = createStructuredSelector({
  teamsStats: makeSelectTeamsStats(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });

export default compose(withReducer, withConnect)(TeamStatsPage);

export { mapDispatchToProps };
