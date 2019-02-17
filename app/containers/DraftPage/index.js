import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '../../utils/injectReducer';
import { makeSelectDrafts, makeSelectLoading } from './selectors';
import { fetchDraftForYear, setLoading } from './actions';
import reducer from './reducer';
import DraftPage from './DraftPage';

const mapDispatchToProps = dispatch => ({
  fetchDraft: year => dispatch(fetchDraftForYear(year)),
  setLoading: () => dispatch(setLoading()),
});

const mapStateToProps = createStructuredSelector({
  drafts: makeSelectDrafts(),
  loading: makeSelectLoading(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });

export default compose(withReducer, withConnect)(DraftPage);
export { mapDispatchToProps };
