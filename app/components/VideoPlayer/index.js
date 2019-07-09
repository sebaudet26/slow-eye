import React, { Component, PropTypes } from 'react';
import ReactPlayer from 'react-player';
import PlayIcon from '../../public/images/play-button.svg';
import './style.scss';


export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      watchVideoUrl: false,
    };
    this.onWatchVideo = this.onWatchVideo.bind(this);
  }

  onWatchVideo(url) {
    this.setState({ watchVideoUrl: url });
  }

  render() {
    const { url, styles, callToAction } = this.props;
    const { watchVideoUrl } = this.state;

    return (
      <div>
        {
          watchVideoUrl ? (
            <div className="video-wrapper">
              <div
                className="video-close"
                onClick={() => this.setState({ watchVideoUrl: null })}
              />
              <ReactPlayer
                url={watchVideoUrl}
                playing
                className="video-player"
                controls
                loop={false}
              />
            </div>
          ) : null
        }
        <a
          className="play-link"
          style={styles}
          onClick={() => this.onWatchVideo(url)}
        >
          <img src={PlayIcon} alt="Play Icon" />
          {callToAction}
        </a>
      </div>
    );
  }
}

VideoPlayer.propTypes = {

};
