import React from 'react';
import { toOrdinal } from '../../../utils/misc';

class DraftInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { draftInfo } = this.props;
    return (
      <div className="player-desc-right">
        {
          draftInfo ? (
            <div>
              <p>
                <span className="bold">Drafted by</span>
                {` ${draftInfo.team.name}`}
              </p>
              <p>
                <span>{`${toOrdinal(draftInfo.round)}  Round, `}</span>
                <span>{`#${draftInfo.pickOverall} Overall, ${draftInfo.year} NHL Draft`}</span>
              </p>
            </div>
          ) : <span>Undrafted</span>
        }
      </div>
    )
  }
}

export default DraftInfo;
