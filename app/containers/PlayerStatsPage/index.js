import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '../../utils/injectReducer';
import { makeSelectPlayers, makeSelectTeams } from './selectors';
import { fetchAllPlayers, fetchAllTeams } from './actions';
import reducer from './reducer';
import PlayerStatsPage from './PlayerStatsPage';

const mapDispatchToProps = dispatch => ({
  fetchPlayers: season => dispatch(fetchAllPlayers(season)),
  fetchTeams: season => dispatch(fetchAllTeams(season)),
});

const mapStateToProps = createStructuredSelector({
  players: makeSelectPlayers(),
  teams: makeSelectTeams(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });

export default compose(withReducer, withConnect)(PlayerStatsPage);
export { mapDispatchToProps };
