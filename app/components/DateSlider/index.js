import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { sortBy, prop, values } from 'ramda';
import ScoreCard from '../ScoreCard';
import './slick-theme.min.scss';
import './style.scss';

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      onClick={onClick}
      className="slick-arrow"
    >
    &#9664;
    </div>
  );
}

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      onClick={onClick}
      className="slick-arrow next"
    >
    &#9654;
    </div>
  );
}

const renderSlide = (opt, games) => (
  <div className="slick-slide-content" key={Math.random()}>
    <div className="slick-slide-date">
      <span>
        {opt.label}
      </span>
    </div>
    <div className="slick-slide-games">
      {games[opt.value] ? `( ${games[opt.value].length} Games )` : '...'}
    </div>
  </div>
);

class DateSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { daysOptions } = this.props;
    if (
      prevProps.daysOptions[Math.round(daysOptions.length / 2)].value
      !== daysOptions[Math.round(daysOptions.length / 2)].value
    ) {
      this.slider.slickGoTo(Math.round(daysOptions.length / 2), true);
    }
  }

  render() {
    const { daysOptions, handleNewDateSelected, games } = this.props;

    const settings = {
      dots: false,
      className: 'center',
      swipeToSlide: true,
      afterChange: handleNewDateSelected,
      infinite: false,
      focusOnSelect: true,
      speed: 200,
      slidesToShow: 5,
      slidesToScroll: 1,
      initialSlide: Math.round(daysOptions.length / 2),
      centerMode: true,
      prevArrow: <PrevArrow />,
      nextArrow: <NextArrow />,
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
      <Slider ref={slider => this.slider = slider} {...settings}>
        {daysOptions.map(opt => renderSlide(opt, games))}
      </Slider>
    );
  }
}

export default DateSlider;
