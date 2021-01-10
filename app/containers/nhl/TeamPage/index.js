import React from 'react';
import PropTypes from 'prop-types';
import {
  isEmpty, sortBy, pipe, filter, map, prop, reverse,
} from 'ramda';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import { Query } from 'react-apollo';
import { getTeamQuery } from './query.js';
import Header from '../../../components/Header';
import Helmet from '../../../components/Helmet';
import Footer from '../../../components/Footer';
import Dropdown from '../../../components/Dropdown/Dropdown';
import PlayerCard from '../../../components/PlayerCard/PlayerCard';
import RosterTable from '../../../components/Table/RosterTable';
import LoadingIndicator from '../../../components/LoadingIndicator';
import EmptyState from '../../../components/EmptyState';
import { toOrdinal } from '../../../utils/misc';

import {
  saveToLS,
  getFromLS,
} from '../../../utils/localStorage';
import './style.scss';

const urlParams = new URLSearchParams(window.location.search);
const id = Number(urlParams.get('id'));

const renderTeamStat = (label, stat) => (
  <div className="team-stats-item">
    <div className="light small-text">{label}</div>
    <div className="bold">{stat}</div>
  </div>
);

class TeamPage extends React.Component {
  renderChartCol(roster) {
    const sortedRoster = pipe(
      sortBy(prop('pointsInLatestSeason')),
      reverse,
    )(roster);
    return sortedRoster.map(player => (
      <PlayerCard key={player.id} player={player} />
    ));
  }

  render() {
    return (
      <div>
        <Header selectedLeague="NHL" />
        <Query query={getTeamQuery} variables={{ id }}>
          {({ loading, error, data }) => {
            if (loading) return (<LoadingIndicator />);
            if (error) return (<EmptyState isError />);

            const team = data.nhl.team;
            const roster = team.roster;

            return (
              <div className="team-page">
                <Helmet titlePrefix={team.name} contentPrefix={`${team.name} roster and stats.`}/>
                <div className="page-header wTabs">
                  <div className="container">
                    <div className="team-wrapper">
                      <div className="team-wrapper-title">
                        <div className="team-img">
                          <svg viewBox="10 0 100 75" width="100" height="75" className="team-img-logo">
                            <use xlinkHref={`/public/images/teams/season/20182019.svg#team-${team.id}-20182019-light`} />
                          </svg>
                        </div>
                        <div>
                          <Dropdown name={team.name} />
                          {/* <p>
                            <span>
                              {`${toOrdinal(team.division)} Division, `}
                              {`${toOrdinal(team.conference)} Conference, `}
                              {`${toOrdinal(team.league)} League`}
                            </span>
                          </p> */}
                        </div>
                      </div>
                      <div className="team-info">
                        <div className="team-stats">
                          {renderTeamStat('GP', team.gamesPlayed)}
                          {renderTeamStat('W', team.wins)}
                          {renderTeamStat('L', team.losses)}
                          {renderTeamStat('OTL', team.ot)}
                          {renderTeamStat('Pts', team.pts)}
                        </div>
                        <div className="team-stats">
                          {renderTeamStat('GF', Math.round(Number(team.gamesPlayed) * Number(team.goalsForPerGame)))}
                          {renderTeamStat('GA', Math.round(Number(team.gamesPlayed) * Number(team.goalsAgainstPerGame)))}
                          {renderTeamStat('PP%', team.powerPlayPercentage)}
                          {renderTeamStat('PK%', team.penaltyKillPercentage)}
                        </div>
                      </div>
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
                    </div>
                  </TabList>
                  <div className="container">
                    <TabPanel>
                      <div className="depth-chart">
                        <h3>Forwards</h3>
                        <div className="team-chart">
                          <div className="team-chart-col">
                            <div className="team-chart-col-title">Left Wing</div>
                            {this.renderChartCol(roster.filter(p => p.position.code === 'LW'))}
                          </div>
                          <div className="team-chart-col">
                            <div className="team-chart-col-title">Center</div>
                            {this.renderChartCol(roster.filter(p => p.position.code === 'C'))}
                          </div>
                          <div className="team-chart-col">
                            <div className="team-chart-col-title">Right Wing</div>
                            {this.renderChartCol(roster.filter(p => p.position.code === 'RW'))}
                          </div>
                        </div>
                      </div>
                      <h3>Defensemen</h3>
                      <div className="team-chart">
                        <div className="team-chart-col">
                          <div className="team-chart-col-title">LD</div>
                          {
                            this.renderChartCol(roster.filter(p => (
                              p.position.isDefenseman &&
                              p.bio.shootsCatches === 'L'
                            )))
                          }
                        </div>
                        <div className="team-chart-col">
                          <div className="team-chart-col-title">RD</div>
                          {
                            this.renderChartCol(roster.filter(p => (
                              p.position.isDefenseman &&
                              p.bio.shootsCatches === 'R'
                            )))
                          }
                        </div>
                        <div className="team-chart-col" />
                      </div>
                      <h3>Goalies</h3>
                      <div className="team-chart">
                        <div className="team-chart-col">
                          {this.renderChartCol(roster.filter(p => p.position.isGoalie))}
                        </div>
                        <div className="team-chart-col" />
                        <div className="team-chart-col" />
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <div>
                        <h3>Forwards</h3>
                        <RosterTable players={roster.filter(p => p.position.isForward)} />
                        <h3>Defensemen</h3>
                        <RosterTable players={roster.filter(p => p.position.isDefenseman)} />
                        <h3>Goalies</h3>
                        <RosterTable players={roster.filter(p => p.position.isGoalie)} />
                      </div>
                    </TabPanel>
                  </div>
                </Tabs>
              </div>
            );
          }}
        </Query>
        <Footer />
      </div>
    );
  }
}

export default TeamPage;
