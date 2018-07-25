module.exports = {
  env: 'staging',
  db: process.env.DB,
  port: process.env.PORT || 4002,
  secret: process.env.SECRET,
};
