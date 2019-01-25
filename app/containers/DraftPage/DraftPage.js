import React from 'react';
import { Helmet } from 'react-helmet';
import DraftTable from '../../components/Table/DraftTable';
import './style.scss';

export default class StandingsPage extends React.Component {
  render() {
    return (
      <div className="draft-page">
        <Helmet>
          <title>Draft</title>
          <meta
            name="description"
            content="Draft"
          />
        </Helmet>
        <h2>Draft</h2>
        <DraftTable />
      </div>
    );
  }
}
