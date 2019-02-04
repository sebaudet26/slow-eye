/* global fetch */
import { FETCH_PLAYERS, FETCH_TEAMS } from './constants';
import graphqlApi from '../../utils/api';

const makePlayersQuery = season => `
{
  playersReport (season: "${season}") {
    id
    name
    nationality
    positionCode
    gamesPlayed
    goals
    assists
    points
    plusMinus
    penaltyMinutes
    ppGoals
    shGoals
    teams {
      id
      abbreviation
    }
    hits
    rookie
    blockedShots
    shots
    shootingPctg
    timeOnIcePerGame
    ties
    wins
    losses
    otLosses
    goalsAgainst
    goalsAgainstAverage
    saves
    shotsAgainst
    savePercentage
    shutouts
  }
}`;

const makeTeamsQuery = season => `
{
  teams (season: "${season}") {
    id
    abbreviation
    name
  }
}`;

export const fetchAllPlayers = season => async (dispatch) => {
  try {
    const data = await graphqlApi(makePlayersQuery(season || '20182019'));
    return dispatch({
      type: FETCH_PLAYERS,
      payload: data.playersReport,
    });
  } catch (e) {
    // TODO: dispatch error to reducer
    return console.error(e.toString());
  }
};

export const fetchAllTeams = season => async (dispatch) => {
  try {
    const data = await graphqlApi(makeTeamsQuery(season || '20182019'));
    return dispatch({
      type: FETCH_TEAMS,
      payload: data.teams,
    });
  } catch (e) {
    // TODO: dispatch error to reducer
    return console.error(e.toString());
  }
};

export default null;
