import React from 'react';
import { toOrdinal } from '../../../utils/misc';
import { last } from 'ramda'

class DraftInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { draft } = this.props;

    return (
      <div className="player-desc-right">
        {
          draft ? (
            <div>
              <p>
                <span className="bold">Drafted by</span>
                {` ${last(draft.pickHistory)}`}
              </p>
              <p>
                <span>{`${toOrdinal(draft.round)}  Round, `}</span>
                <span>{`#${draft.overall} Overall, ${draft.year} NHL Draft`}</span>
              </p>
            </div>
          ) : <span>Undrafted</span>
        }
      </div>
    )
  }
}

export default DraftInfo;
