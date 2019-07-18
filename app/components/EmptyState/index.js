import React from 'react';
import './style.scss';
import ErrorImg from './images/Whistle.svg';
import NoGameImg from './images/Calendar.svg';

class EmptyState extends React.Component {
  render() {
    const { isError } = this.props;
    return (
      <div className="emptyState">
        {
          isError ? (
            <div>
              <img src={ErrorImg} alt="Error" />
              <h3>Oops!</h3>
              <p>Someting went wrong here. Please try again.</p>
            </div>
          ) : (
            <div>
              <img src={NoGameImg} alt="No Game" />
              <h3>No Games Scheduled.</h3>
            </div>
          )
        }
      </div>
    );
  }
}

export default EmptyState;
