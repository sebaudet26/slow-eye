/* global fetch */
import { FETCH_GAME_BOXSCORE } from './constants';
import graphqlApi from '../../utils/api';

const makeGameBoxscoreQuery = id => `
{
  game (id: "${id}") {
    away {
      team {
        name
        teamName
        abbreviation
        locationName
      }
      teamStats {
        goals
        shots
      }
      players {
        person {
          fullName
        }
        jerseyNumber
        boxscore {
          goals
          assists
          shots
          hits
          plusMinus
          blocked
          takeaways
          giveaways
          timeOnIce
          penaltyMinutes
          faceOffWins
          faceOffTaken
        }
      }
    }
    home {
      team {
        name
        teamName
        abbreviation
        locationName
      }
      teamStats {
        goals
        shots
      }
      players {
        person {
          fullName
        }
        jerseyNumber
        boxscore {
          goals
          assists
          shots
          hits
          plusMinus
          blocked
          takeaways
          giveaways
          timeOnIce
          penaltyMinutes
          faceOffWins
          faceOffTaken
        }
      }
    }
  }
}
`;

export const fetchGameBoxscore = id => async (dispatch) => {
  try {
    const data = await graphqlApi(makeGameBoxscoreQuery(id));
    console.log('data', data);
    return dispatch({
      type: FETCH_GAME_BOXSCORE,
      payload: data,
    });
  } catch (e) {
    // TODO: dispatch error to reducer
    return console.error(e.toString());
  }
};

export default null;
