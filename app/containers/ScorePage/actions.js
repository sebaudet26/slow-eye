import graphqlApi from '../../utils/api';
import { FETCH_GAMES } from './constants';

const makeScoresQuery = date => `
{
  games (date: "${date}"){
    id,
    gameDate
    liveFeed {
      lastTenPlays {
        period
        periodTimeRemaining
        periodType
        periodTime
        description
      }
    }
    status {
      abstractGameState,
      codedGameState,
      detailedState,
      statusCode
    },
    teams {
      away {
        score,
        leagueRecord {
          wins,
          losses,
          ot
        },
        team {
          name,
          id,
          abbreviation
        }
      },
      home {
        score,
        leagueRecord {
          wins,
          losses,
          ot
        },
        team {
          name,
          id,
          abbreviation
        }
      }
    }
  }
}
`;
export const fetchGames = date => async (dispatch) => {
  try {
    const data = await graphqlApi(makeScoresQuery(date));
    console.log('data', data);
    return dispatch({
      type: FETCH_GAMES,
      payload: data,
    });
  } catch (e) {
    // TODO: dispatch error to reducer
    return console.error(e.toString());
  }
};

export default null;
