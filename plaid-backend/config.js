const port = 9000;
const secretKey = 'secretKey';
const SENDGRID_API_KEY = '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';
const expiredAfter = 60 * 60 * 1000;
// plaid keys
const devKey = {
  client: '5ce5625b4ba66400143d6938',
  public: 'aeec6a4876fd99bb7e26c51c8d3217',
  secret: '7cd1bb74cc735e3876e14a697ff2bf'
};
const proKey = {
  client: '5ce5625b4ba66400143d6938',
  public: 'aeec6a4876fd99bb7e26c51c8d3217',
  secret: 'bbeef4b53ac56ae233ed31474ceb4d'
};

export default {
  port,
  proKey,
  secretKey,
  expiredAfter,
  SENDGRID_API_KEY
};
