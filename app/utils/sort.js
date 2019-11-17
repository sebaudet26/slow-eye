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

export const dynamicSort = (property) => {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  };
};

export default null;
