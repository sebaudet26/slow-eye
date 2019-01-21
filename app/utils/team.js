import {
  concat, reduce, head, filter, map, pipe, pathEq, prop,
} from 'ramda';

export const logoForTeamName = teamName =>
  `../../images/teams/${teamName.replace(' ', '-').toLowerCase()}.png`;

export const findTeamRecordInStandings = standings => teamId =>
  pipe(
    prop('standings'),
    map(prop('teamRecords')),
    reduce(concat, []),
    filter(pathEq(['team', 'id'], teamId)),
    head,
  )(standings);


export default null;
