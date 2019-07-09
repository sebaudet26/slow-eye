/* global fetch */
import graphqlApi from '../../../utils/api';

const allTeams = `
{
  teams {
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

export const fetchAllTeams = () => async (dispatch) => {
  try {
    const data = await graphqlApi(allTeams);
    return dispatch({
      type: 'FETCH_TEAMS_STATS',
      payload: data,
    });
  } catch (e) {
    return console.error(e.toString());
  }
};

export default null;
