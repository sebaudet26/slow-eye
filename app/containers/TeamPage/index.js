import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '../../utils/injectReducer';
import { fetchTeamById } from './actions';
import { makeSelectTeam } from './selectors';
import reducer from './reducer';
import TeamPage from './TeamPage';

const mapDispatchToProps = dispatch => ({
  fetchTeamById: id => dispatch(fetchTeamById(id)),
});

const mapStateToProps = createStructuredSelector({
  teams: makeSelectTeam(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });

export default compose(withReducer, withConnect)(TeamPage);
export { mapDispatchToProps };
