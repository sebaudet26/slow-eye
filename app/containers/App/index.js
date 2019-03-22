import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from '../../utils/injectReducer';
import { fetchFeatureFlags } from './actions';
import reducer from './reducer';
import App from './App';

const mapDispatchToProps = dispatch => ({
  fetchFeatureFlags: () => dispatch(fetchFeatureFlags()),
});

const mapStateToProps = createStructuredSelector({
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });

export default compose(withReducer, withConnect)(App);
export { mapDispatchToProps };
