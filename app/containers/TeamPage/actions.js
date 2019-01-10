/* global fetch */
import { FETCH_TEAM } from './constants';
import graphqlApi from '../../utils/api';

const makeTeamQuery = id => `
{
  team (id: ${id}) {
    id
    name
    link
    abbreviation
    teamName
    roster {
      id
    },
    stats {
      type
      splits {
        gamesPlayed
        wins
        losses
        ot
        pts
        ptPctg
        goalsPerGame
        goalsAgainstPerGame
        evGGARatio
        powerPlayPercentage
        powerPlayGoals
        powerPlayGoalsAgainst
        powerPlayOpportunities
        penaltyKillPercentage
        shotsPerGame
        shotsAllowed
        winScoreFirst
        winOppScoreFirst
        winLeadFirstPer
        winLeadSecondPer
        winOutshootOpp
        winOutshotByOpp
        faceOffsTaken
        faceOffsWon
        faceOffsLost
        faceOffWinPercentage
        shootingPctg
        savePctg
      }
    }
  }
}
`;

export const fetchTeamById = id => async (dispatch) => {
  try {
    const data = await graphqlApi(makeTeamQuery(id));
    console.log('data', data);
    return dispatch({
      type: FETCH_TEAM,
      payload: data,
    });
  } catch (e) {
    // TODO: dispatch error to reducer
    return console.error(e.toString());
  }
};

export default null;
