import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import './style.scss';
import AvsImg from '../../images/teams/avalanche.png';
import FlamesImg from '../../images/teams/flames.png';
import BoxTable from '../../components/Table/BoxTable';

export default class GamePage extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Game Page</title>
          <meta name="description" content="Game Page" />
        </Helmet>
        <div className="summary">
          <div className="summary-header">
            <div className="summary-header-team">
              <img src={AvsImg} />
              <div className="summary-header-team-name">
                <div className="city">Colorado</div>
                <div className="team">Avalanche</div>
                <div className="record">(20-16-8 48pts)</div>
              </div>
              <div className="summary-header-team-score">
                3
              </div>
            </div>
            <div className="summary-header-result">
              Final
            </div>
            <div className="summary-header-team">
              <div className="summary-header-team-score">
                5
              </div>
              <div className="summary-header-team-name">
                <div className="city">Calgary</div>
                <div className="team">Flames</div>
                <div className="record">(28-13-4 60pts)</div>
              </div>
              <img src={FlamesImg} />
            </div>
          </div>
          <div className="summary-period">
            <div className="summary-period-card-wrapper">
              <div className="summary-period-card">
                <table className="period-table">
                  <thead>
                    <th><span className="small-uppercase">Goals Per Period</span></th>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>Total</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td><img src={AvsImg} />Colorado Avalanche</td>
                      <td>2</td>
                      <td>0</td>
                      <td>1</td>
                      <td>3</td>
                    </tr>
                    <tr>
                      <td><img src={FlamesImg} />Calgary Flames</td>
                      <td>2</td>
                      <td>1</td>
                      <td>2</td>
                      <td>5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="summary-period-card-wrapper">
              <div className="summary-period-card">
                <table className="period-table">
                  <thead>
                    <th><span className="small-uppercase">Shots Per Period</span></th>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>Total</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td><img src={AvsImg} />Colorado Avalanche</td>
                      <td>11</td>
                      <td>10</td>
                      <td>14</td>
                      <td>35</td>
                    </tr>
                    <tr>
                      <td><img src={FlamesImg} />Calgary Flames</td>
                      <td>5</td>
                      <td>6</td>
                      <td>5</td>
                      <td>16</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <h3>Colorado Avalanche</h3>
          <BoxTable />
          <h3>Calgary Flames</h3>
          <BoxTable />
        </div>
      </div>
    );
  }
}
