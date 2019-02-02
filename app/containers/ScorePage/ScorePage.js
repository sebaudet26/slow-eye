import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { propEq, findIndex } from 'ramda';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import DateSlider from '../../components/DateSlider';
import ScoreCard from '../../components/ScoreCard';
import 'react-datepicker/dist/react-datepicker.css';
import CalendarIcon from '../../images/calendar.svg';
import './style.scss';

const dayLabelFormat = 'ddd MMM D';
const storeKeyFormat = 'YYYYMMDD';
const extendDayHours = 12;

const buildPaddedDateRange = (middleMoment) => {
  const options = [];
  for (let i = 365; i > 0; i--) {
    options.push(middleMoment.clone().subtract(i, 'days'));
  }
  options.push(middleMoment.clone());
  for (let i = 1; i < 365; i++) {
    options.push(middleMoment.clone().add(i, 'days'));
  }
  return options;
};

const convertToOptions = moments => moments.map(moment => ({
  value: moment.format(storeKeyFormat),
  label: moment.format(dayLabelFormat),
}));

export default class ScorePage extends React.Component {
  constructor(props) {
    super(props);
    const days = buildPaddedDateRange(moment().subtract(12, 'hours'));
    this.state = {
      currentDate: days[Math.round(days.length / 2)].format(storeKeyFormat),
      daysOptions: convertToOptions(days),
    };
    this.handleNewDateSelected = this.handleNewDateSelected.bind(this);
    this.handleNewCalendarDate = this.handleNewCalendarDate.bind(this);
  }

  handleNewCalendarDate(newDate) {
    console.log('*** handleNewCalendarDate', newDate);
    const { fetchGames, games } = this.props;
    this.setState({
      daysOptions: convertToOptions(
        buildPaddedDateRange(moment(newDate)),
      ),
    });
    const newDateNumber = moment(newDate).format(storeKeyFormat);
    this.handleNewDateSelected(newDateNumber);
  }

  componentWillMount() {
    const { fetchGames } = this.props;
    const middleIndex = 365;
    console.log('*** componentWillMount');
    fetchGames(this.state.daysOptions[middleIndex].value);
    for (let i = 1; i < 3; i++) {
      fetchGames(this.state.daysOptions[middleIndex + i].value);
      fetchGames(this.state.daysOptions[middleIndex - i].value);
    }
  }

  handleNewDateSelected(newDate) {
    console.log('*** handleNewDateSelected in slick', newDate);
    const { games, fetchGames } = this.props;
    const gamesAccessor = diff => Number(moment(newDate, storeKeyFormat).add(diff, 'days').format(storeKeyFormat));
    console.log(gamesAccessor(0));
    if (!games[gamesAccessor(0)]) {
      console.log(`loading ${gamesAccessor(0)}`);
      fetchGames(gamesAccessor(0));
    }
    if (!games[gamesAccessor(-1)]) {
      console.log(`loading ${gamesAccessor(-1)}`);
      fetchGames(gamesAccessor(-1));
    }
    if (!games[gamesAccessor(+1)]) {
      console.log(`loading ${gamesAccessor(+1)}`);
      fetchGames(gamesAccessor(+1));
    }
    if (!games[gamesAccessor(-1)]) {
      console.log(`loading ${gamesAccessor(-1)}`);
      fetchGames(gamesAccessor(-1));
    }
    if (!games[gamesAccessor(+2)]) {
      console.log(`loading ${gamesAccessor(+2)}`);
      fetchGames(gamesAccessor(+2));
    }
    if (!games[gamesAccessor(-2)]) {
      console.log(`loading ${gamesAccessor(-2)}`);
      fetchGames(gamesAccessor(-2));
    }
    if (!games[gamesAccessor(+3)]) {
      console.log(`loading ${gamesAccessor(+3)}`);
      fetchGames(gamesAccessor(+3));
    }
    if (!games[gamesAccessor(-3)]) {
      console.log(`loading ${gamesAccessor(-3)}`);
      fetchGames(gamesAccessor(-3));
    }
    this.setState({ currentDate: newDate });
  }

  render() {
    const { games } = this.props;
    const { currentDate, daysOptions } = this.state;
    console.log('games', games);
    console.log('currentDate', currentDate);
    const gamesAccessor = Number(currentDate);
    return (
      <div className="score-page">
        <Helmet>
          <title>Scores</title>
          <meta
            name="description"
            content="View Live NHL Scores. Seal Stats is the best place to view NHL stats. User-friendly and fast."
          />
        </Helmet>
        <div className="scoreboard-header">
          <h2>Scores</h2>
          <div className="scoreboard-datePicker">
            <label>
              <img
                src={CalendarIcon}
                className="scoreboard-datePicker-calendar"
                alt=""
              />
              <DatePicker
                selected={moment(currentDate, storeKeyFormat).toDate()}
                dateFormat="eee MMM dd"
                todayButton="Today"
                onChange={this.handleNewCalendarDate}
              />
            </label>
          </div>
        </div>
        <DateSlider
          daysOptions={daysOptions}
          handleNewDateSelected={index => this.handleNewDateSelected(daysOptions[index].value)}
          games={games}
          slickCurrentSlide={findIndex(propEq('value', currentDate))(daysOptions)}
        />
        <div className="scoreboard-results">
          {
            games[gamesAccessor]
              ? games[gamesAccessor].map(game => (<ScoreCard key={Math.random()} game={game} />))
              : null
          }
        </div>
      </div>
    );
  }
}

ScorePage.propTypes = {
  games: PropTypes.shape({}).isRequired,
  fetchGames: PropTypes.func.isRequired,
};
