import React from 'react';
import './styles.scss';

class PlayoffBracket extends React.Component {
  render() {
    return (
      <div>
        <h2>2019 NHL Playoffs</h2>
        <div className="bracket">
          <div className="bracket-column">
            <h3>Western Conference</h3>
            <div className="bracket-matchup">
              <div className="bracket-matchup-row">
                <span className="rank">
                1
                </span>
                <span className="name">
                  <a href="/team">
                    <svg key={Math.random()}>
                      <use xlinkHref="/images/teams/season/20182019.svg#team-14-20182019-light" />
                    </svg>
                Lightning
                  </a>
                </span>
                <span className="result result-win">
                7
                </span>
                <span className="result result-win">
                2
                </span>
                <span className="result">
                0
                </span>
                <span className="result result-win">
                4
                </span>
                <span className="result result-win">
                2
                </span>
                <span className="result" />
                <span className="result" />
              </div>
              <div className="bracket-matchup-row">
                <span className="rank">
                8
                </span>
                <span className="name">
                  <a href="/team">
                    <svg key={Math.random()}>
                      <use xlinkHref="/images/teams/season/20182019.svg#team-29-20182019-light" />
                    </svg>
                Blue Jackets
                  </a>
                </span>
                <span className="result">
                3
                </span>
                <span className="result">
                1
                </span>
                <span className="result result-win">
                5
                </span>
                <span className="result">
                1
                </span>
                <span className="result">
                0
                </span>
                <span className="result" />
                <span className="result" />
              </div>
            </div>
            <div className="bracket-matchup">
              <div className="bracket-matchup-row">
                <span className="rank">
                1
                </span>
                <span className="name">
                  <a href="/team">
                    <svg key={Math.random()}>
                      <use xlinkHref="/images/teams/season/20182019.svg#team-14-20182019-light" />
                    </svg>
                Lightning
                  </a>
                </span>
                <span className="result result-win">
                7
                </span>
                <span className="result result-win">
                2
                </span>
                <span className="result">
                0
                </span>
                <span className="result result-win">
                4
                </span>
                <span className="result result-win">
                2
                </span>
                <span className="result" />
                <span className="result" />
              </div>
              <div className="bracket-matchup-row">
                <span className="rank">
                8
                </span>
                <span className="name">
                  <a href="/team">
                    <svg key={Math.random()}>
                      <use xlinkHref="/images/teams/season/20182019.svg#team-29-20182019-light" />
                    </svg>
                Blue Jackets
                  </a>
                </span>
                <span className="result">
                3
                </span>
                <span className="result">
                1
                </span>
                <span className="result result-win">
                5
                </span>
                <span className="result">
                1
                </span>
                <span className="result">
                0
                </span>
                <span className="result" />
                <span className="result" />
              </div>
            </div>
          </div>
          <div className="bracket-column">
            <h3>Eastern Conference</h3>
            <div className="bracket-matchup">
              <div className="bracket-matchup-row">
                <span className="rank">
                  1
                </span>
                <span className="name">
                  <a href="/team">
                    <svg key={Math.random()}>
                      <use xlinkHref="/images/teams/season/20182019.svg#team-14-20182019-light" />
                    </svg>
                  Lightning
                  </a>
                </span>
                <span className="result result-win">
                  7
                </span>
                <span className="result result-win">
                  2
                </span>
                <span className="result">
                  0
                </span>
                <span className="result result-win">
                  4
                </span>
                <span className="result result-win">
                  2
                </span>
                <span className="result" />
                <span className="result" />
              </div>
              <div className="bracket-matchup-row">
                <span className="rank">
                  8
                </span>
                <span className="name">
                  <a href="/team">
                    <svg key={Math.random()}>
                      <use xlinkHref="/images/teams/season/20182019.svg#team-29-20182019-light" />
                    </svg>
                  Blue Jackets
                  </a>
                </span>
                <span className="result">
                  3
                </span>
                <span className="result">
                  1
                </span>
                <span className="result result-win">
                  5
                </span>
                <span className="result">
                  1
                </span>
                <span className="result">
                  0
                </span>
                <span className="result" />
                <span className="result" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PlayoffBracket;
