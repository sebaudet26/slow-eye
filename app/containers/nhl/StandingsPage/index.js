import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '../../../utils/injectReducer';
import { fetchWildCardStandings } from './actions';
import { makeSelectStandings } from './selectors';
import reducer from './reducer';
import StandingsPage from './StandingsPage';

const mapDispatchToProps = dispatch => ({
  fetchStandings: () => dispatch(fetchWildCardStandings()),
});

const mapStateToProps = createStructuredSelector({
  standings: makeSelectStandings(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });

export default compose(withReducer, withConnect)(StandingsPage);
export { mapDispatchToProps };
