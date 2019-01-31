import {
  pipe, prop, toString, toLower, match, length,
} from 'ramda';

export const toLowerCaseAndMatch = (filter, row) => pipe(
  prop(filter.id),
  toString,
  toLower,
  match(toLower(filter.value || '')),
  length,
)(row);

export default null;
