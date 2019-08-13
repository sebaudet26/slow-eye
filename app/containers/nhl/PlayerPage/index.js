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
const id = Number(urlParams.get('id'));

export default class PlayerPage extends React.Component {
  render() {
    return (
      <div>
        <Header selectedLeague="NHL" />
        <Query query={getPlayerQuery} variables={{ id }}>
          {({ loading, error, data }) => {
            if (loading) return (<LoadingIndicator />);
            if (error) return (<EmptyState isError />);

            const player = data.player;

            const {
              careerStats = [], careerPlayoffStats = [], info = {}, logs = [], isActive,
            } = player;
            const {
              primaryPosition = {},
              currentTeamInfo = {},
              draftInfo = {},
              shootsCatches,
              nationality,
            } = info;

            const isPro = player.hasNHLExperience;
            const internationalLeagueNames = ['WJC-A', 'WC-A', 'Olympics'];
            const proStats = reject(stat => contains(stat.league.name, internationalLeagueNames))(careerStats);
            const internationalStats = filter(stat => contains(stat.league.name, internationalLeagueNames))(careerStats);

            return (
              <div className="player-page">
                <Helmet
                  titlePrefix={`${info.firstName} ${info.lastName}`}
                  contentPrefix={`${info.firstName} ${info.lastName} stats.`}
                />
                <div className="page-header wTabs">
                  <div className="container">
                    <div className="player-wrapper">
                      <div className="player-img">
                        <PlayerImage id={urlParams.get('id')} />
                        <div className="icon-wrapper player-img-country">
                          <img src={`/public/images/country/${nationality}.svg`} />
                        </div>
                        {currentTeamInfo && (
                         <div className="icon-wrapper player-img-team">
                           <img src={`/public/images/teams/${currentTeamInfo.teamName.replace(' ', '-').toLowerCase()}.png`} className="" />
                         </div>
                        )}
                      </div>
                      <div className="player-info">
                        <h2>{`${info.firstName} ${info.lastName}`}</h2>
                        <p>
                          {currentTeamInfo && <a href={`/team?id=${currentTeamInfo.id}`}>{`${currentTeamInfo.name}, `}</a>}
                          {`${primaryPosition.abbreviation}, Shoots ${shootsCatches}`}
                        </p>
                        <div className="player-desc">
                          <Bio playerInfo={info} />
                          <DraftInfo draftInfo={draftInfo} />
                        </div>
                        {isPro && <CareerSummary player={player}/>}
                      </div>
                    </div>
                  </div>
                </div>
                {
                  <Statistics
                    internationalStats={internationalStats}
                    careerPlayoffStats={careerPlayoffStats}
                    proStats={proStats}
                    logs={logs}
                    isPro={isPro}
                    info={info}
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
