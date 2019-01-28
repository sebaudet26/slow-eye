import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '../../utils/injectReducer';
import { makeSelectDrafts } from './selectors';
import { fetchDraftForYear } from './actions';
import reducer from './reducer';
import DraftPage from './DraftPage';

const mapDispatchToProps = dispatch => ({
  fetchDraft: year => dispatch(fetchDraftForYear(year)),
});

const mapStateToProps = createStructuredSelector({
  drafts: makeSelectDrafts(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });

export default compose(withReducer, withConnect)(DraftPage);
export { mapDispatchToProps };
