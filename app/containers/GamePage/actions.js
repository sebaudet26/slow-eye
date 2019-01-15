/* global fetch */
import { FETCH_GAME_BOXSCORE } from './constants';
import graphqlApi from '../../utils/api';

const makeGameBoxscoreQuery = id => `
{
  game (id: "${id}") {
    away {
      team {
        id
        name
        teamName
        abbreviation
        locationName
      }
      teamStats {
        goals
        shots
        pim
        powerPlayGoals
        powerPlayOpportunities
        faceOffWinPercentage
        blocked
        takeaways
        giveaways
        hits
      }
      players {
        person {
          id
          fullName
        }
        jerseyNumber
        position {
          abbreviation
        }
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
          pim
          faceOffWins
          faceOffTaken
          powerPlaySavePercentage
          evenStrengthSavePercentage
          shortHandedSavePercentage
          savePercentage
          saves
        }
      }
    }
    home {
      team {
        id
        name
        teamName
        abbreviation
        locationName
      }
      teamStats {
        goals
        shots
        pim
        powerPlayGoals
        powerPlayOpportunities
        faceOffWinPercentage
        blocked
        takeaways
        giveaways
        hits
      }
      players {
        person {
          id
          fullName
        }
        position {
          abbreviation
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
          pim
          faceOffWins
          faceOffTaken
          powerPlaySavePercentage
          evenStrengthSavePercentage
          shortHandedSavePercentage
          savePercentage
          saves
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
