import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '../../utils/injectReducer';
import { fetchTodaysGames } from './actions';
import { makeSelectGames } from './selectors';
import reducer from './reducer';

import ScorePage from './ScorePage';

const mapDispatchToProps = dispatch => ({
  fetchTodaysGames: () => dispatch(fetchTodaysGames()),
});

const mapStateToProps = createStructuredSelector({
  games: makeSelectGames(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });

export default compose(withReducer, withConnect)(ScorePage);
export { mapDispatchToProps };
