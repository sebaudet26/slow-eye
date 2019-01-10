import React from 'react';
import { Helmet } from 'react-helmet';
import { isEmpty } from 'ramda';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import './style.scss';

const urlParams = new URLSearchParams(window.location.search);

export default class TeamPage extends React.Component {
  componentDidMount() {
    const { fetchTeamById } = this.props;
    fetchTeamById((urlParams.get('id')));
  }

  render() {
    const team = this.props.teams[urlParams.get('id')] || {};
    console.log('team', team);
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
          <div className="team-info">
            <div className="team-stats">
              <div className="team-stats-item">
                <div className="light small-text">GP</div>
                <div className="bold">{team.stats.splits[0].gamesPlayed}</div>
              </div>
              <div className="team-stats-item">
                <div className="light small-text">W</div>
                <div className="bold">{team.stats.splits[0].wins}</div>
              </div>
              <div className="team-stats-item">
                <div className="light small-text">L</div>
                <div className="bold">{team.stats.splits[0].losses}</div>
              </div>
              <div className="team-stats-item">
                <div className="light small-text">OTL</div>
                <div className="bold">{team.stats.splits[0].ot}</div>
              </div>
              <div className="team-stats-item">
                <div className="light small-text">Pts</div>
                <div className="bold">{team.stats.splits[0].pts}</div>
              </div>
            </div>
            <div className="team-stats">
              <div className="team-stats-item">
                <div className="light small-text">GF</div>
                <div className="bold">{Math.round(Number(team.stats.splits[0].gamesPlayed) * Number(team.stats.splits[0].goalsPerGame))}</div>
              </div>
              <div className="team-stats-item">
                <div className="light small-text">GA</div>
                <div className="bold">{Math.round(Number(team.stats.splits[0].gamesPlayed) * Number(team.stats.splits[0].goalsAgainstPerGame))}</div>
              </div>
              <div className="team-stats-item">
                <div className="light small-text">PP%</div>
                <div className="bold">{team.stats.splits[0].powerPlayPercentage}</div>
              </div>
              <div className="team-stats-item">
                <div className="light small-text">PK%</div>
                <div className="bold">{team.stats.splits[0].penaltyKillPercentage}</div>
              </div>
              <div className="team-stats-item">
                <div className="light small-text">EVGGAR</div>
                <div className="bold">{Number(team.stats.splits[0].evGGARatio).toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div className="team-info">
            <div className="team-stats">
              <div className="team-stats-item hidden">
                <div className="bold">00</div>
              </div>
              <div className="team-stats-item">
                <div className="bold">{team.stats.splits[1].wins}</div>
              </div>
              <div className="team-stats-item">
                <div className="bold">{team.stats.splits[1].losses}</div>
              </div>
              <div className="team-stats-item">
                <div className="bold">{team.stats.splits[1].ot}</div>
              </div>
              <div className="team-stats-item">
                <div className="bold">{team.stats.splits[1].pts}</div>
              </div>
            </div>
            <div className="team-stats">
              <div className="team-stats-item">
                <div className="bold">{team.stats.splits[1].goalsPerGame}</div>
              </div>
              <div className="team-stats-item">
                <div className="bold">{team.stats.splits[1].goalsAgainstPerGame}</div>
              </div>
              <div className="team-stats-item">
                <div className="bold">{team.stats.splits[1].powerPlayPercentage}</div>
              </div>
              <div className="team-stats-item">
                <div className="bold">{team.stats.splits[1].penaltyKillPercentage}</div>
              </div>
              <div className="team-stats-item">
                <div className="bold">{team.stats.splits[1].evGGARatio}</div>
              </div>
            </div>
          </div>
        </div>
        <h3>Forwards</h3>
        <div className="team-chart">
          <div className="team-chart-col">
            <div className="team-chart-col-title">Left Wing</div>
            <PlayerCard />
          </div>
          <div className="team-chart-col">
            <div className="team-chart-col-title">Center</div>
            <PlayerCard />
          </div>
          <div className="team-chart-col">
            <div className="team-chart-col-title">Right Wing</div>
            <PlayerCard />
          </div>
        </div>
        <h3>Defensemen</h3>
        <div className="team-chart">
          <div className="team-chart-col">
            <div className="team-chart-col-title">Left D</div>
            <PlayerCard />
          </div>
          <div className="team-chart-col">
            <div className="team-chart-col-title">Right D</div>
            <PlayerCard />
          </div>
          <div className="team-chart-col" />
        </div>
        <h3>Goalies</h3>
        <div className="team-chart">
          <div className="team-chart-col">
            <PlayerCard />
          </div>
        </div>
      </div>
    ));
  }
}
