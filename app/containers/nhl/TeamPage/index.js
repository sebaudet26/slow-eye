import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import {
  isEmpty, sortBy, pipe, filter, map, prop, reverse,
} from 'ramda';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import { Query } from 'react-apollo';
import { getTeamQuery } from './query.js';
import Dropdown from '../../../components/Dropdown/Dropdown';
import PlayerCard from '../../../components/PlayerCard/PlayerCard';
import RosterTable from '../../../components/Table/RosterTable';
import RosterStatsTable from '../../../components/Table/RosterStatsTable';
import LoadingIndicator from '../../../components/LoadingIndicator';
import {
  pointsInLatestSeason,
  gamesPlayedLatestSeason,
  positionIs,
  shootingSideIs,
  forwardsAbbreviations,
} from '../../../utils/player';
import { toOrdinal } from '../../../utils/misc';
import {
  saveToLS,
  getFromLS,
} from '../../../utils/localStorage';
import './style.scss';

const urlParams = new URLSearchParams(window.location.search);
const id = Number(urlParams.get('id'));

const renderPlayerCard = player => <PlayerCard key={player.id} player={player} />;

const renderTeamStat = (label, stat) => (
  <div className="team-stats-item">
    <div className="light small-text">{label}</div>
    <div className="bold">{stat}</div>
  </div>
);

class TeamPage extends React.Component {
  render() {
    return (
      <Query query={getTeamQuery} variables={{ id }}>
        {({ loading, error, data }) => {
          if (loading) return (<LoadingIndicator />);
          if (error) return (<div>Error</div>);

          const team = data.team;
          const roster = team.roster;

          console.log(team);

          return (
            <div className="team-page">
              <Helmet>
                <title>{`${team.name} - SealStats.com`}</title>
                <meta
                  name="description"
                  content={`${team.name} roster and stats. Seal Stats is the best place to view NHL stats. User-friendly and fast. `}
                />
              </Helmet>
              <div className="page-header wTabs">
                <div className="container">
                  <div className="team-wrapper">
                    <div className="team-wrapper-title">
                      <div className="team-img">
                        <svg viewBox="10 0 100 75" width="100" height="75" className="team-img-logo">
                          <use xlinkHref={`/images/teams/season/20182019.svg#team-${team.id}-20182019-light`} />
                        </svg>
                      </div>
                      <div>
                        <Dropdown name={team.name} />
                        <p>
                          <span>
                            {`${toOrdinal(team.ranking.division)} Division, `}
                            {`${toOrdinal(team.ranking.conference)} Conference, `}
                            {`${toOrdinal(team.ranking.league)} League`}
                          </span>
                        </p>
                      </div>
                    </div>
                    { !team.stats ? null : (
                      <div className="team-info">
                        <div className="team-stats">
                          {renderTeamStat('GP', team.stats.splits[0].gamesPlayed)}
                          {renderTeamStat('W', team.stats.splits[0].wins)}
                          {renderTeamStat('L', team.stats.splits[0].losses)}
                          {renderTeamStat('OTL', team.stats.splits[0].ot)}
                          {renderTeamStat('Pts', team.stats.splits[0].pts)}
                        </div>
                        <div className="team-stats">
                          {renderTeamStat('GF', Math.round(Number(team.stats.splits[0].gamesPlayed) * Number(team.stats.splits[0].goalsPerGame)))}
                          {renderTeamStat('GA', Math.round(Number(team.stats.splits[0].gamesPlayed) * Number(team.stats.splits[0].goalsAgainstPerGame)))}
                          {renderTeamStat('PP%', team.stats.splits[0].powerPlayPercentage)}
                          {renderTeamStat('PK%', team.stats.splits[0].penaltyKillPercentage)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Tabs
                defaultIndex={Number(getFromLS('teamTabIndex')) || 0}
                onSelect={i => saveToLS('teamTabIndex', i)}
              >
                <TabList>
                  <div className="container">
                    <Tab>Depth Chart</Tab>
                    <Tab>Roster</Tab>
                    <Tab>Player Stats</Tab>
                  </div>
                </TabList>
                <div className="container">
                  <TabPanel />
                  <TabPanel>
                    <div>
                      <h3>Forwards</h3>
                      <RosterTable players={roster.filter(p => forwardsAbbreviations.includes(p.info.primaryPosition.abbreviation))} />
                      <h3>Defensemen</h3>
                      <RosterTable players={roster.filter(p => p.info.primaryPosition.abbreviation === 'D')} />
                      <h3>Goalies</h3>
                      <RosterTable players={roster.filter(p => p.info.primaryPosition.abbreviation === 'G')} />
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div>
                      <h3>Forwards</h3>
                      <RosterStatsTable players={roster.filter(p => forwardsAbbreviations.includes(p.info.primaryPosition.abbreviation))} position="F" />
                      <h3>Defensemen</h3>
                      <RosterStatsTable players={roster.filter(p => p.info.primaryPosition.abbreviation === 'D')} position="D" />
                      <h3>Goalies</h3>
                      <RosterStatsTable players={roster.filter(p => p.info.primaryPosition.abbreviation === 'G')} position="G" />
                    </div>
                  </TabPanel>
                </div>
              </Tabs>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default TeamPage;
