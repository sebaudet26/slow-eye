import React from 'react';
import moment from 'moment';

class Bio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { playerInfo } = this.props;

    return (
      <div>
        <p>
          <span className="bold">Born</span>
          {` ${moment(playerInfo.birthDate).format('LL')} (${moment().diff(playerInfo.birthDate, 'years')} yrs. ago) `}
        </p>
        <p>
          <span className="bold"> Birthplace</span>
          {` ${[playerInfo.birthCity, playerInfo.birthStateProvince || '', playerInfo.birthCountry].filter(Boolean).join(', ')} `}
        </p>
        <p>
          <span className="bold">Height</span>
          {` ${playerInfo.height} ft. `}
          <span className="bold">Weight</span>
          {` ${playerInfo.weight} lbs. `}
        </p>
      </div>
    );
  }
}

export default Bio;
