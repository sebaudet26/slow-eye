import React from 'react';
import { Helmet } from 'react-helmet';
import './style.scss';

export default class PlayerPage extends React.Component {
  // eslint-disable-line react/prefer-stateless-function

  // Since state and props are static,
  // there's no need to re-render this component
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Mikko Rantanen</title>
          <meta
            name="description"
            content="Mikko Rantanen"
          />
        </Helmet>
        <h1>Mikko Rantanen</h1>
      </div>
    );
  }
}
