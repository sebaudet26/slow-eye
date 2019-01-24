import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CalendarIcon from '../../images/calendar.svg';
import ScoreCard from '../ScoreCard';
import './slick-theme.min.scss';
import './style.scss';

const renderSlide = (opt, nbGames) => (
  <div className="slick-slide-content" key={opt.value}>
    <div className="slick-slide-date">
      {opt.label}
    </div>
    <div className="slick-slide-games">
      {`(${nbGames} Games)`}
    </div>
  </div>
);


class DateSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sliderValue: this.props.daysOptions[2].value.replace(/-/g, '') };
    this.handleNewDateSelected = this.handleNewDateSelected.bind(this);
  }

  handleNewDateSelected(newIndex) {
    this.setState({ sliderValue: this.props.daysOptions[newIndex].value.replace(/-/g, '') });
  }

  render() {
    const { daysOptions, games } = this.props;

    const settings = {
      dots: false,
      className: 'center',
      swipeToSlide: true,
      afterChange: this.handleNewDateSelected,
      infinite: false,
      focusOnSelect: true,
      speed: 200,
      slidesToShow: 5,
      slidesToScroll: 1,
      initialSlide: 1,
      centerMode: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };
    return (
      games[this.state.sliderValue] && games[this.state.sliderValue].games && Object.keys(games).length === daysOptions.length ? (
        <div>
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
                // selected={dateSelected}
                // onChange={v => this.handleChangeDate(moment(v).format(apiDateFormat))}
                  dateFormat="eee MMM dd"
                  todayButton="Today"
                />
              </label>
            </div>
          </div>
          <Slider ref={slider => this.slider = slider} {...settings}>
            {daysOptions.map(opt => renderSlide(opt, games[opt.value.replace(/-/g, '')].games.length))}
          </Slider>
          <div className="scoreboard-results">
            {games[this.state.sliderValue] ? games[this.state.sliderValue].games.map(game => <ScoreCard game={game} />) : null}
          </div>
        </div>
      ) : null
    );
  }
}

export default DateSlider;
