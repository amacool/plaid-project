'use strict';
const moment = require('moment');
const plaid = require('plaid');

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

// Initialize the Plaid client
const client = new plaid.Client(
  proKey.client,
  proKey.secret,
  proKey.public,
  plaid.environments.production
);

// Exchange token flow - exchange a Link public_token for
exports.getAccessToken = async function(req, res) {
  client.exchangePublicToken(req.body.data, function(error, tokenResponse) {
    if (error != null) {
      console.log(error);
      return res.status(200).json({ data: null, status: false, error: error.error_message });
    }
    res.status(200).json({
      data: {
        access_token: tokenResponse.access_token,
        item_id: tokenResponse.item_id,
        error: null
      },
      status: true
    });
  });
};

exports.getTransactions = async function(req, res) {
  // Pull transactions for the Item for the last 30 days
  let startDate = moment()
    .subtract(100, 'days')
    .format('YYYY-MM-DD');
  let endDate = moment().format('YYYY-MM-DD');
  client.getTransactions(
    req.body.data,
    startDate,
    endDate,
    {
      count: 100,
      offset: 0
    },
    function(error, transactionsResponse) {
      if (error != null) {
        return res.status(200).json({ status: false, error: error });
      } else {
        return res.status(200).json({ data: transactionsResponse, status: true });
      }
    }
  );
};

exports.getAccounts = async function(req, res) {
  client.getAccounts(req.body.data, function(error, accountsResponse) {
    if (error != null) {
      return res.status(200).json({ status: false, error: JSON.stringify(error) });
    } else {
      return res.status(200).json({ data: accountsResponse, status: true });
    }
  });
};
