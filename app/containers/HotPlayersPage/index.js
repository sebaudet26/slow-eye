import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '../../utils/injectReducer';
import { makeSelectHotPlayers } from './selectors';
import { makeSelectFeatures } from '../App/selectors';
import { fetchPlayersStreaks } from './actions';
import reducer from './reducer';

import HotPlayers from './HotPlayers';

const mapDispatchToProps = dispatch => ({
  fetchHotPlayers: () => dispatch(fetchPlayersStreaks()),
});

const mapStateToProps = createStructuredSelector({
  features: makeSelectFeatures(),
  hotPlayers: makeSelectHotPlayers(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });

export default compose(withReducer, withConnect)(HotPlayers);
export { mapDispatchToProps };
