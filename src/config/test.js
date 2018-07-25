module.exports = {
  env: 'test',
  db: process.env.DB,
  port: process.env.PORT || 4003,
  secret: process.env.SECRET,
};
