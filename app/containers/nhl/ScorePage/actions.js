import moment from 'moment';
import graphqlApi from '../../../utils/api';

const makeScoresQuery = date => `
{
  games (date: "${date}"){
    id,
    gameDate
    ${!moment(date, 'YYYYMMDD').isAfter() ?
    `
        highlights {
          recap
        }
        liveFeed {
          lastTenPlays {
            period
            periodTimeRemaining
            periodType
            periodTime
            description
          }
        }
      ` : ''}
    status {
      abstractGameState
      codedGameState
      detailedState
      statusCode
    }
    seriesSummary {
      gameLabel
      seriesStatus
      seriesStatusShort
    }
    teams {
      away {
        score
        leagueRecord {
          wins
          losses
          ot
        }
        team {
          name
          id
          abbreviation
        }
      }
      home {
        score
        leagueRecord {
          wins
          losses
          ot
        }
        team {
          name
          id
          abbreviation
        }
      }
    }
  }
}
`;
export const fetchGames = date => async (dispatch) => {
  try {
    console.log('date', date);
    const properlyFormattedDate = moment(date, 'YYYYMMDD').format('YYYY-MM-DD');
    const isFuture = moment(date, 'YYYYMMDD').isAfter();
    console.log(date, `is Future ${isFuture}`);
    console.log('properlyFormattedDate', properlyFormattedDate);
    const data = await graphqlApi(makeScoresQuery(properlyFormattedDate));
    return dispatch({
      type: 'FETCH_GAMES',
      payload: {
        date,
        games: data.games,
      },
    });
  } catch (e) {
    // TODO: dispatch error to reducer
    return console.error(e.toString());
  }
};

export default null;
