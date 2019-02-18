
module.exports = parseInt(
  process.env.NODE_ENV === 'production'
    ? '3000'
    : (process.env.PORT || '3000'), 10,
);
