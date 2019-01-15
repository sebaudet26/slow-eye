import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '../../utils/injectReducer';
import { makeSelectBoxscore } from './selectors';
import { fetchGameBoxscore } from './actions';
import reducer from './reducer';
import GamePage from './GamePage';

const mapDispatchToProps = dispatch => ({
  fetchGameBoxscore: id => dispatch(fetchGameBoxscore(id)),
});

const mapStateToProps = createStructuredSelector({
  gameBoxscore: makeSelectBoxscore(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });

export default compose(withReducer, withConnect)(GamePage);
export { mapDispatchToProps };
