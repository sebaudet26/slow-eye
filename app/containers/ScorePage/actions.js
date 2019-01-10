import moment from 'moment';
import graphqlApi from '../../utils/api';
import { FETCH_TODAYS_GAMES } from './constants';

const getTodaysGamesQuery = `
{
  games (date: "${moment().subtract(12, 'hours').format('YYYY-MM-DD')}"){
    gameDate,
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
export const fetchTodaysGames = () => async (dispatch) => {
  try {
    const data = await graphqlApi(getTodaysGamesQuery, 'todays-games');
    console.log('data', data);
    return dispatch({
      type: FETCH_TODAYS_GAMES,
      payload: data,
    });
  } catch (e) {
    // TODO: dispatch error to reducer
    return console.error(e.toString());
  }
};

export default null;
