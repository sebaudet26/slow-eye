import React from 'react';
import { propEq, findIndex, flatten } from 'ramda';
import moment from 'moment';
import { Query } from 'react-apollo';
import DatePicker from 'react-datepicker';
import { graphql } from 'react-apollo';
import { getScoresQuery } from './query.js';
import Header from '../../../components/Header';
import Helmet from '../../../components/Helmet';
import Footer from '../../../components/Footer';
import DateSlider from '../../../components/DateSlider';
import ScoreCard from '../../../components/ScoreCard';
import EmptyState from '../../../components/EmptyState';
import LoadingIndicator from '../../../components/LoadingIndicator';
import 'react-datepicker/dist/react-datepicker.css';
import CalendarIcon from '../../../public/images/calendar.svg';
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

const buildDateRange = currentDate => ([
  moment(currentDate).subtract(3, 'days').format(storeKeyFormat),
  moment(currentDate).subtract(2, 'days').format(storeKeyFormat),
  moment(currentDate).subtract(1, 'days').format(storeKeyFormat),
  currentDate,
  moment(currentDate).add(1, 'days').format(storeKeyFormat),
  moment(currentDate).add(2, 'days').format(storeKeyFormat),
  moment(currentDate).add(3, 'days').format(storeKeyFormat),
])

const convertToOptions = moments => moments.map(moment => ({
  value: moment.format(storeKeyFormat),
  label: moment.format(dayLabelFormat),
}));

class ScorePage extends React.Component {
  constructor(props) {
    super(props);
    const days = buildPaddedDateRange(moment().subtract(extendDayHours, 'hours'));
    const currentDate = days[Math.round(days.length / 2)].format(storeKeyFormat);
    this.state = {
      currentDate,
      dates: buildDateRange(currentDate),
      daysOptions: convertToOptions(days),
      gamesAccessor: [],
    };
    console.log('dates', this.state.dates)
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
    this.setState({ dates: buildDateRange(newDate) });
  }

  renderGamesAccessor(data) {
    this.setState({
      gamesAccessor: this.state.dates.map(date => ({ date: date, nbGames: 5 }))
    });
  }

  render() {
    const {
      currentDate, daysOptions, dates, gamesAccessor,
    } = this.state;
    return (
      <div>
        <Header selectedLeague="NHL" />
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
            <Helmet titlePrefix="NHL Scores" contentPrefix="View Live NHL Scores."/>
            <div className="scoreboard-wrapper">
              <div className="scoreboard-wrapper-results">
                <Query
                  query={getScoresQuery}
                  variables={{
                    dates: this.state.dates
                  }}
                  onCompleted={data => this.renderGamesAccessor(data)}
                >
                  {({
                    loading, error, data, client,
                  }) => {
                    if (loading) return (<LoadingIndicator />);
                    if (error) return (<EmptyState isError />);
                    console.log('dates', this.state.dates)
                    console.log('data', data)
                    const todaysGames = data.nhl.schedule;
                    console.log('todaysGames', todaysGames)
                    if (todaysGames.length < 1) {
                      return (
                        <EmptyState />
                      );
                    }
                    return todaysGames.map(game => (
                      <ScoreCard key={game.id} game={game} />
                    ));
                  }}
                </Query>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default graphql(getScoresQuery)(ScorePage);
