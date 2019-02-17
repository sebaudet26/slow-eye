import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '../../utils/injectReducer';
import { makeSelectPlayers, makeSelectTeams, makeSelectLoading } from './selectors';
import { fetchAllPlayers, fetchAllTeams, setLoading } from './actions';
import reducer from './reducer';
import PlayerStatsPage from './PlayerStatsPage';

const mapDispatchToProps = dispatch => ({
  fetchPlayers: season => dispatch(fetchAllPlayers(season)),
  fetchTeams: season => dispatch(fetchAllTeams(season)),
  setLoading: () => dispatch(setLoading()),
});

const mapStateToProps = createStructuredSelector({
  players: makeSelectPlayers(),
  teams: makeSelectTeams(),
  loading: makeSelectLoading(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });

export default compose(withReducer, withConnect)(PlayerStatsPage);
export { mapDispatchToProps };
