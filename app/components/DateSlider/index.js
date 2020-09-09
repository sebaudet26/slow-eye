import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import {
  sortBy, prop, values, find, propEq,
} from 'ramda';
import LeftArrow from './images/left.svg';
import RightArrow from './images/right.svg';
import './slick-theme.min.scss';
import './style.scss';

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      onClick={onClick}
      className="slick-arrow"
    >
      <img src={LeftArrow} />
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
      <img src={RightArrow} />
    </div>
  );
}

const renderSlide = (opt, gamesAccessor) => (
  <div className="slick-slide-content" key={opt.value}>
    <div className="slick-slide-date">
      <span>
        {opt.label}
      </span>
    </div>
    <div className="slick-slide-games">
      {
        // This loops over entire daysOptions array -> figure out better way
        find(propEq('date', opt.value))(gamesAccessor) ? `(${find(propEq('date', opt.value))(gamesAccessor).nbGames} Games)` : '...'
      }
    </div>
  </div>
);

class DateSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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
    const {
      daysOptions, handleNewDateSelected, gamesAccessor, slickCurrentSlide,
    } = this.props;
    const settings = {
      dots: false,
      swipeToSlide: true,
      afterChange: handleNewDateSelected,
      infinite: false,
      focusOnSelect: true,
      speed: 200,
      slidesToShow: 7,
      slidesToScroll: 1,
      initialSlide: slickCurrentSlide,
      centerMode: true,
      prevArrow: <PrevArrow />,
      nextArrow: <NextArrow />,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 7,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
      ],
    };
    return (
      <Slider ref={slider => this.slider = slider} {...settings}>
        {
          daysOptions.map(opt => renderSlide(opt, gamesAccessor))
        }
      </Slider>
    );
  }
}

export default DateSlider;
