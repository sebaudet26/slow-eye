import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import DateSlider from '../../components/DateSlider';
import './style.scss';

const dayLabelFormat = 'ddd MMM D';
const apiDateFormat = 'YYYY-MM-DD';

const extendDayHours = 12;

const daysOptions = [
  {
    value: moment().subtract(extendDayHours, 'hours').subtract(2, 'days').format(apiDateFormat),
    label: moment().subtract(extendDayHours, 'hours').subtract(2, 'days').format(dayLabelFormat),
  },
  {
    value: moment().subtract(extendDayHours, 'hours').subtract(1, 'days').format(apiDateFormat),
    label: moment().subtract(extendDayHours, 'hours').subtract(1, 'days').format(dayLabelFormat),
  },
  {
    value: moment().subtract(extendDayHours, 'hours').format(apiDateFormat),
    label: 'Today\'s Games',
  },
  {
    value: moment().subtract(extendDayHours, 'hours').add(1, 'days').format(apiDateFormat),
    label: moment().subtract(extendDayHours, 'hours').add(1, 'days').format(dayLabelFormat),
  },
  {
    value: moment().subtract(extendDayHours, 'hours').add(2, 'days').format(apiDateFormat),
    label: moment().subtract(extendDayHours, 'hours').add(2, 'days').format(dayLabelFormat),
  },
  {
    value: moment().subtract(extendDayHours, 'hours').add(3, 'days').format(apiDateFormat),
    label: moment().subtract(extendDayHours, 'hours').add(3, 'days').format(dayLabelFormat),
  },
  {
    value: moment().subtract(extendDayHours, 'hours').add(4, 'days').format(apiDateFormat),
    label: moment().subtract(extendDayHours, 'hours').add(4, 'days').format(dayLabelFormat),
  },
];

export default class ScorePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateSelected: daysOptions[2].value,
    };
    this.fetchGamesForDateOptions = this.fetchGamesForDateOptions.bind(this);
  }

  async fetchGamesForDateOptions() {
    await Promise.all(daysOptions.map(opt => this.props.fetchGames(opt.value)));
  }

  componentDidMount() {
    const { dateSelected } = this.state;
    const { fetchGames } = this.props;
    this.fetchGamesForDateOptions();
  }

  render() {
    const { games } = this.props;
    const { dateSelected } = this.state;
    return (
      <div className="score-page">
        <Helmet>
          <title>Scores</title>
          <meta
            name="description"
            content="Scores"
          />
        </Helmet>
        <DateSlider daysOptions={daysOptions} games={games} />
      </div>
    );
  }
}

ScorePage.propTypes = {
  games: PropTypes.shape({}).isRequired,
  fetchGames: PropTypes.func.isRequired,
};
