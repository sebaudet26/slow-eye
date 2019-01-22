import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '../../utils/injectReducer';
import { fetchTeamById, fetchTeamRosterDetails } from './actions';
import { makeSelectTeam, makeSelectTeamRoster } from './selectors';
import reducer from './reducer';
import TeamPage from './TeamPage';

const mapDispatchToProps = dispatch => ({
  fetchTeamById: id => dispatch(fetchTeamById(id)),
  fetchTeamRosterDetails: (teamId, roster) => dispatch(fetchTeamRosterDetails(teamId, roster)),
});

const mapStateToProps = createStructuredSelector({
  teams: makeSelectTeam(),
  rosters: makeSelectTeamRoster(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });
// const withStandings = injectReducer({ key: 'home', standingsReducer });

export default compose(
  withReducer,
  // withStandings,
  withConnect,
)(TeamPage);
export { mapDispatchToProps };
