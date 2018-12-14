import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '../../utils/injectReducer';
import { makeSelectPlayers } from './selectors';
import { fetchPlayers } from './actions';
import reducer from './reducer';
import HomePage from './HomePage';

const mapDispatchToProps = dispatch => ({
  fetchPlayers: () => dispatch(fetchPlayers()),
});

const mapStateToProps = createStructuredSelector({
  players: makeSelectPlayers(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });

export default compose(withReducer, withConnect)(HomePage);
export { mapDispatchToProps };
