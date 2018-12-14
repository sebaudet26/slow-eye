/* global fetch */
import {
  flatten, map, mergeAll, path, prop,
} from 'ramda';
import { FETCH_PLAYERS } from './constants';

// TODO: error handling

export const fetchStatsForPlayerId = async (playerId) => {
  const requestURL = `https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=statsSingleSeason`;
  const playerStatsResponse = await fetch(requestURL);
  const playerStatsData = await playerStatsResponse.json();
  console.log(playerStatsData);
  return { [playerId]: path(['stats', 0, 'splits'], playerStatsData) };
};

export const fetchPlayersForTeamId = async (teamId) => {
  const requestURL = `https://statsapi.web.nhl.com/api/v1/teams/${teamId}/roster`;
  const apiResponse = await fetch(requestURL);
  const json = await apiResponse.json();
  const allRosterIds = map(path(['person', 'id']), json.roster);
  const playerInfo = mergeAll(json.roster.map(p => ({ [p.person.id]: { ...p } })));
  const playerStats = await Promise.all(map(fetchStatsForPlayerId, allRosterIds));
  const statsObject = mergeAll(playerStats);
  const fullData = allRosterIds.map(id => ({
    teamId, stats: statsObject[id], id, ...playerInfo[id],
  }));
  return fullData;
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
  const allTeamsRosters = await Promise.all(map(fetchPlayersForTeamId, [1]));
  return dispatch({
    type: FETCH_PLAYERS,
    payload: flatten(allTeamsRosters),
  });
};

export default null;
