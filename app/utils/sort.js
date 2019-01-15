export const sortTimeOnIce = (a, b) => {
  if (!a) {
    return -1;
  }
  if (!b) {
    return 1;
  }
  const aTime = {
    hours: a.split(':')[0],
    minutes: a.split(':')[1],
  };
  const bTime = {
    hours: b.split(':')[0],
    minutes: b.split(':')[1],
  };
  if (aTime.hours === bTime.hours) {
    return Number(aTime.minutes) > Number(bTime.minutes) ? 1 : -1;
  }
  return Number(aTime.hours) > Number(bTime.hours) ? 1 : -1;
};

export default null;
