import React from 'react';
import { Helmet } from 'react-helmet';
import {
  isEmpty, sortBy, pipe, filter, map, prop, reverse,
} from 'ramda';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import './style.scss';

const urlParams = new URLSearchParams(window.location.search);

const pointsInLatestSeason = player => (player.stats.length ? player.stats[player.stats.length - 1].stat.points : 0);
const gamesPlayedLatestSeason = player => (player.stats.length ? player.stats[player.stats.length - 1].stat.games : 0);
const positionIs = pos => player => (player.stats.length ? player.info.primaryPosition.abbreviation === pos : 0);
const shootingSideIs = side => player => (player.stats.length ? player.info.shootsCatches === side : 0);
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
    if (
      this.props.teams[urlParams.get('id')]
      && this.props.teams[urlParams.get('id')].roster
      && !this.props.rosters[urlParams.get('id')]
    ) {
      const { fetchTeamRosterDetails } = this.props;
      fetchTeamRosterDetails(urlParams.get('id'), this.props.teams[urlParams.get('id')].roster);
    }
  }

  render() {
    const team = this.props.teams[urlParams.get('id')] || {};
    const roster = this.props.rosters[urlParams.get('id')] || {};
    console.log('team', team);
    console.log('roster', roster);
    return (isEmpty(team) ? null : (
      <div className="team-page">
        <Helmet>
          <title />
          <meta
            name="description"
            content={team.name}
          />
        </Helmet>
        <div className="team-header">
          <div className="team-header-title">
            <div className="team-img">
              <img
                src={`../../images/teams/${team.teamName}.png`}
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
        {
          isEmpty(roster) ? null : (
            <div>
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
      </div>
    ));
  }
}
