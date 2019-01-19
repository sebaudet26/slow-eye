import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import CalendarIcon from '../../images/calendar.svg';
import 'react-datepicker/dist/react-datepicker.css';
import ScoreCard from '../../components/ScoreCard';
import './style.scss';

const dayLabelFormat = 'ddd MMM D';
const apiDateFormat = 'YYYY-MM-DD';

const daysOptions = [
  { value: moment().subtract(2, 'days').format(apiDateFormat), label: moment().subtract(2, 'days').format(dayLabelFormat) },
  { value: moment().subtract(1, 'days').format(apiDateFormat), label: moment().subtract(1, 'days').format(dayLabelFormat) },
  { value: moment().subtract(10, 'hours').format(apiDateFormat), label: 'Today\'s Games' },
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
    this.setState({ dateSelected: newDate });
    const { fetchGames } = this.props;
    fetchGames(newDate);
  }

  render() {
    const { games } = this.props;
    const { dateSelected } = this.state;
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
        <div className="scoreboard-header">
          <div className="scoreboard-datePicker">
            <label>
              <img
                src={CalendarIcon}
                className="scoreboard-datePicker-calendar"
                alt=""
              />
              <DatePicker
                selected={dateSelected}
                onChange={v => this.handleChangeDate(moment(v).format(apiDateFormat))}
                dateFormat="eee MMM dd"
                todayButton="Today"
              />
            </label>
          </div>
          <div className="scoreboard-selector">
            { daysOptions.map(option => (
              <button
                key={option.value}
                type="button"
                className={dateSelected === option.value ? 'scoreboard-selector-item active' : 'scoreboard-selector-item'}
                onClick={() => this.handleChangeDate(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="scoreboard-results">
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
