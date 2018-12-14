/* global fetch */
import { flatten, map, prop } from 'ramda';
import { FETCH_PLAYERS } from './constants';

export const fetchPlayersForTeamId = async (teamId) => {
  const requestURL = `https://statsapi.web.nhl.com/api/v1/teams/${teamId}/roster`;
  const apiResponse = await fetch(requestURL);
  const json = await apiResponse.json();
  const roster = prop('roster', json).map(p => ({ ...p, teamId }));
  return roster;
};

export const fetchAllTeams = async () => {
  const allTeamsURL = 'https://statsapi.web.nhl.com/api/v1/teams';
  const allTeamsResponse = await fetch(allTeamsURL);
  const allTeamsData = await allTeamsResponse.json();
  return allTeamsData;
};

export const fetchAllTeamsPlayers = () => async (dispatch) => {
  const allTeamsData = await fetchAllTeams();
  const allTeamsIds = map(prop('id'), prop('teams', allTeamsData));
  const allTeamsRosters = await Promise.all(map(fetchPlayersForTeamId, allTeamsIds));
  return dispatch({
    type: FETCH_PLAYERS,
    payload: flatten(allTeamsRosters),
  });
};

export default null;
