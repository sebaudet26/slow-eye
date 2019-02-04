const seasons = [];
for (let y = 2019; y > 1917; y--) {
  // skip lockout year
  if (y !== 2005) {
    seasons.push({
      value: Number(`${y - 1}${y}`),
      label: `${y - 1}-${y}`,
    });
  }
}

export default seasons;
