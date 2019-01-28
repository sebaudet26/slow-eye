import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import {
  isEmpty, sortBy, pipe, filter, map, prop, reverse,
} from 'ramda';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import Dropdown from '../../components/Dropdown/Dropdown';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import RosterTable from '../../components/Table/RosterTable';
import RosterStatsTable from '../../components/Table/RosterStatsTable';
import { logoForTeamName } from '../../utils/team';
import {
  pointsInLatestSeason,
  gamesPlayedLatestSeason,
  positionIs,
  shootingSideIs,
  forwardsAbbreviations,
} from '../../utils/player';
import {
  saveToLS,
  getFromLS,
} from '../../utils/localStorage';
import './style.scss';

const getNumberWithOrdinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const urlParams = new URLSearchParams(window.location.search);

const renderPlayerCard = player => <PlayerCard key={player.id} player={player} />;

const renderTeamStat = (label, stat) => (
  <div className="team-stats-item">
    <div className="light small-text">{label}</div>
    <div className="bold">{stat}</div>
  </div>
);

export default class TeamPage extends React.Component {
  componentDidMount() {
    const { fetchTeamById } = this.props;
    fetchTeamById((urlParams.get('id')));
  }

  componentDidUpdate() {
    const { teams, rosters } = this.props;
    if (
      teams[urlParams.get('id')]
      && teams[urlParams.get('id')].roster
      && !rosters[urlParams.get('id')]
    ) {
      const { fetchTeamRosterDetails } = this.props;
      fetchTeamRosterDetails(urlParams.get('id'), teams[urlParams.get('id')].roster);
    }
  }

  render() {
    const { teams, rosters } = this.props;
    const team = teams[urlParams.get('id')] || {};
    const roster = rosters[urlParams.get('id')] || {};
    return (isEmpty(team) ? null : (
      <div className="team-page">
        <Helmet>
          <title>{team.name}</title>
          <meta
            name="description"
            content={team.name}
          />
        </Helmet>
        <div className="team-header">
          <div className="team-header-title">
            <div className="team-img">
              <svg viewBox="10 0 100 75" width="100" height="75" className="team-img-logo">
                <use xlinkHref={`/images/teams/season/20182019.svg#team-${team.id}-20182019-light`} />
              </svg>
            </div>
            <div>
              <Dropdown name={team.name} />
              <p>
                <span>
                  {`${getNumberWithOrdinal(team.ranking.division)} Division, `}
                  {`${getNumberWithOrdinal(team.ranking.conference)} Conference, `}
                  {`${getNumberWithOrdinal(team.ranking.league)} League`}
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
        <Tabs
          defaultIndex={Number(getFromLS('teamTabIndex')) || 0}
          onSelect={i => saveToLS('teamTabIndex', i)}
        >
          <TabList>
            <Tab>Depth Chart</Tab>
            <Tab>Roster</Tab>
            <Tab>Player Stats</Tab>
          </TabList>
          <TabPanel>
            {
          isEmpty(roster) ? null : (
            <div className="depth-chart">
              <h3>Forwards</h3>
              <div className="team-chart">
                <div className="team-chart-col">
                  <div className="team-chart-col-title">Left Wing</div>
                  {
                    pipe(
                      map(prop('player')),
                      sortBy(pointsInLatestSeason),
                      reverse,
                      filter(positionIs('LW')),
                      map(renderPlayerCard),
                    )(roster)
                  }
                </div>
                <div className="team-chart-col">
                  <div className="team-chart-col-title">Center</div>
                  {
                    pipe(
                      map(prop('player')),
                      sortBy(pointsInLatestSeason),
                      reverse,
                      filter(positionIs('C')),
                      map(renderPlayerCard),
                    )(roster)
                  }
                </div>
                <div className="team-chart-col">
                  <div className="team-chart-col-title">Right Wing</div>
                  {
                    pipe(
                      map(prop('player')),
                      sortBy(pointsInLatestSeason),
                      reverse,
                      filter(positionIs('RW')),
                      map(renderPlayerCard),
                    )(roster)
                  }
                </div>
              </div>
              <h3>Defensemen</h3>
              <div className="team-chart">
                <div className="team-chart-col">
                  <div className="team-chart-col-title">Left D</div>
                  {
                    pipe(
                      map(prop('player')),
                      sortBy(pointsInLatestSeason),
                      reverse,
                      filter(positionIs('D')),
                      filter(shootingSideIs('L')),
                      map(renderPlayerCard),
                    )(roster)
                  }
                </div>
                <div className="team-chart-col">
                  <div className="team-chart-col-title">Right D</div>
                  {
                    pipe(
                      map(prop('player')),
                      sortBy(pointsInLatestSeason),
                      reverse,
                      filter(positionIs('D')),
                      filter(shootingSideIs('R')),
                      map(renderPlayerCard),
                    )(roster)
                  }
                </div>
                <div className="team-chart-col" />
              </div>
              <h3>Goalies</h3>
              <div className="team-chart">
                <div className="team-chart-col">
                  {
                    pipe(
                      map(prop('player')),
                      sortBy(gamesPlayedLatestSeason),
                      reverse,
                      filter(positionIs('G')),
                      map(renderPlayerCard),
                    )(roster)
                  }
                </div>
              </div>
            </div>
          )
          }
          </TabPanel>
          <TabPanel>
            {
            isEmpty(roster) ? null : (
              <div>
                <h3>Forwards</h3>
                <RosterTable players={roster.filter(p => forwardsAbbreviations.includes(p.player.info.primaryPosition.abbreviation))} />
                <h3>Defensemen</h3>
                <RosterTable players={roster.filter(p => p.player.info.primaryPosition.abbreviation === 'D')} />
                <h3>Goalies</h3>
                <RosterTable players={roster.filter(p => p.player.info.primaryPosition.abbreviation === 'G')} />
              </div>
            )
            }
          </TabPanel>
          <TabPanel>
            {
            isEmpty(roster) ? null : (
              <div>
                <h3>Forwards</h3>
                <RosterStatsTable players={roster.filter(p => forwardsAbbreviations.includes(p.player.info.primaryPosition.abbreviation))} position="F" />
                <h3>Defensemen</h3>
                <RosterStatsTable players={roster.filter(p => p.player.info.primaryPosition.abbreviation === 'D')} position="D" />
                <h3>Goalies</h3>
                <RosterStatsTable players={roster.filter(p => p.player.info.primaryPosition.abbreviation === 'G')} position="G" />
              </div>
            )
            }
          </TabPanel>
        </Tabs>
      </div>
    ));
  }
}

TeamPage.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  rosters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchTeamById: PropTypes.func.isRequired,
  fetchTeamRosterDetails: PropTypes.func.isRequired,
};
