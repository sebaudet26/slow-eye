import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import ScoreCard from '../../components/ScoreCard';
import './style.scss';

const dayLabelFormat = 'ddd MMM D';
const apiDateFormat = 'YYYY-MM-DD';

const daysOptions = [
  { value: moment().subtract(2, 'days').format(apiDateFormat), label: moment().subtract(2, 'days').format(dayLabelFormat) },
  { value: moment().subtract(1, 'days').format(apiDateFormat), label: moment().subtract(1, 'days').format(dayLabelFormat) },
  { value: moment().format(apiDateFormat), label: 'Today\'s Games' },
  { value: moment().add(1, 'days').format(apiDateFormat), label: moment().add(1, 'days').format(dayLabelFormat) },
  { value: moment().add(2, 'days').format(apiDateFormat), label: moment().add(2, 'days').format(dayLabelFormat) },
];

export default class ScorePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateSelected: moment().format(apiDateFormat),
    };
    this.handleChangeDate = this.handleChangeDate.bind(this);
  }

  componentDidMount() {
    const { dateSelected } = this.state;
    const { fetchGames } = this.props;
    fetchGames(dateSelected);
  }

  handleChangeDate(newDate) {
    console.log(newDate);
    this.setState({ dateSelected: newDate });
    const { fetchGames } = this.props;
    fetchGames(newDate);
  }

  render() {
    const { games } = this.props;
    console.log(games);
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
        <div className="scoreboard-selector">
          { daysOptions.map(option => (
            <a
              key={option.value}
              href="#"
              className={this.state.dateSelected === option.value ? 'scoreboard-selector-item active' : 'scoreboard-selector-item'}
              onClick={() => this.handleChangeDate(option.value)}
            >
              {option.label}
            </a>
          ))}
        </div>
        <div className="scoreboard">
          {games.map(game => <ScoreCard game={game} />)}
        </div>
      </div>
    );
  }
}

ScorePage.propTypes = {
  games: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchGames: PropTypes.func.isRequired,
};
