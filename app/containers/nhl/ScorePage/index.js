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

class ScorePage extends React.Component {
  constructor(props) {
    super(props);
    const days = buildPaddedDateRange(moment().subtract(12, 'hours'));
    this.state = {
      currentDate: days[Math.round(days.length / 2)].format(storeKeyFormat),
      daysOptions: convertToOptions(days),
    };
    this.handleNewDateSelected = this.handleNewDateSelected.bind(this);
    this.handleNewCalendarDate = this.handleNewCalendarDate.bind(this);
    this.displayDateSlider = this.displayDateSlider.bind(this);
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
    console.log(newDate);
    this.setState({ currentDate: newDate });
  }

  displayDateSlider() {
    const data = this.props.data;
    if (data.loading) {
      // Skeleton Loader
    } else {
      const games = this.props.data.games;
      return (
        <DateSlider
          daysOptions={this.state.daysOptions}
          handleNewDateSelected={index => this.handleNewDateSelected(this.state.daysOptions[index].value)}
          games={games}
          slickCurrentSlide={findIndex(propEq('value', this.state.currentDate))(this.state.daysOptions)}
        />
      );
    }
  }

  render() {
    const { currentDate, daysOptions } = this.state;
    console.log(currentDate);
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
            {this.displayDateSlider()}
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
              <Query query={getScoresQuery} variables={{ date: currentDate }}>
                {({ loading, error, data }) => {
                  const games = data.games;

                  if (loading) return (<LoadingIndicator />);
                  if (error) return (<div>Error</div>);

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
