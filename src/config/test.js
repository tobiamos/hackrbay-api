module.exports = {
  env: 'test',
  db: process.env.TESTDBURI,
  port: process.env.PORT || 4003,
  secret: process.env.SECRET,
};
