import React from 'react';
import PropTypes from 'prop-types';
import { reject, filter, contains } from 'ramda';
import { Query } from 'react-apollo';
import { getPlayerQuery } from './query.js';
import Header from '../../../components/Header';
import Helmet from '../../../components/Helmet';
import Footer from '../../../components/Footer';
import LoadingIndicator from '../../../components/LoadingIndicator';
import EmptyState from '../../../components/EmptyState';
import PlayerImage from '../../../components/PlayerImage';
import CareerSummary from './CareerSummary';
import Statistics from './Statistics';
import DraftInfo from './DraftInfo';
import Bio from './Bio';
import './style.scss';

const urlParams = new URLSearchParams(window.location.search);
const internationalLeagueNames = ['WJC-A', 'WC-A', 'Olympics']

export default class PlayerPage extends React.Component {
  render() {
    console.warn(Number(urlParams.get('id')))
    return (
      <div>
        <Header selectedLeague="NHL" />
        <Query query={getPlayerQuery} variables={{ id: Number(urlParams.get('id')) }}>
          {({ loading, error, data }) => {
            if (loading) return (<LoadingIndicator />)
            if (error) return (<EmptyState isError />)

            const { player } = data.nhl

            const {
              id,
              team,
              teamName = '',
              bio,
              status,
              position,
              streak,
              draft,
              career,
              gameLogs,
            }  = player

            const proStats = reject(stat => contains(stat.leagueName, internationalLeagueNames))(career.seasons)
            const internationalStats = filter(stat => contains(stat.leagueName, internationalLeagueNames))(career.seasons)
            const isPro = true
            console.warn(`/public/images/teams/${team.name.replace(' ', '-').toLowerCase()}.png`)
            return (
              <div className="player-page">
                <Helmet
                  titlePrefix={`${bio.firstName} ${bio.lastName}`}
                  contentPrefix={`${bio.firstName} ${bio.lastName} stats.`}
                />
                <div className="page-header wTabs">
                  <div className="container">
                    <div className="player-wrapper">
                      <div className="player-img">
                        <PlayerImage id={urlParams.get('id')} />
                        <div className="icon-wrapper player-img-country">
                          <img src={`/public/images/country/${bio.birthCountry}.svg`} />
                        </div>
                        <div className="icon-wrapper player-img-team">
                          <img src={`/public/images/teams/${team.name.replace(' ', '-').toLowerCase()}.png`} className="" />
                        </div>
                      </div>
                      <div className="player-info">
                        <h2>{`${bio.firstName} ${bio.lastName}`}</h2>
                        <p>
                          <a href={`/team?id=${team.id}`}>{`${team.name}, `}</a>
                          {`${position.code}, Shoots ${bio.shootsCatches}`}
                        </p>
                        <div className="player-desc">
                          <Bio bio={bio} />
                          <DraftInfo draft={draft} />
                        </div>
                        {isPro && <CareerSummary player={player}/>}
                      </div>
                    </div>
                  </div>
                </div>
                {
                  <Statistics
                    proStats={proStats}
                    playoffStats={career.playoffs}
                    internationalStats={internationalStats}
                    logs={gameLogs}
                    isPro={isPro}
                    position={position}
                  />
                }
              </div>
            );
          }}
        </Query>
        <Footer />
      </div>
    );
  }
}
