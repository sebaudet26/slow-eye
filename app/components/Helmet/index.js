import React from 'react';
import { Helmet } from 'react-helmet';

const title = 'SealStats.com';
const content = "Seal Stats is the best place to view NHL stats. User-friendly and fast.";

class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Helmet>
        <title>{`${this.props.titlePrefix} ${title}`}</title>
        <meta
          name="description"
          content={`${this.props.contentPrefix} ${content}`}
        />
      </Helmet>
    );
  }
}

export default Header;
