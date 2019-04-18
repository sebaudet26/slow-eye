import {
  concat, reduce, head, filter, map, pipe, pathEq, prop,
} from 'ramda';

export const logoForTeamName = teamName =>
  `../../images/teams/${teamName.replace(' ', '-').toLowerCase()}.png`;

export const smallLogoForTeamName = teamAbr =>
  `../../images/teams/small/${teamAbr}.png`;


export const calculatePoints = team => `${team.leagueRecord.wins * 2 + team.leagueRecord.ot} pts`;

export const findTeamRecordInStandings = standings => teamId =>
  pipe(
    prop('standings'),
    map(prop('teamRecords')),
    reduce(concat, []),
    filter(pathEq(['team', 'id'], teamId)),
    head,
  )(standings);

export const calculateSeriesWins = team => `${team.leagueRecord.wins + team.leagueRecord.ot}`;

export default null;
