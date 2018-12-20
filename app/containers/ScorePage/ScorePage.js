import React from 'react';
import { Helmet } from 'react-helmet';
import './style.scss';

export default class ScorePage extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="score-page">
        <Helmet>
          <title>Scores</title>
          <meta
            name="description"
            content="Scores"
          />
        </Helmet>
        <h2>Scores</h2>
        <div className="scoreboard">
          <div className="game-card">
            <div className="game-card-header">
              Final
            </div>
            <div className="game-card-team">
              <img src="../../images/teams/small/COL.png" />
              <div className="game-card-team-name">
                Colorado Avalanche
              </div>
              <div className="game-card-team-score">
              <span>1</span>
              </div>
            </div>
            <div className="game-card-team">
              <img src="../../images/teams/small/MTL.png" />
              <div className="game-card-team-name">
                Montreal Canadiens
              </div>
              <div className="game-card-team-score">
              2
              </div>
            </div>
          </div>
          <div className="game-card">
            <div className="game-card-header">
              Live - 20:00 2nd Period
            </div>
            <div className="game-card-team">
              <img src="../../images/teams/small/MIN.png" />
              <div className="game-card-team-name">
                Minnesota Wild
              </div>
              <div className="game-card-team-score">
              <span>7</span>
              </div>
            </div>
            <div className="game-card-team">
              <img src="../../images/teams/small/SJS.png" />
              <div className="game-card-team-name">
                San Jose Sharks
              </div>
              <div className="game-card-team-score">
              4
              </div>
            </div>
          </div>
          <div className="game-card">
            <div className="game-card-header">
              8:30 ET
            </div>
            <div className="game-card-team">
              <img src="../../images/teams/small/BUF.png" />
              <div className="game-card-team-name">
                Buffalo Sabres
              </div>
              <div className="game-card-team-score">
              <span>44 Pts</span>
              </div>
            </div>
            <div className="game-card-team">
              <img src="../../images/teams/small/LAK.png" />
              <div className="game-card-team-name">
                Los Angeles Kings
              </div>
              <div className="game-card-team-score">
                22 Pts
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
