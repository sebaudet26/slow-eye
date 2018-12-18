import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '../../utils/injectReducer';
import { makeSelectPlayer } from './selectors';
import { fetchPlayer } from './actions';
import reducer from './reducer';
import PlayerPage from './PlayerPage';

const mapDispatchToProps = dispatch => ({
  fetchPlayer: id => dispatch(fetchPlayer(id)),
});

const mapStateToProps = createStructuredSelector({
  player: makeSelectPlayer(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });

export default compose(withReducer, withConnect)(PlayerPage);
export { mapDispatchToProps };
