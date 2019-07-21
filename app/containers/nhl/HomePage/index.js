import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { take } from 'ramda';
import { graphql } from 'react-apollo';
import { getStreaksQuery } from './query.js';
import Header from '../../../components/Header';
import './style.scss';

class HomePage extends React.Component {
  componentWillMount() {
    document.body.classList.add('home');
  }

  componentWillUnmount() {
    document.body.classList.remove('home');
  }

  displayFeaturedPlayer() {
    const data = this.props.data;
    if (data.loading) {
      //
    } else {
      return (
        <div className="home-header" style={{ backgroundImage: `url("https://nhl.bamcontent.com/images/actionshots/${data.playerStreaks[0].id}@2x.jpg")` }}>
          <div className="container">
            <h1>The best place to view the NHL's latest scores and stats.</h1>
            <div className="home-header-featured">
              <div>This Week's Featured Player</div>
              <a href="/player?id=8474565" className="home-header-featured-name">{data.playerStreaks[0].name}</a>
            </div>
          </div>
        </div>
      );
    }
  }

  displayPlayerStreaks() {
    const data = this.props.data;
    if (data.loading) {
      // Put Skeleton Loader Here
    } else {
      return data.playerStreaks.map(player => (
        <a key={player.id} href={`/player?id=${player.id}`} className="card card-player" style={{ backgroundImage: `url("https://nhl.bamcontent.com/images/actionshots/${player.id}_low_resolution.jpg")` }}>
          <div className="card-content">
            <div className="card-content-name">
              {player.name.split(' ')[0]}
              <span>{player.name.split(' ')[1]}</span>
            </div>
            <div className="card-content-result">
              <div className="card-content-result-item">
                <div>Last 5 games</div>
                <div>
                  <span>
                    {`${player.points} PTS `}
                  </span>
                  {`(${player.goals}G ${player.assists}A)`}
                </div>
              </div>
            </div>
          </div>
        </a>
      ));
    }
  }

  displayTeamStreaks() {
    const data = this.props.data.teamsStreaks;
    if (data === undefined) {
      // Put Skeleton Loader Here
    } else {
      return data.map((team, k) => (
        <a key={team.id} href={`/team?id=${team.id}`} className="card card-team">
          <div className="card-content">
            <div className="card-content-rank">
              {k + 1}
            </div>
            <div className="card-content-team">
              <svg>
                <use xlinkHref={`/public/images/teams/season/20182019.svg#team-${team.id}-20182019-light`} />
              </svg>
              <span>{team.teamName}</span>
            </div>
            <div className="card-content-result">
              <div className="card-content-result-item">
                <div>{`Last ${team.games} games`}</div>
                <div>
                  <span>{`${team.points} PTS `}</span>
                  {`(${team.wins}-${team.losses}-${team.ot})`}
                </div>
              </div>
            </div>
          </div>
        </a>
      ));
    }
  }

  render() {
    return (
      <div>
        <div className="home-page">
          {this.displayFeaturedPlayer()}
          <div className="container">
            <Helmet>
              <title>Home - SealStats.com</title>
              <meta
                name="description"
                content="Seal Stats is the best place to view NHL stats. User-friendly and fast."
              />
            </Helmet>
            <div className="home-page-wrapper">
              <div className="home-page-col">
                <h3>
                  {' Hot Players'}
                </h3>
                { this.displayPlayerStreaks() }
              </div>
              <div className="home-page-col">
                <h3>
                  {' Hot Teams'}
                </h3>
                <div className="power-container">
                  { this.displayTeamStreaks() }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default graphql(getStreaksQuery)(HomePage);
