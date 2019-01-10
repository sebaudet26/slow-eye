import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '../../utils/injectReducer';
import { makeSelectPlayers } from './selectors';
import { fetchAllPlayers } from './actions';
import reducer from './reducer';
import PlayerStatsPage from './PlayerStatsPage';

const mapDispatchToProps = dispatch => ({
  fetchPlayers: () => dispatch(fetchAllPlayers()),
});

const mapStateToProps = createStructuredSelector({
  players: makeSelectPlayers(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });

export default compose(withReducer, withConnect)(PlayerStatsPage);
export { mapDispatchToProps };
