'use strict';
const moment = require('moment');
const jsonexport = require('jsonexport');

import Config from '../../config';
const { SENDGRID_API_KEY, proKey } = Config;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

const plaid = require('plaid');
// Initialize the Plaid client
const client = new plaid.Client(
  proKey.client,
  proKey.secret,
  proKey.public,
  plaid.environments.production
);

let intervalId = null;
let accessToken1 = null;

exports.getAccessToken = async function(req, res) {
  client.exchangePublicToken(req.body.data, async function(error, tokenResponse) {
    if (error != null) {
      console.log(error);
      return res.status(200).json({ data: null, status: false, error: error.error_message });
    }
    let data = {
      access_token: tokenResponse.access_token,
      item_id: tokenResponse.item_id,
      error: null
    };
    
    res.status(200).json({
      data: data,
      status: true
    });
  });
};

exports.getTransactions = async function(req, res) {
  let startDate = moment()
    .subtract(90, 'days')
    .format('YYYY-MM-DD');
  let endDate = moment().format('YYYY-MM-DD');
  client.getTransactions(
    req.body.data,
    startDate,
    endDate,
    {
      count: 500,
      offset: 0
    },
    async function(error, transactionsResponse) {
      if (error != null) {
        console.log(error);
        return res.status(200).json({ status: false, error: error });
      } else {
        return res.status(200).json({ data: transactionsResponse, status: true });
      }
    }
  );
};

exports.getAccounts = async function(req, res) {
  client.getAccounts(req.body.data, async function(error, accountsResponse) {
    if (error != null) {
      return res.status(200).json({ status: false, error: JSON.stringify(error) });
    } else {
      return res.status(200).json({data: accountsResponse, status: true});
    }
  });
};

exports.getAccountInfo = async function(req, res) {
  console.log('first load');
  accessToken1 = req.body.data;
  let data = await getAccountInfoModule();
  return res.status(200).json({data, status: true});
};

exports.getAccountInfo1 = async function(req, res) {
  console.log('thread start');
  accessToken1 = req.body.data;
  intervalId = setInterval(getAccountInfoModule, 20000);
  return res.status(200);
};

const getAccountInfoModule = async function() {
  console.log('getting account info...');
  let accounts = await getAccountList(accessToken1);
  let transactions = await getTransactionList(accessToken1);
  let accountsTemp = accounts.accounts;
  let transactionsTemp = transactions.transactions;
  if (!accountsTemp) {
    accountsTemp = {result: 'not prepared yet'};
  }
  if (transactionsTemp) {
    transactionsTemp.forEach(item => {
      delete item.category;
      delete item.payment_meta;
    })
  } else {
    transactionsTemp = {result: 'not prepared yet'};
  }
  
  // let ownerInfo = await getOwnerInfo();
  let accountNumber = await getAccountNumber();
  
  // generate csv
  let csvTransactions = await jsonToCsv(transactionsTemp);
  let csvAccounts = await jsonToCsv(accountsTemp);
  let csvAccountNumber = await jsonToCsv(accountNumber);
  // let csvOwnerInfo = await jsonToCsv(ownerInfo);
  
  // attach to email, send email
  let base64data1 = Buffer.from(csvTransactions).toString('base64');
  let base64data2 = Buffer.from(csvAccounts).toString('base64');
  let base64data3 = Buffer.from(csvAccountNumber).toString('base64');
  // let base64data4 = Buffer.from(csvOwnerInfo).toString('base64');
  
  const msg = {
    to: 'admin@fundingtree.io',
    from: 'goldbyol@outlook.com',
    subject: 'Plaid Account Information',
    text: 'This is Plaid account information of your customer.',
    html: '<strong>customer account & transaction information</strong>',
    attachments: [{
      content: base64data1,
      filename: 'transaction-info.csv',
      type: 'plain/text',
      disposition: 'attachment'
    }, {
      content: base64data2,
      filename: 'account-info.csv',
      type: 'plain/text',
      disposition: 'attachment'
    }, {
      content: base64data3,
      filename: 'number-info.csv',
      type: 'plain/text',
      disposition: 'attachment'
    },
    //   {
    //   content: base64data4,
    //   filename: 'owner-info.csv',
    //   type: 'plain/text',
    //   disposition: 'attachment'
    // }
    ],
  };
  if (transactions.transactions) {
    try {
      await sgMail.send(msg);
      console.log('sent email ........................');
      clearInterval(intervalId);
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log('not prepared yet ........................');
  }
  return {accounts, transactions};
};

const getTransactionList = async function(accessToken) {
  return await new Promise(resolve => {
    let startDate = moment()
      .subtract(90, 'days')
      .format('YYYY-MM-DD');
    let endDate = moment().format('YYYY-MM-DD');
    client.getTransactions(
      accessToken,
      startDate,
      endDate,
      {
        count: 500,
        offset: 0
      },
      function (error, transactionsResponse) {
        if (error != null) {
          console.log(error);
          resolve(false);
        } else {
          resolve(transactionsResponse);
        }
      }
    );
  });
};

const getAccountList = async function(accessToken) {
  return await new Promise(resolve => {
    client.getAccounts(accessToken, function(error, accountsResponse) {
      if (error != null) {
        console.log(error);
        resolve(false);
      } else {
        resolve(accountsResponse);
      }
    });
  });
};

const jsonToCsv = async (data) => {
  return await new Promise(resolve => {
    jsonexport(data, function (err, csv) {
      if (err) {
        console.log(err);
        resolve(false);
      }
      resolve(csv);
    });
  });
};

const getOwnerInfo = async () => {
  console.log('get auth info...');
  return await new Promise(resolve => {
    client.getIdentity(accessToken1, (err, result) => {
      // Handle err
      if (err) {
        console.log(err);
        resolve(false);
      }
      const accounts = result.accounts;
      let ownerInfo = [];
      for (const account of accounts) {
        ownerInfo.push(account.owners);
      }
      resolve(ownerInfo);
    });
  });
};

const getAccountNumber = async () => {
  return await new Promise(resolve => {
    client.getAuth(accessToken1, {}, (err, results) => {
      if (err) {
        console.log(err);
        resolve(false);
      }
      let accountNumbers = {};
      let accountData = results.accounts;
      if (results.numbers.ach.length > 0) {
        // Handle ACH numbers (US accounts)
        accountNumbers.achNumbers = results.numbers.ach;
      }
      if (results.numbers.eft.length > 0) {
        // Handle EFT numbers (Canadian accounts)
        accountNumbers.eftNumbers = results.numbers.eft;
      }
      if (results.numbers.international.length > 0) {
        // Handle International numbers (Standard International accounts)
        accountNumbers.internationalNumbers = results.numbers.international;
      }
      if (results.numbers.bacs.length > 0) {
        // Handle BACS numbers (British accounts)
        accountNumbers.bacsNumbers = results.numbers.bacs;
      }
      resolve(accountNumbers);
    });
  });
};