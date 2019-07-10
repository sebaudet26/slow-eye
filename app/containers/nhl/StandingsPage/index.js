import React from 'react';
import { Helmet } from 'react-helmet';
import { Query } from 'react-apollo';
import { getStandingsQuery } from './query.js';
import LoadingIndicator from '../../../components/LoadingIndicator';
import StandingsTable from '../../../components/Table/StandingsTable';
import './style.scss';

class StandingsPage extends React.Component {
  render() {
    return (
      <div className="standings-page">
        <div className="page-header">
          <div className="container">
            <h2>Standings</h2>
          </div>
        </div>
        <div className="container">
          <Helmet>
            <title>NHL Standings - SealStats.com</title>
            <meta
              name="description"
              content="View NHL Standings. Seal Stats is the best place to view NHL stats. User-friendly and fast."
            />
          </Helmet>
          <Query query={getStandingsQuery}>
            {({ loading, error, data }) => {
              if (loading) return (<LoadingIndicator />);
              if (error) return (<div>Error</div>);

              console.log(data);

              const standings = data.standings;

              return (
                <StandingsTable standings={standings} />
              );
            }}
          </Query>
        </div>
      </div>
    );
  }
}

export default StandingsPage;
