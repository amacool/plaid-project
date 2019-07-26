'use strict';
const moment = require('moment');
const jsonexport = require('jsonexport');
const fs = require('fs');

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

// Exchange token flow - exchange a Link public_token for
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
    console.log(tokenResponse.access_token);
    
    data.accounts = await getAccountList(tokenResponse.access_token);
    data.transactions = await getTransactionList(tokenResponse.access_token);
    let accountsTemp = data.accounts.accounts;
    let transactionsTemp = data.transactions.transactions;
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
    // generate csv
    let csvTransactions = await jsonToCsv(transactionsTemp);
    let csvAccounts = await jsonToCsv(accountsTemp);

    // attach to email, send email
    let base64data1 = Buffer.from(csvTransactions).toString('base64');
    let base64data2 = Buffer.from(csvAccounts).toString('base64');
    const msg = {
      to: 'goldbyol725@gmail.com',
      from: 'amacool0117@gmail.com',
      subject: 'Account Information',
      text: 'customer account information',
      html: '<strong>customer account, transaction information.</strong>',
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
        },
      ],
    };
    await sgMail.send(msg);
    console.log('sent email ...');
    
    // save to file
    // let filename = 'csv/' + Date.now() + 'transaction.csv';
    // let result = new Promise(resolve => {
    //   fs.writeFile(filename, csv, (err) => {
    //     if (err) {
    //       console.log(err);
    //       resolve(false);
    //     }
    //     resolve(true);
    //   });
    // });
    // if (result) {
    //   console.log("saved csv");
    // }
    
    res.status(200).json({
      data: data,
      status: true
    });
  });
};

exports.getTransactions = async function(req, res) {
  let startDate = moment()
    .subtract(50, 'days')
    .format('YYYY-MM-DD');
  let endDate = moment().format('YYYY-MM-DD');
  client.getTransactions(
    req.body.data,
    startDate,
    endDate,
    {
      count: 60,
      offset: 0
    },
    async function(error, transactionsResponse) {
      if (error != null) {
        console.log(error);
        return res.status(200).json({ status: false, error: error });
      } else {
        let data = {};
        data.accounts = await getAccountList(req.body.data);
        data.transactions = transactionsResponse;
        let accountsTemp = data.accounts.accounts;
        let transactionsTemp = data.transactions.transactions;
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
        // generate csv
        let csvTransactions = await jsonToCsv(transactionsTemp);
        let csvAccounts = await jsonToCsv(accountsTemp);
;
        // attach to email, send email
        let base64data1 = Buffer.from(csvTransactions).toString('base64');
        let base64data2 = Buffer.from(csvAccounts).toString('base64');
        const msg = {
          to: 'goldbyol725@gmail.com',
          from: 'amacool0117@gmail.com',
          subject: 'Account Information',
          text: 'customer account information',
          html: '<strong>customer account, transaction information.</strong>',
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
          },
          ],
        };
        await sgMail.send(msg);
        console.log('sent email ...');
  
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

const getTransactionList = async function(accessToken) {
  return await new Promise(resolve => {
    let startDate = moment()
      .subtract(50, 'days')
      .format('YYYY-MM-DD');
    let endDate = moment().format('YYYY-MM-DD');
    client.getTransactions(
      accessToken,
      startDate,
      endDate,
      {
        count: 60,
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