import React from 'react';
import { Helmet } from 'react-helmet';
import { propEq, findIndex, flatten } from 'ramda';
import moment from 'moment';
import { Query } from 'react-apollo';
import DatePicker from 'react-datepicker';
import { graphql } from 'react-apollo';
import { getScoresQuery } from './query.js';
import DateSlider from '../../../components/DateSlider';
import ScoreCard from '../../../components/ScoreCard';
import LoadingIndicator from '../../../components/LoadingIndicator';
import 'react-datepicker/dist/react-datepicker.css';
import CalendarIcon from '../../../images/calendar.svg';
import './style.scss';

const dayLabelFormat = 'ddd MMM D';
const storeKeyFormat = 'YYYY-MM-DD';
const extendDayHours = 12;

// Figure Out how to combine PaddedDateRange and GamesAccessor

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

// Combine these two functions and add argument to determine if add or subtract
const buildPrevAccessor = (date, i) => moment(date).subtract(i, 'days').format(storeKeyFormat);
const buildNextAccessor = (date, i) => moment(date).add(i, 'days').format(storeKeyFormat);

const convertToOptions = moments => moments.map(moment => ({
  value: moment.format(storeKeyFormat),
  label: moment.format(dayLabelFormat),
}));

class ScorePage extends React.Component {
  constructor(props) {
    super(props);
    const days = buildPaddedDateRange(moment().subtract(12, 'hours'));
    const currentDate = days[Math.round(days.length / 2)].format(storeKeyFormat);
    this.state = {
      currentDate,
      // This is clunky as fuck -> Create an array for this
      y1date: buildPrevAccessor(currentDate, 1),
      y2date: buildPrevAccessor(currentDate, 2),
      y3date: buildPrevAccessor(currentDate, 3),
      n1date: buildNextAccessor(currentDate, 1),
      n2date: buildNextAccessor(currentDate, 2),
      n3date: buildNextAccessor(currentDate, 3),
      daysOptions: convertToOptions(days),
      gamesAccessor: [],
    };
    this.handleNewDateSelected = this.handleNewDateSelected.bind(this);
    this.handleNewCalendarDate = this.handleNewCalendarDate.bind(this);
  }

  handleNewCalendarDate(newDate) {
    this.setState({
      daysOptions: convertToOptions(
        buildPaddedDateRange(moment(newDate)),
      ),
    });
    const newDateNumber = moment(newDate).format(storeKeyFormat);
    this.handleNewDateSelected(newDateNumber);
  }

  handleNewDateSelected(newDate) {
    this.setState({
      currentDate: newDate,
      y1date: buildPrevAccessor(newDate, 1),
      y2date: buildPrevAccessor(newDate, 2),
      y3date: buildPrevAccessor(newDate, 3),
      n1date: buildNextAccessor(newDate, 1),
      n2date: buildNextAccessor(newDate, 2),
      n3date: buildNextAccessor(newDate, 3),
    });
  }

  renderGamesAccessor(data) {
    this.setState({
      gamesAccessor: [
        {
          date: this.state.currentDate,
          nbGames: data.currentDate.length,
        },
        {
          date: this.state.y1date,
          nbGames: data.y1date.length,
        },
        {
          date: this.state.y2date,
          nbGames: data.y2date.length,
        },
        {
          date: this.state.y3date,
          nbGames: data.y3date.length,
        },
        {
          date: this.state.n1date,
          nbGames: data.n1date.length,
        },
        {
          date: this.state.n2date,
          nbGames: data.n2date.length,
        },
        {
          date: this.state.n3date,
          nbGames: data.n3date.length,
        },
      ],
    });
  }

  render() {
    const {
      currentDate, daysOptions, y1date, y2date, y3date, n1date, n2date, n3date, gamesAccessor,
    } = this.state;
    return (
      <div className="score-page">
        <div className="page-header">
          <div className="container">
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
              slickCurrentSlide={findIndex(propEq('value', currentDate))(daysOptions)}
              gamesAccessor={gamesAccessor}
            />
          </div>
        </div>
        <div className="container">
          <Helmet>
            <title>NHL Scores - SealStats.com</title>
            <meta
              name="description"
              content="View Live NHL Scores. Seal Stats is the best place to view NHL stats. User-friendly and fast."
            />
          </Helmet>
          <div className="scoreboard-wrapper">
            <div className="scoreboard-wrapper-results">
              <Query
                query={getScoresQuery}
                variables={{
                  date: currentDate, y1date, y2date, y3date, n1date, n2date, n3date,
                }}
                onCompleted={data => this.renderGamesAccessor(data)}
              >
                {({
                  loading, error, data, client,
                }) => {
                  if (loading) return (<LoadingIndicator />);
                  if (error) return (<div>Error</div>);

                  const games = data.currentDate;

                  if (games.length < 1) {
                    return (
                      <div>No games on this date</div>
                    );
                  }
                  return games.map(game => (
                    <ScoreCard key={game.id} game={game} />
                  ));
                }}
              </Query>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default graphql(getScoresQuery)(ScorePage);
