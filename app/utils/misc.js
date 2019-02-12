export const getNumberWithOrdinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const timeOnIceToSeconds = timeOneIceString => (
  Number(timeOneIceString.split(':')[0]) * 60 +
    Number(timeOneIceString.split(':')[1])
);

export default null;
