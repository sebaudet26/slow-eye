import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import {
  isEmpty, sortBy, pipe, filter, map, prop, reverse,
} from 'ramda';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import RosterTable from '../../components/Table/RosterTable';
import './style.scss';

const urlParams = new URLSearchParams(window.location.search);

const pointsInLatestSeason = player => (
  player.stats.length
    ? player.stats[player.stats.length - 1].stat.points
    : 0
);
const gamesPlayedLatestSeason = player => (
  player.stats.length
    ? player.stats[player.stats.length - 1].stat.games
    : 0
);
const positionIs = pos => player => (
  player.stats.length
    ? player.info.primaryPosition.abbreviation === pos
    : 0
);
const shootingSideIs = side => player => (
  player.stats.length
    ? player.info.shootsCatches === side
    : 0
);
const renderPlayerCard = player => <PlayerCard key={player.id} player={player} />;

const renderTeamStat = (label, stat) => (
  <div className="team-stats-item">
    <div className="light small-text">{label}</div>
    <div className="bold">{stat}</div>
  </div>
);

export default class TeamPage extends React.Component {
  constructor() {
    super();
    this.onTabSelect = this.onTabSelect.bind(this);
    this.state = {
      tabIndex: Number(window.localStorage.getItem('teamTab') || 0),
    };
  }

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

  onTabSelect(tabIndex) {
    window.localStorage.setItem('teamTab', tabIndex);
    this.setState({ tabIndex });
  }

  render() {
    const { teams, rosters } = this.props;
    const team = teams[urlParams.get('id')] || {};
    const roster = rosters[urlParams.get('id')] || {};
    console.log('team', team);
    console.log('roster', roster);
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
              <img
                src={`../../images/teams/${team.teamName.replace(' ', '-').toLowerCase()}.png`}
                className="team-img-logo"
              />
            </div>
            <div>
              <h2>{team.name}</h2>
              <p>8th Eastern Conference, 4th Atlantic</p>
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
                {renderTeamStat('EVGGAR', Number(team.stats.splits[0].evGGARatio).toFixed(2))}
              </div>
            </div>
          )}
        </div>
        <Tabs selectedIndex={this.state.tabIndex} onSelect={this.onTabSelect}>
          <TabList>
            <Tab>Depth Chart</Tab>
            <Tab>Roster</Tab>
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
            <h3>Roster</h3>
            {
            isEmpty(roster) ? null : (
              <RosterTable players={roster} />
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
  roster: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchTeamById: PropTypes.func.isRequired,
  fetchTeamRosterDetails: PropTypes.func.isRequired,
};
