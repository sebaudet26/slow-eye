import React from 'react';
import moment from 'moment';

class Bio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { bio } = this.props;

    return (
      <div>
        <p>
          <span className="bold">Born</span>
          {` ${moment(bio.birthDate).format('LL')} (${moment().diff(bio.birthDate, 'years')} yrs. ago) `}
        </p>
        <p>
          <span className="bold"> Birthplace</span>
          {` ${[bio.birthCity, bio.birthStateProvince || '', bio.birthCountry].filter(Boolean).join(', ')} `}
        </p>
        <p>
          <span className="bold">Height</span>
          {` ${bio.height.feet} ft. ${bio.height.inches} `}
          <span className="bold">Weight</span>
          {` ${bio.weight.pounds} lbs. `}
        </p>
      </div>
    );
  }
}

export default Bio;
